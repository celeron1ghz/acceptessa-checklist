const Promise = require('promise');
const yaml = require('js-yaml');
const fs = require('fs');
const CONFIG_DIR = './config/';
const _ = require('lodash');

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

    try {
      console.log("----------------------------------------------------------------------------------------------------");
      //const config = require(`./${eid}/config.js`);
      const file = `${__dirname}/${eid}/config.yaml`;
      await stat(file);

      const value = fs.readFileSync(file);
      const config = yaml.safeLoad(value.toString());

      const width = config.space_width;
      const height = config.space_height;
      const vertical_syms   = config.vertical_syms   || [];
      const horizontal_syms = config.horizontal_syms || [];

      const mappings = [ 
        ..._.flattenDeep([
          vertical_syms.map(sym => {
            let idx = sym.idx || 1;
            return _.zip(_.range(idx, idx + sym.tops.length), sym.tops).map(p => {
              return {
                sym: sym.sym,
                left: sym.left,
                num: p[0],
                top: p[1],
                width,
                height,
              };  
            })  
          }), 

          horizontal_syms.map(sym => {
            let idx = sym.idx || 1;
            return _.zip(_.range(idx, idx + sym.lefts.length), sym.lefts).map(p => {
              return {
                sym: sym.sym,
                left: p[1],
                num: p[0],
                top: sym.top,
                width: height,
                height: width,
              };  
            })  
          })
        ]),
        { sym: "企業", num: 1, left: 51,  top: 62, width: 69, height: 21 },
        { sym: "企業", num: 2, left: 147, top: 62, width: 69, height: 21 },
      ];

      const data = {
        tweet: config.tweet,
        map: {
          image_width: config.image_width,
          image_height: config.image_height,
          mappings,
        }
      };

      await writeFile(`./public/${eid}.json`, JSON.stringify(data));
      console.log(`OK ./public/${eid}.json`);
    } catch (e) {
      console.log("Error on ", eid);
      console.log(e.toString());
      console.log("-------------");
    }



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
  }
})();
