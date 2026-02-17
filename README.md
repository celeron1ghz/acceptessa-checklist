# HOW TO USE

## map_data_generator
まずはマップのデータを作る。

```
npm i
npm run dev
## ブラウザでデータを作成...
```

## 新しくデータを作るとき
作成したjsonファイルを `config` に置く。
下記の例では即売会名をtestとする。

 * `mkdir config/v2/test`
 * `test` 以下に下記ファイルを置く
   * config.yaml - map_data_generatorで作ったもの
   * config.json - map_data_generatorで作ったもの
   * map.png - mapの画像
   * not_uploaded.png - サークルカット未アップロード時に使う画像（任意）
 * ` node config/v2/build.js`
   * 作成したデータはv1,v2両方に配置される
 * client v1の場合
   * `cd client`
   * `sh refresh-assets.sh`
 * client v2の場合
   * 移行後に考える

## client
```
cd client
npm run start
```

## client-v2
```
cd client-v2
npm run dev
```
