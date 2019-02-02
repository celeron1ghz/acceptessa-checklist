const _ = require('lodash');

const width = 29;
const height = 62;

const vertical_syms = [
  { sym: "来賓", left: 74, tops: [129, 194, 260, 326, 455, 521, 586, 652] },
];

const horizontal_syms = [
  { sym: "来賓", top: 66, idx: 9, lefts: [463, 529 ] },
];

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
];

module.exports = {
  "tweet": {
    "url": "http://yutoriou.com/comicou/",
    "hashtags": "コミック王",
    "related": "yutoriou"
  },
  "map": {
    image_width: "800",
    image_height: "844",
    mappings,
  },
};
