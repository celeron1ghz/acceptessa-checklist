# インストール方法

## nodejs を入れる

nodejs はがんばってインストールする。

下記のように `node -v` と打ってエラーが出ずにバージョンが出れば OK。

```
$ node -v
v10.19.0
```

## ソースコードをダウンロード

```
git clone git@github.com:celeron1ghz/acceptessa-checklist.git

cd acceptessa-checklist/client

npm i
```

上記でいろいろとインストールされる。インストール後に以下を打ってサーバを起動する

```
npm run start
```

だいたい下記のようなメッセージが出ればサーバは起動している。

```
Compiled successfully!

You can now view acceptessa-checklist in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://172.18.70.173:3000

Note that the development build is not optimized.
To create a production build, use yarn build.
```

上記起動後に下記にアクセスして、チェックリストが表示されればインストールは OK。

http://localhost:3000/?e=nijisanji
