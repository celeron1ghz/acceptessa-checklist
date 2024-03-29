'use strict';

const jwt       = require('jsonwebtoken');
const uniqid    = require('uniqid');
const Cookie    = require('cookie');
const aws       = require('aws-sdk');
const dynamodb  = new aws.DynamoDB.DocumentClient();

const OAuth   = require('oauth').OAuth;
const Twitter = require('twitter');

const SESSION_TABLE = 'tessa_session';

class TwitterOAuth {
  static createInstance(event){
    return new TwitterOAuth(
      event,
      process.env.SSM_KEY_CONSUMER_KEY,
      process.env.SSM_KEY_CONSUMER_SECRET
    );
  }

  constructor(event, key, secret) {
    this.consumer_key    = key;
    this.consumer_secret = secret;

    // fix path for aws's auto-assigned URL and mydomain
    // const innerPath = event.path;
    // const outerPath = event.requestContext.path;
    // const cbPath    = outerPath.replace(innerPath, "/api/auth/callback");
    const innerPath = event.path;
    const outerPath = event.requestContext.path;
    const cbPath    = innerPath.replace("start", "callback");

    // const callback = 'https://' + event.headers.Host + cbPath;
    const callback = 'https://' + process.env.SERVE_HOST + cbPath;

    this.oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      key,
      secret,
      '1.0A',
      callback,
      'HMAC-SHA1'
    );
  }

  getOAuthRequestToken() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
        if (error) { reject(error) }
        else       { resolve({ oauth_token, oauth_token_secret, results })  }
      });
    });
  }

  getOAuthAccessToken(token, secret, verifier) {
    return new Promise((resolve,reject) => {
      this.oauth.getOAuthAccessToken(token, secret, verifier, (error, access_token, access_token_secret, results) => {
        if (error) { reject(error) }
        else       { resolve({ access_token, access_token_secret, results })  }
      });
    });
  }

  call_get_api(token, token_secret, path, param) {
    const client = new Twitter({
      consumer_key:         this.consumer_key,
      consumer_secret:      this.consumer_secret,
      access_token_key:     token,
      access_token_secret:  token_secret,
    });

    return client.get(path, param);
  }
}

const ROUTE = {
  start: async (event, context, callback) => {
    try {
      const uid   = uniqid();
      const oauth = TwitterOAuth.createInstance(event);
      const auth  = await oauth.getOAuthRequestToken();

      const ret = await dynamodb.put({
        TableName: SESSION_TABLE,
        Item: {
          uid: uid,
          ttl: (new Date().getTime() / 1000 + 60 * 24),
          session: auth.oauth_token_secret,
        },
      }).promise();

      return callback(null, {
        statusCode: 302,
        body:       '',
        headers:    {
          'Location': 'https://twitter.com/oauth/authenticate?oauth_token=' + auth.oauth_token,
          'Set-Cookie': 'sessid=' + uid + '; secure;',
        },
      });
    } catch (err) {
      console.log("Error on auth:", err);
      return callback(null, { statusCode: 500, body: "ERROR!" });
    }
  },

  callback: async (event, context, callback) => {
    try {
      if (!event.headers.Cookie) {
        throw { code: 400, message: 'NO_DATA' };
      }

      const sessid = Cookie.parse(event.headers.Cookie).sessid;
      const row    = await dynamodb.get({ TableName: SESSION_TABLE, Key: { "uid": sessid } }).promise();

      if (!row.Item) {
        throw { code: 401, message: 'NO_DATA' };
      }

      const oauth = TwitterOAuth.createInstance(event);
      const oauth_token_secret = row.Item.session;

      const query = event.queryStringParameters;
      const ret = await oauth.getOAuthAccessToken(query.oauth_token, oauth_token_secret, query.oauth_verifier);
      const me  = await oauth.call_get_api(ret.access_token, ret.access_token_secret, "account/verify_credentials", {});

      console.log(JSON.stringify({ status: "success", id: me.screen_name, name: me.name }));

      await dynamodb.put({
        TableName: SESSION_TABLE,
        Item: {
          uid:                  sessid,
          twitter_id:           me.id_str,
          screen_name:          me.screen_name,
          display_name:         me.name,
          profile_image_url:    me.profile_image_url_https,
          access_token:         ret.access_token,
          access_token_secret:  ret.access_token_secret,
          ttl:                  Math.floor(new Date().getTime() / 1000 + (60 * 60 * 24)),
        },
      }).promise();

      const signed = jwt.sign({ sessid: sessid }, process.env.SSM_KEY_JWT_SECRET);

      return callback(null, {
        statusCode: 200,
        headers: { 'Content-Type': "text/html"},
        body: `<script>window.opener.postMessage("${signed}", "*"); window.close();</script>`,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error on callback:", err);
        return callback(null, { statusCode: 500,      body: JSON.stringify({ error: err.message }) });
      } else {
        return callback(null, { statusCode: err.code, body: JSON.stringify({ error: err.message }) });
      }
    }
  },

  me: async (event, context, callback) => {
    try {
      if (!event.headers.Authorization) {
        throw { code: 400, message: 'INVALID_HEADER' };
      }

      const token_matched = event.headers.Authorization.match(/^Bearer\s+(.*?)$/);

      if (!token_matched) {
        throw { code: 400, message: 'INVALID_HEADER' };
      }

      const token  = token_matched[1];
      let sessid;

      try {
        const data = jwt.verify(token, process.env.SSM_KEY_JWT_SECRET);
        sessid = data.sessid;
      } catch(e) {
        console.log("Error on jwt verify:", e.toString());
        throw { code: 401, message: 'INVALID_HEADER' };
      }

      const ret = await dynamodb.get({
        TableName: SESSION_TABLE,
        Key: { "uid": sessid },
        AttributesToGet: ['twitter_id', 'screen_name', 'display_name', 'profile_image_url']
      }).promise();

      const row = ret.Item;

      if (!row) {
        throw { code: 401, message: 'DATA_NOT_EXIST' };
      }

      if (!row.twitter_id) {
        throw { code: 401, message: 'DATA_NOT_EXIST' };
      }

      return callback(null, {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(row),
      });
    } catch(err) {
      let code;
      let mess;
      console.log("ERROR:", err);

      if (err instanceof Error) {
        code = 500;
        mess = 'INTERNAL_ERROR';
      } else {
        code = err.code;
        mess = err.message;
      }

      return callback(null, {
        statusCode: code,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: mess }),
      });
    }
  },
};

module.exports.auth = (event, context, callback) => {
  const action = event.path.split('/')[3];
  const method = ROUTE[action];

  if (method) {
    method(event, context, callback);
  } else {
    console.log("Unknown path:", event.path);
    callback("NG");
  }
};