const _ = require('lodash');

const width = 26;
const height = 34;

const vertical_syms = [
  { sym: "沼津", left: 828, tops: [288, 324, 360, 396, 524, 560, 596, 632, 668, 704, 798, 834, 870, 906, 942, 978, 1072, 1108, 1144, 1180 ]},
  { sym: "淡島", left: 654, tops: [396, 432, 468, 504, 540, 576, 654, 690, 726, 762, 798, 834, 870, 906, 1000, 1036, 1072, 1108, 1144, 1180]},
  { sym: "三津", left: 732, tops: [396, 432, 468, 504, 540, 576, 654, 690, 726, 762, 798, 834, 870, 906, 1000, 1036, 1072, 1108, 1144, 1180]},
  { sym: "函館", left: 558, tops: [834, 870, 906, 942, 1072, 1108, 1144, 1180]},
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
    image_width: "920",
    image_height: "1504",
    mappings,
  },
};

