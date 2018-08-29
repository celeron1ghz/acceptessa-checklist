'use strict';

process.env.AWS_REGION = 'ap-northeast-1';

const _ = require('underscore');
const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB.DocumentClient({ convertEmptyValues: true });

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds));
const COUNT = {};

let LastEvaluatedKey;
let ttl = 0;

(async () => {
    //
    // first, delete count table contents
    //
    ttl = 0;
    while (1)   {
      const param = { TableName: 'tessa_favorite_count', Limit: 25 };

      if (LastEvaluatedKey != null) {
        param.ExclusiveStartKey = LastEvaluatedKey;
      }

      const ret = await dynamodb.scan(param).promise();
      const deleteParam = ret.Items.map(item => {
        return { DeleteRequest: { Key: { circle_id: item.circle_id } } };
      });

      if (deleteParam.length == 0)  {
        break;
      }

      ttl += deleteParam.length;

      await dynamodb.batchWrite({
        RequestItems: { 'tessa_favorite_count': deleteParam ,}
      }).promise();

      if (ret.LastEvaluatedKey != null)   {
        LastEvaluatedKey = ret.LastEvaluatedKey;
      } else {
        break;
      }

      await wait(5000);
    }
    console.log("CLEAR_RECORDS ==>", ttl);


    //
    // second, calculate total
    //
    ttl = 0;
    while (1)   {
      const param = { TableName: 'tessa_favorite', Limit: 500 };
      if (LastEvaluatedKey != null) {
        param.ExclusiveStartKey = LastEvaluatedKey;
      }

      const ret = await dynamodb.scan(param).promise();

      for (const item of ret.Items) {
        if (!COUNT[item.circle_id]) COUNT[item.circle_id] = 0;
        COUNT[item.circle_id]++;
        ttl++;
      }

      if (ret.LastEvaluatedKey != null)   {
        LastEvaluatedKey = ret.LastEvaluatedKey;
      } else {
        break;
      }

      await wait(5000);
    }
    console.log("GOT_RECORD ==>", ttl);


    //
    // third, update dynamodb
    //
    ttl = 0;
    for ( const data of _.chunk(_.pairs(COUNT), 25))    {
      const putParam = data.map(item => {
        return { PutRequest: { Item: { circle_id: item[0], count: item[1] } } };
      });

      if (putParam.length == 0)  {
        break;
      }

      ttl += putParam.length;

      await dynamodb.batchWrite({
        RequestItems: { 'tessa_favorite_count': putParam },
      }).promise();

      await wait(10000);
    }
    console.log("CREATE_RECORD ==>", ttl);
})();
