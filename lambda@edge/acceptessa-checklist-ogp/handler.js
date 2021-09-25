'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();

const BOTS = [
  'Twitterbot',
  'facebookexternalhit',
  'line-poker',
  'Discordbot',
  'SkypeUriPreview',
  'Slackbot-LinkExpanding',
  'PlurkBot',
];

function generateOGP(exhibition, circle) {
  // console.log(circle);
  if (circle) {
    // サークル個別のOGP
    return `
      <!doctype html>
      <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title></title>
        <meta content="${exhibition.exhibition_name} に参加する ${circle.circle_name}(${circle.penname}) のお品書きです。" name="description">
        <meta content="article" property="og:type" />
        <meta content="ja_JP" property="og:locale" />
        <meta content="${circle.circle_name} のお品書き (${exhibition.exhibition_name})" property="og:title" />
        <meta content="${exhibition.exhibition_name} に参加する ${circle.circle_name}(${circle.penname}) のお品書きです。" property="og:description" />
        <meta content="${circle.circlecut}" property="og:image" />
      </head>
      <body>
      </body>
      </html>
    `;
  } else {
    // 全体のOGP
    return `
      <!doctype html>
      <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title></title>
        <meta content="${exhibition.exhibition_name} のサークル一覧です。ログインするとチェックリストの作成ができます。" name="description">
        <meta content="article" property="og:type" />
        <meta content="ja_JP" property="og:locale" />
        <meta content="${exhibition.exhibition_name} のサークル一覧" property="og:title" />
        <meta content="${exhibition.exhibition_name} のサークル一覧です。ログインするとチェックリストの作成ができます。" property="og:description" />
      </head>
      <body>
      </body>
      </html>
    `;
  }
}

module.exports.ogp = async (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const userAgent = request.headers['user-agent'][0].value;
  const isBot = BOTS.some((v) => { return userAgent.includes(v) });

  if (!isBot) {
    return request;
  }
  const param = [...new URLSearchParams(request.querystring).entries()].reduce((obj, e) => ({ ...obj, [e[0]]: e[1] }), {});

  if (!param.e) {
    return request;
  }

  const ret = await s3.getObject({ Bucket: 'acceptessa-data', Key: `${param.e}.json` }).promise();
  const data = JSON.parse(ret.Body.toString());

  // console.log(data);
  // console.log(data.circles);
  // console.log("ogp: ", userAgent);
  const filtered = data.circles.filter(c => c.circle_id === param.circle_id);
  const body = generateOGP(data.exhibition, filtered.length ? filtered[0] : null);

  return {
    status: '200',
    statusDescription: 'OK',
    headers: {
      'content-type': [{ key: 'Content-Type', value: 'text/html', },],
    },
    body,
  }
};