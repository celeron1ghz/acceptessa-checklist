const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const stat = Promise.denodeify(fs.stat);
const copyFile = Promise.denodeify(fs.copyFile);

const copyFiles = {
  "not_uploaded.png": "$EID/not_uploaded.png",
  "map.png": "$EID/map.png",
  "config.json": "$EID.json",
};

async function build() {
  const CONFIG_DIR = __dirname;
  const PUBLISH_DIR = path.resolve('./public');

  console.log("CONFIG_DIR:", CONFIG_DIR);
  console.log("PUBLISH_DIR:", PUBLISH_DIR);

  const dirs = fs
    .readdirSync(CONFIG_DIR)
    .filter(f => fs.statSync(CONFIG_DIR + "/" + f).isDirectory())
    .filter(f => !f.match(/^\./));

  for (const eid of dirs) {
    const edir = `${PUBLISH_DIR}/${eid}`;

    try {
      fs.mkdirSync(edir);
    } catch (e) {
      if (e.code !== "EEXIST") {
        console.log("ERROR:", e);
      }
    }

    for (let [fromBasename,destBasename] of Object.entries(copyFiles)) {
      destBasename = destBasename.replaceAll("$EID", eid);

      const from = `${CONFIG_DIR}/${eid}/${fromBasename}`;
      const dest = `${PUBLISH_DIR}/${destBasename}`;

      await stat(from)
        .then(data => {
          console.log(`[${eid}] <COPY>  ${dest}, size=${data.size}`);
          return copyFile(from, dest);
        })
        .catch(err => {
          console.log(`[${eid}] <ERROR> ${err.message}`);
        });
    }
  }
}

module.exports = build;

if (require.main === module) {
  build();
}
