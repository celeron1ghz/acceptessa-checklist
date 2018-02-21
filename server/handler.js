'use strict';

const vo  = require('vo');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
const ssm = new aws.SSM();
const dynamodb = new aws.DynamoDB.DocumentClient();

class ListFavoriteCommand {
  constructor(args){
    if (!args.exhibition_id)  { throw new Error("not exhibition_id") }
    if (!args.member_id)      { throw new Error("not member_id") }
    this.exhibition_id = args.exhibition_id;
    this.member_id     = args.member_id;
  }

  run() {
    return dynamodb.query({
      TableName: 'tessa_favorite',
      IndexName: 'tessa_favorite_gsi1',
      KeyConditionExpression: 'member_id = :member_id and exhibition_id = :exhibition_id',
      ExpressionAttributeValues: { ':member_id': this.member_id, ':exhibition_id': this.exhibition_id },
    }).promise().then(data => data.Items);
  }
}

class AddFavoriteCommand {
  constructor(args){
    if (!args.circle_id) { throw new Error("not circle_id") }
    if (!args.member_id) { throw new Error("not member_id") }
    if (!args.exhibition_id)  { throw new Error("not exhibition_id") }
    this.circle_id = args.circle_id;
    this.member_id = args.member_id;
    this.exhibition_id = args.exhibition_id;
  }

  run() {
    return dynamodb.put({
      TableName: "tessa_favorite",
      Item: {
        circle_id: this.circle_id,
        member_id: this.member_id,
        exhibition_id: this.exhibition_id,
        created_at: new Date().getTime() / 1000,
      },
    }).promise();
  }
}

class RemoveFavoriteCommand {
  constructor(args){
    if (!args.circle_id) { throw new Error("not circle_id") }
    if (!args.member_id) { throw new Error("not member_id") }
    if (!args.exhibition_id)  { throw new Error("not exhibition_id") }
    this.circle_id = args.circle_id;
    this.member_id = args.member_id;
    this.exhibition_id = args.exhibition_id;
  }

  run() {
    return dynamodb.delete({
      TableName: "tessa_favorite",
      Key: {
        circle_id: this.circle_id,
        member_id: this.member_id,
      },
    }).promise();
  }
}

const COMMANDS = {
  list:   ListFavoriteCommand,
  add:    AddFavoriteCommand,
  remove: RemoveFavoriteCommand,
};

module.exports.endpoint = (event, context, callback) => {
  return vo(function*(){
    let token;

    try {
      const token_matched = event.headers.Authorization.match(/^Bearer\s+(\w+\.\w+\.\w+)$/);
      token = token_matched[1];
    } catch(e) {
      throw { code: 400, message: 'INVALID_HEADER' };
    }

    const secret = (yield ssm.getParameter({ Name: '/twitter_oauth/jwt_token', WithDecryption: true }).promise() ).Parameter.Value;
    let sess;
    try {
      sess = jwt.verify(token, secret);
    } catch(e) {
      throw { code: 401, message: 'INVALID_TOKEN' };
    }


    let user;
    try {
      user = yield dynamodb.get({
        TableName: "twitter_oauth",
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

    try {
      const ret = yield new cmd(body).run();
      return callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin,
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(ret),
      });

    } catch(e) {
      console.log(e);
      throw { code: 400, message: 'INVALID_PARAM' };
    }

  }).catch(err => {
    let code;

    if (err instanceof Error) {
      console.log("Error on endpoint:", err);
      code = 500;
    } else {
      code = err.code;
    }

    return callback(null, {
      statusCode: code,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin,
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: err.message }),
    });
  });
};
