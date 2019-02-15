const _ = require('lodash');

const width = 10;
const height = 21;

const vertical_syms = [
  //{ sym: "求", left: 77, tops: [] },
];

const horizontal_syms = [
  { sym: "求", top: 38, lefts: [77, 99, 140, 162, 184, 206, 228, 250, 277, 299, 321, 343, 365, 387, 436, 458, 480, 502] },
  { sym: "鈴", top: 98, lefts: [414, 436, 458, 480] },
  { sym: "読", top: 98, lefts: [128, 150, 172, 194, 216, 238, 275, 297, 318, 340, 363, 385] },
  { sym: "裁", top: 178, lefts: [128, 150, 172, 194, 216, 238, 275, 297, 318, 340, 363, 385, 414, 436, 458, 480] },
  { sym: "判", top: 238, lefts: [276, 298, 320, 342, 365, 387, 424, 446, 469, 491] },
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
    "url": "http://miaresai.info/310/",
    //"hashtags": "",
    "related": "miaresai"
  },
  "map": {
    image_width: "549",
    image_height: "403",
    mappings,
  },
};
