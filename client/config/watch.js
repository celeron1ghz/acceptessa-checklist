const chokidar = require("chokidar");
const build = require("./build");
const path = require('path');

const targetPath = path.resolve("./config/");
const watcher = chokidar.watch(targetPath, { persistent: true });

console.log(`Start watching config: ${targetPath}`);

watcher.on("change", (path) => {
  if (!path.match(/\.yaml$/)) {
    return;
  }

  console.log(`!!!!! ${path} has been changed`);
  const splitted = path.split("/");
  const exhibition = splitted[splitted.length - 2];
  build(exhibition, process.argv[2], process.argv[3]);
});
