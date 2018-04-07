'use strict';

const vo  = require('vo');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const ssm = new aws.SSM();
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

const COMMANDS = {
  list:   require('../command/ListFavoriteCommand'),
  add:    require('../command/AddFavoriteCommand'),
  remove: require('../command/RemoveFavoriteCommand'),
  update: require('../command/UpdateFavoriteCommand'),
  public: require('../command/PublicLinkCommand'),
};

module.exports.endpoint = (event, context, callback) => {
  return vo(function*(){
    let token;

    try {
      const token_matched = event.headers.Authorization.match(/^Bearer\s+(.*?)$/);
      token = token_matched[1];
    } catch(e) {
      throw { code: 400, message: 'INVALID_HEADER' };
    }

    const secret = yield ssm.getParameter({ Name: '/tessa_checklist/jwt_secret', WithDecryption: true }).promise().then(d => d.Parameter.Value);
    let sess;
    try {
      sess = jwt.verify(token, secret);
    } catch(e) {
      throw { code: 401, message: 'INVALID_TOKEN' };
    }


    let user;
    try {
      user = yield dynamodb.get({
        TableName: "tessa_session",
        Key: { "uid": sess.sessid },
        AttributesToGet: ['twitter_id', 'screen_name', 'display_name', 'profile_image_url'],
      }).promise().then(data => data.Item);
    } catch(e) {
      throw e; // maybe dynamodb's internal error
    }

    if (!user) {
      throw { code: 401, message: 'EXPIRED' };
    }


    let body;
    try {
      body = JSON.parse(event.body);
    } catch(e) {
      throw { code: 400, message: 'INVALID_BODY' };
    }

    const cmd = COMMANDS[body.command];
    if (!cmd) {
      throw { code: 400, message: 'INVALID_COMMAND' };
    }


    let obj;
    try {
      obj = new cmd(body,user);
    } catch(e) {
      throw { code: 400, message: 'INVALID_PARAM' };
    }


    try {
      const ret = yield obj.run();

      return callback(null, {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(ret),
      });

    } catch(e) {
      throw { code: 400, message: 'INTERNAL_ERROR' };
    }

  }).catch(err => {
    let code;
    let mess;

    if (err instanceof Error) {
      console.log("Unknown error on endpoint:", err);
      code = 500;
      mess = "INTERNAL_ERROR";
    } else {
      console.log("ValidationError:", err.message);
      code = err.code;
      mess = err.message;
    }

    return callback(null, {
      statusCode: code,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: mess }),
    });
  });
};

module.exports.public = (event, context, callback) => {
  return vo(function*(){
    const member_id     = event.queryStringParameters.mid;
    const exhibition_id = event.pathParameters.eid;

    const config = yield dynamodb.get({
      TableName: "tessa_config",
      Key: { member_id: member_id, exhibition_id: exhibition_id },
    }).promise().then(data => data.Item);

    if (!config || !config.public) {
      return callback(null, {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({}),
      });
    }

    const ret = yield new COMMANDS.list({ exhibition_id }, { screen_name: member_id }).run();
    return callback(null, {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(ret),
    })

  }).catch(err => {
    return callback(null, {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    });

  });
};