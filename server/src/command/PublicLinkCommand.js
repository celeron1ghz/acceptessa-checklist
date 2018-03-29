const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

class PublicLinkCommand {
  constructor(args,user){
    if (!args.exhibition_id)  { throw new Error("not exhibition_id") }
    if (!user.screen_name)    { throw new Error("not screen_name") }
    this.exhibition_id = args.exhibition_id;
    this.member_id     = user.screen_name;
    this.public        = args.public;
  }

  run() {
    return dynamodb.put({
      TableName: "tessa_config",
      Item: {
        member_id: this.member_id,
        exhibition_id: this.exhibition_id,
        public: this.public,
        created_at: new Date().getTime() / 1000,
      },
    }).promise()
  }
}

module.exports = PublicLinkCommand;