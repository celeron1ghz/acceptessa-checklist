const Promise = require('promise');
const fs = require('fs');
const DIR = './config/';

const stat      = Promise.denodeify(fs.stat);
const copyFile  = Promise.denodeify(fs.copyFile);
const writeFile = Promise.denodeify(fs.writeFile);

const dirs = fs.readdirSync(DIR).filter(f => fs.statSync(DIR + f).isDirectory());

(async function(){
  for (const dir of dirs) {
    console.log("GENERATE:", dir);

    const config = require('./' + dir + "/config.js");

    for (const image of ["/not_uploaded.png", "/map.png"].map(f =>  DIR + dir + f)) {
      await stat(image)
        .then(data => {
          console.log("  OK:", image, data.size);
          config.not_uploaded_image = `/${dir}.png`;
          return copyFile(image, `./public/${dir}.png`);
        })
        .catch(err => {
          console.log("  ERROR:", image, err.message);
        });

      await writeFile(`./public/${dir}.json`, JSON.stringify(config));
    }
  }
})();