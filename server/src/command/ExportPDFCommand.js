const aws = require('aws-sdk');
const s3  = new aws.S3();
const wkhtmltopdf = require('aws-wkhtmltopdf');
const command = require('./ListFavoriteCommand');
const fetch = require('node-fetch');
const _ = require('lodash');

class ExportPDFCommand {
  constructor(args,user){
    if (!user.screen_name) { throw new Error("not screen_name") }
    if (!args.exhibition_id)  { throw new Error("not exhibition_id") }
    this.member_id = user.screen_name;
    this.exhibition_id = args.exhibition_id;
    this.user = user;
  }

  sort(data, sort_order) {
    const sortMap = _.zipObject(sort_order, _.range(sort_order.length));
    const sorter = (a,b) => {
      if (sortMap[a] > sortMap[b]) {
        return 1;
      }
      if (sortMap[a] < sortMap[b]) {
        return -1;
      }
      return 0;
    };

    return data.sort((a,b) => {
      const sym = sorter(a.space_sym, b.space_sym);
      if (sym !== 0) return sym;

      if (a.space_num > b.space_num) {
        return 1;
      }
      if (a.space_num < b.space_num) {
        return -1;
      }
      return 0;
    });
  }

  run() {
    return (async () => {
      const favs = await new command({ exhibition_id: this.exhibition_id }, { screen_name: this.member_id }).run();
      const data = await fetch(`https://data.familiar-life.info/${this.exhibition_id}.json`).then(data => data.json());

      const circleIdx = {};
      const exhibition = data.exhibition;

      for (const c of data.circles) {
        circleIdx[c.circle_id] = c;
      }

      const favorites = this.sort(
        favs.favorite.map(f => { return { ...circleIdx[f.circle_id], ...f }}),
        data.sort_order,
      );

      const html = `
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<style>
// original from http://fonts.googleapis.com/earlyaccess/notosansjapanese.css
/*
 * Noto Sans Japanese (japanese) http://www.google.com/fonts/earlyaccess
 */
@font-face {
  font-family: 'Noto Sans Japanese';
  font-style: normal;
  font-weight: 200;
  src: url(http://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Light.otf) format('opentype');
}

@font-face {
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 400;
   src: url(http://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.otf) format('opentype');
}

@font-face {
   font-family: 'Noto Sans Japanese';
   font-style: normal;
   font-weight: 700;
   src: url(http://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.otf) format('opentype');
}

* { font-family: 'Noto Sans Japanese'; font-size: 10px; }
td:nth-child(1) { width: 25px; text-align: center }
td:nth-child(2) { width: 40px }
td:nth-child(3) { width: 200px }
td:nth-child(4) { width: 200px }
td:nth-child(5) { width: 150px }
.text-muted { color: #ccc }
</style>
</head>
<body>
<h4>
  チェックリスト (${exhibition.exhibition_name} - ${favs.favorite.length}件)
  <div class="pull-right text-right text-muted" style="font-size: 12px">
    ユーザ：${this.user.display_name} (@${this.user.screen_name})
    <br/>
    作成日付：${new Date().toISOString()}  
  </div>
</h4>
<table class="table table-striped table-bordered table-condensed">
  <tr>
    <th class="text-center">#</th>
    <th>場所</th>
    <th>サークル</th>
    <th>お品書き</th>
    <th>コメント</th>
  </tr>
${favorites.map((c,idx) => {
  return `
    <tr>
      <td>${idx+1}</td>
      <td>${c.space_sym}-${c.space_num}</td>
      <td>${c.circle_name} (${c.penname})</td>
      <td>${c.circle_comment || '<span class="text-muted">(なし)</span>'}</td>
      <td>${c.comment || '<span class="text-muted">(なし)</span>'}</td>
    </tr>
  `;
}).join("")}
</table>
</body>
</html>
      `;

      const pdf = await wkhtmltopdf(html);
      const basename = `${this.exhibition_id}/${this.user.screen_name}.pdf`;

      await s3.putObject({
        Bucket: 'acceptessa-checklist-export',
        Key: basename,
        Body: pdf,
      }).promise()

      return { url: `http://${process.env.S3BUCKET_PUBLIC_URL}/${basename}` }
    })();
  }
}

module.exports = ExportPDFCommand;