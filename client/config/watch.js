const chokidar = require("chokidar");
const build = require("./build");

const watcher = chokidar.watch("./config/", { persistent: true });

console.log("Start watching config...\n");

watcher.on("change", (path) => {
  if (!path.match(/\.yaml$/)) {
    return;
  }

  console.log(`!!!!! ${path} has been changed`);
  const splitted = path.split("/");
  const exhibition = splitted[splitted.length - 2];
  build(exhibition);
});
