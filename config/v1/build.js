const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const sizeOf = require('image-size');
const path = require('path');
const Promise = require('promise');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true })

const stat = Promise.denodeify(fs.stat);
const copyFile = Promise.denodeify(fs.copyFile);
const writeFile = Promise.denodeify(fs.writeFile);

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))
const validator = ajv.compile(require('./schema.json'));

// usage:
//   $ node build.js <CONFIG_DIR> <PUBLISH_DIR>
//
// defaults are:
//   CONFIG_DIR:  /client/config
//   PUBLISH_DIR: /client/public

async function build(exhibitionName, configPath, publishPath) {
  let CONFIG_DIR;
  let PUBLISH_DIR;

  if (fs.existsSync(configPath)) {
    CONFIG_DIR = path.resolve(configPath);
  } else {
    CONFIG_DIR = __dirname;
  }

  if (fs.existsSync(publishPath)) {
    PUBLISH_DIR = path.resolve(publishPath);
  } else {
    PUBLISH_DIR = path.resolve('./public');
  }

  console.log("CONFIG_DIR:", CONFIG_DIR);
  console.log("PUBLISH_DIR:", PUBLISH_DIR);

  const EXHIBITION_DIRS = fs
    .readdirSync(CONFIG_DIR)
    .filter(f => fs.statSync(CONFIG_DIR + "/" + f).isDirectory())
    .filter(f => !f.match(/^\./));

  const filtered = EXHIBITION_DIRS.filter(dir => dir === exhibitionName);

  if (exhibitionName && !filtered.length) {
    console.log("No such exhibition found: ", exhibitionName);
    return;
  }

  const dirs = filtered.length ? filtered : EXHIBITION_DIRS;

  for (const eid of dirs) {
    const edir = `${PUBLISH_DIR}/${eid}`;

    // least 'config.yaml' is required.
    // 'map.png' and 'not_uploaded.png' are optional

    const fromConfigfile = `${CONFIG_DIR}/${eid}/config.yaml`;
    const destConfigFile = `${PUBLISH_DIR}/${eid}.json`;
    const mapFile = `${CONFIG_DIR}/${eid}/map.png`;

    const value = fs.readFileSync(fromConfigfile);
    const config = yaml.safeLoad(value.toString());

    // if config is invalid, abord now
    if (!validator(config)) {
      for (const e of validator.errors) {
        console.log(JSON.stringify(e, null, 2));
      }

      throw new Error(`[${eid}] !!!!!ERROR!!!!! validation error in ` + fromConfigfile);
    }

    // after validation is ok, mkdir.
    try {
      fs.mkdirSync(edir);
    } catch (e) {
      if (e.code !== "EEXIST") {
        console.log("ERROR:", e);
      }
    }

    try {
      const width = config.space.width;
      const height = config.space.height;
      const vertical_syms = config.vertical_syms || [];
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

      const meta = await stat(mapFile).then(() => sizeOf(mapFile)).catch(() => null);
      console.log(mapFile, meta)

      const data = {
        tweet: config.tweet,
      };

      if (meta) {
        data.map = {
          image_width: meta.width,
          image_height: meta.height,
          mappings,
        };
      }

      await writeFile(destConfigFile, JSON.stringify(data));
      console.log(`[${eid}] <CREATE> `, destConfigFile);
    } catch (e) {
      console.log(`[${eid}] <ERROR>  `, destConfigFile, e.toString());
    }

    for (const file of ["not_uploaded.png", "map.png"]) {
      const from = `${CONFIG_DIR}/${eid}/${file}`;
      const dest = `${PUBLISH_DIR}/${eid}/${file}`;

      await stat(from)
        .then(data => {
          // console.log(`[${eid}] <COPIED> `, from, "==>", dest, data.size);
          console.log(`[${eid}] <COPIED> `, "==>", dest, data.size);
          return copyFile(from, dest);
        })
        .catch(err => {
          // console.log(`[${eid}] <ERROR>  `, from, err.message);
          console.log(`[${eid}] <ERROR>  `, err.message);
        });
    }
  }
}

module.exports = build;

if (require.main === module) {
  build(null, process.argv[2], process.argv[3]);
}
