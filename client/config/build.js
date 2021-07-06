const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const sizeOf = require('image-size');
const Promise = require('promise');

const stat      = Promise.denodeify(fs.stat);
const copyFile  = Promise.denodeify(fs.copyFile);
const writeFile = Promise.denodeify(fs.writeFile);

const CONFIG_DIR = './config/';
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
                width: height,
                height: width,
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
                width,
                height,
              };  
            })  
          })
        ]),
        // { sym: "企業", num: 1, left: 51,  top: 62, width: 69, height: 21 },
        // { sym: "企業", num: 2, left: 147, top: 62, width: 69, height: 21 },
      ];

      const mapFile = `${CONFIG_DIR}${eid}/map.png`;
      const meta = await stat(mapFile).then(() => sizeOf(mapFile));

      const data = {
        tweet: config.tweet,
        map: {
          image_width: meta.width,
          image_height: meta.height,
          mappings,
        }
      };

      await writeFile(`./public/${eid}.json`, JSON.stringify(data));
      console.log(`[${eid}] <CREATE>  ./public/${eid}.json`);
    } catch (e) {
      console.log(`[${eid}] <ERROR>  `, e.toString());
    }

    for (const file of ["not_uploaded.png", "map.png"]) {
      const from = `${CONFIG_DIR}${eid}/${file}`;
      const dest = `./public/${eid}/${file}`;

      await stat(from)
        .then(data => {
          console.log(`[${eid}] <CREATE> `, from, data.size);
          return copyFile(from, dest);
        })
        .catch(err => {
          console.log(`[${eid}] <ERROR>  `, from, err.message);
        });
    }
  }
})();
