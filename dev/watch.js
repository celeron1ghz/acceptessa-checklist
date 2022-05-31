const chokidar = require("chokidar");
const build = require("../client/config/build");
const path = require('path');

const configPath = path.resolve(__dirname + "/config/");
const publishPath = path.resolve(__dirname + "/public/");
const watcher = chokidar.watch(configPath, { persistent: true });

console.log(`Start watching config: ${configPath}`);

watcher.on("change", (path) => {
  if (!path.match(/\.yaml$/)) {
    return;
  }

  console.log(`!!!!! ${path} has been changed`);
  const splitted = path.split("/");
  const exhibition = splitted[splitted.length - 2];
  build(exhibition, configPath, publishPath);
});