const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

class UpdateFavoriteCommand {
  constructor(args,user){
    if (!args.circle_id) { throw new Error("not circle_id") }
    if (!user.screen_name) { throw new Error("not screen_name") }
    this.circle_id = args.circle_id;
    this.member_id = user.screen_name;
    this.comment   = args.comment;
  }

  run() {
    return dynamodb.update({
      TableName: "tessa_favorite",
      Key: { circle_id: this.circle_id, member_id: this.member_id },
      UpdateExpression: 'set #comment = :comment',
      ExpressionAttributeNames: {'#comment' : 'comment'},
      ExpressionAttributeValues: { ':comment' : this.comment },
    }).promise();
  }
}

module.exports = UpdateFavoriteCommand;