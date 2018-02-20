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
  vo(function*(){
    if (!event.headers.Authorization) {
      throw { code: 400, message: 'INVALID_HEADER' };
    }

    const token_matched = event.headers.Authorization.match(/^Bearer\s+(\w+\.\w+\.\w+)$/);

    if (!token_matched) {
      throw { code: 400, message: 'INVALID_HEADER' };
    }

    const token  = token_matched[1];
    const secret = (yield ssm.getParameter({ Name: '/twitter_oauth/jwt_token', WithDecryption: true }).promise() ).Parameter.Value;
    let sessid;

    try {
      const data = jwt.verify(token, secret);
      sessid = data.sessid;
    } catch(e) {
      console.log("Error on jwt verify:", e.toString());
      throw { code: 400, message: 'INVALID_HEADER' };
    }

    let body;

    try {
      body = JSON.parse(event.body);
    } catch(e) {
      throw { code: 401, message: 'INVALID_BODY' };
    }

    const cmd = COMMANDS[body.command];

    if (!cmd) {
      throw { code: 401, message: 'INVALID_BODY' };
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
      throw { code: 401, message: 'INVALID_BODY' };
    }

  }).catch(err => {
    if (err instanceof Error) {
      console.log("Error on endpoint:", err);
      return callback(null, {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin,
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: err.message }),
      });
    } else {
      return callback(null, {
        statusCode: err.code,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin,
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: err.message }),
      });
    }
  });
};
