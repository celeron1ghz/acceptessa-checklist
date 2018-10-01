const _ = require('lodash');

const width = 13;
const height = 17;

const vertical_syms = [
  { sym: "沼津", left: 414, tops: [125, 143, 161, 179, 197, 215, 259, 277, 295, 313, 331, 349, 399, 417, 435, 453, 471, 489, 528, 546, 564, 582, 600, 618 ]},
  { sym: "淡島", left: 369, tops: [204, 222, 240, 258, 276, 294, 312, 330, 348, 366, 384, 402 ]},
  { sym: "三津", left: 369, tops: [444, 462, 480, 498, 564, 582, 600, 618 ]},
  { sym: "西浦", left: 327, tops: [564, 582, 600, 618 ]},
];

//const horizontal_syms = [
//  { sym: "2階E", top: 1392, idx: 5, lefts: [177, 141, 105, 69] },
//];

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

/*
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
*/
  ]),
];

module.exports = {
  "tweet": {
    "url": "http://aquamarine-dream.info",
    "hashtags": "アマドリ",
    "related": "aqmd_info"
  },
  "map": {
    image_width: "460",
    image_height: "752",
    mappings,
  },
};

