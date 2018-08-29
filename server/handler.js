const Main = require('./src/handler/handler');
const Auth = require('./src/handler/auth');
module.exports.endpoint = Main.endpoint;
module.exports.public = Main.public;
module.exports.auth = Auth.auth;
 
const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

module.exports.stream = async (event, context, callback) => {
  for (const e of event.Records) {
    const data = e.dynamodb;
    const keys = data.Keys;

    const circle_id = keys.circle_id.S;
    const num = e.eventName === "INSERT" ? 1 : -1;

    await dynamodb.update({
      TableName: 'tessa_favorite_count',
      Key: { circle_id: circle_id },
      UpdateExpression: "ADD #count :i",
      ExpressionAttributeNames: { '#count': 'count' },
      ExpressionAttributeValues: { ':i': num },
      ReturnValues: 'NONE',
    }).promise();
  }

  callback(null, 'OK');
};
