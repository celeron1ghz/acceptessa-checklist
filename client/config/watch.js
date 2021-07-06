const chokidar = require("chokidar");
const build = require("./build");

const watcher = chokidar.watch("./config/", {
  persistent: true,
});

console.log("Start watching config...");

watcher.on("change", (path) => {
  if (!path.match(/\.yaml$/)) {
    return;
  }

  console.log(`${path} has been changed`);
  build();
});
