const Promise = require('promise');
const yaml = require('js-yaml');
const fs = require('fs');
const CONFIG_DIR = './config/';

const stat      = Promise.denodeify(fs.stat);
const copyFile  = Promise.denodeify(fs.copyFile);
const writeFile = Promise.denodeify(fs.writeFile);
const dirs = fs.readdirSync(CONFIG_DIR).filter(f => fs.statSync(CONFIG_DIR + f).isDirectory());

(async function(){
  for (const eid of dirs) {
    const edir = `./public/${eid}`;

    try {
      fs.mkdirSync(edir);
    } catch(e) {
      if (e.code !== "EEXIST") {
        console.log("ERROR:", e);
      }
    }

    //const config = require(`./${eid}/config.js`);
    const file = `${__dirname}/${eid}/config.yaml`;

    try {
      await stat(file);
      const value = fs.readFileSync(file);
      const config = yaml.safeLoad(value.toString());
      console.log(config);
    } catch (e) {
      console.log("Error on ", eid);
      console.log(e.toString());
      console.log("-------------");
    }

    //await writeFile(`./public/${eid}.json`, JSON.stringify(config));

/*
    for (const file of ["not_uploaded.png", "map.png"]) {
      const from = `${CONFIG_DIR}${eid}/${file}`;
      const dest = `./public/${eid}/${file}`;

      await stat(from)
        .then(data => {
          console.log("  OK:", from, data.size);
          return copyFile(from, dest);
        })
        .catch(err => {
          console.log("  ERROR:", from, err.message);
        });
    }
*/
  }
})();
