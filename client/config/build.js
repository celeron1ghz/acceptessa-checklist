const Promise = require('promise');
const fs = require('fs');
const DIR = './config/';

const stat      = Promise.denodeify(fs.stat);
const readFile  = Promise.denodeify(fs.readFile);
const copyFile  = Promise.denodeify(fs.copyFile);
const writeFile = Promise.denodeify(fs.writeFile);

const dirs = fs.readdirSync(DIR).filter(f => fs.statSync(DIR + f).isDirectory());

(async function(){
  for (const dir of dirs) {
    console.log("GENERATE:", dir);

    const config = await readFile(DIR + dir + "/config.json")
      .then(data => JSON.parse(data.toString()))
      .catch(err => {
        console.log("ERROR:", err);
      });

    const image = DIR + dir + "/not_uploaded.png";

    await stat(image)
      .then(data => {
        console.log("  NOT_UPLOADED_IMAGE:", data.size);
        config.not_uploaded_image = `/${dir}.png`;
        return copyFile(image, `./public/${dir}.png`);
      })
      .catch(err => {
        console.log("  NOT_UPLOADED_IMAGE:", err.message);
      });

    await writeFile(`./public/${dir}.json`, JSON.stringify(config));
  }
})();