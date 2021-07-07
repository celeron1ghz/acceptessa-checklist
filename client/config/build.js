const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const sizeOf = require('image-size');
const Promise = require('promise');
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true})

const stat      = Promise.denodeify(fs.stat);
const copyFile  = Promise.denodeify(fs.copyFile);
const writeFile = Promise.denodeify(fs.writeFile);

const CONFIG_DIR = __dirname;
const EXHIBITION_DIRS = fs
  .readdirSync(CONFIG_DIR)
  .filter(f => fs.statSync(CONFIG_DIR + "/" + f).isDirectory())
  .filter(f => !f.match(/^\./));

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

const validator = ajv.compile(require('./schema.json'));

async function build(exhibitionName){
  const filtered = EXHIBITION_DIRS.filter(dir => dir === exhibitionName);

  if (exhibitionName && !filtered.length) {
    console.log("No such exhibition found: ", exhibitionName);
    return;
  }


  const dirs = filtered.length ? filtered : EXHIBITION_DIRS;

  for (const eid of dirs) {
    const edir = `./public/${eid}`;

    try {
      fs.mkdirSync(edir);
    } catch(e) {
      if (e.code !== "EEXIST") {
        console.log("ERROR:", e);
      }
    }

    const destConfigFile = `./public/${eid}.json`;
    const fromConfigfile = `${CONFIG_DIR}/${eid}/config.yaml`;
    const mapFile        = `${CONFIG_DIR}/${eid}/map.png`;

    try {
      await stat(fromConfigfile);

      const value = fs.readFileSync(fromConfigfile);
      const config = yaml.safeLoad(value.toString());

      if (!validator(config)) {
        console.log(`[${eid}] !!!!!ERROR!!!!! validation error in `, fromConfigfile);

        for (const e of validator.errors) {
          console.log(JSON.stringify(e, null, 2));
        }

        continue;
      }

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
                s: sym.sym,
                n: p[0], //num
                l: sym.left,
                t: p[1], //top
                w: height,
                h: width,
              };  
            })  
          }), 

          horizontal_syms.map(sym => {
            let idx = sym.idx || 1;
            return _.zip(_.range(idx, idx + sym.lefts.length), sym.lefts).map(p => {
              return {
                s: sym.sym,
                n: p[0], //num
                l: p[1], //left
                t: sym.top,
                w: width,
                h: height,
              };  
            })  
          })
        ]),
      ];

      const meta = await stat(mapFile).then(() => sizeOf(mapFile));

      const data = {
        tweet: config.tweet,
        map: {
          image_width: meta.width,
          image_height: meta.height,
          mappings,
        }
      };

      await writeFile(destConfigFile, JSON.stringify(data));
      console.log(`[${eid}] <CREATE> `, destConfigFile);
    } catch (e) {
      console.log(`[${eid}] <ERROR>  `, destConfigFile, e.toString());
    }

    for (const file of ["not_uploaded.png", "map.png"]) {
      const from = `${CONFIG_DIR}/${eid}/${file}`;
      const dest = `./public/${eid}/${file}`;

      await stat(from)
        .then(data => {
          console.log(`[${eid}] <COPIED> `, from, "==>", dest, data.size);
          return copyFile(from, dest);
        })
        .catch(err => {
          console.log(`[${eid}] <ERROR>  `, from, err.message);
        });
    }
  }
}

module.exports = build;

if (require.main === module) {
  build();
}
