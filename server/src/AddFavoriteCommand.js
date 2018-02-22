const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

class AddFavoriteCommand {
  constructor(args,user){
    if (!args.circle_id) { throw new Error("not circle_id") }
    if (!user.screen_name) { throw new Error("not screen_name") }
    if (!args.exhibition_id)  { throw new Error("not exhibition_id") }
    this.circle_id = args.circle_id;
    this.member_id = user.screen_name;
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

module.exports = AddFavoriteCommand;