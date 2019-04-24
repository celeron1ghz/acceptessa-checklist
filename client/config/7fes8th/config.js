const _ = require('lodash');

const width = 17;
const height = 18;
const common01  = [70, 89, 107, 126, 144, 163, 181, 200, 218, 237, 255, 274, 356, 375, 393, 412];
const reverse01 = [...common01].reverse();

const vertical_syms = [
  { sym: "ス", left: 18, tops: [324, 342,361, 379, 427, 445, 464, 482, 501, 519] },
];

const horizontal_syms = [
  { sym: "シ", top: 315, lefts: common01 },
  { sym: "ト", top: 370, lefts: common01 },
  { sym: "ト", top: 403, idx: 17, lefts: [412, 393, 274, 255, 200, 181, 163, 144, 89, 70] },
  { sym: "ラ", top: 458, lefts: common01 },
  { sym: "ラ", top: 491, idx: 17, lefts: reverse01 },
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
    "url": "http://7fes.com",
    "hashtags": "ナナフェス",
    "related": "7fes_info",
  },
  "map": {
    image_width: "460",
    image_height: "640",
    mappings,
  },
};
