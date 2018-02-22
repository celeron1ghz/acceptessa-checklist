const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

class RemoveFavoriteCommand {
  constructor(args,user){
    if (!args.circle_id) { throw new Error("not circle_id") }
    if (!user.screen_name) { throw new Error("not screen_name") }
    this.circle_id = args.circle_id;
    this.member_id = user.screen_name;
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

module.exports = RemoveFavoriteCommand;