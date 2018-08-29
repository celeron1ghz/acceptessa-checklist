const _ = require('lodash');

const width = 27;
const height = 35;
const common01 = [632, 668, 704, 740, 776, 812, 848, 884, 984, 1020, 1056, 1092, 1128, 1164, 1200, 1236];
const common02 = [798, 834, 870, 906, 942, 978, 1056, 1092, 1128, 1164, 1200, 1236];
const common03 = [380, 416, 452, 488, 524, 560, 596, 632, 726, 762, 798, 834, 870, 906, 942, 978, 1056, 1092, 1128, 1164, 1200, 1236];
const common04 = [1118, 1154, 1190, 1226, 1262, 1298];

const vertical_syms = [
  { sym: "2階A", left: 827, tops: [250, 286, 322, 358, 394, 430, 524, 560, 596, 632, 668, 704, ...common02] },
  { sym: "2階B", left: 731, tops: common03 },
  { sym: "2階C", left: 653, tops: common03 },
  { sym: "2階D", left: 557, tops: [524, 560, 596, 632, 668, 704, ...common02] },
  { sym: "2階E", left: 211, tops: [1132, 1168, 1204, 1240] },
  { sym: "2階E", left: 65,  idx: 9, tops: [1240, 1204, 1168, 1132, 1096, 1060] },
  { sym: "3階F", left: 1796, tops: [524, 560, 596, 632, 668, 704, ...common02] },
  { sym: "3階G", left: 1700, tops: common01 },
  { sym: "3階H", left: 1622, tops: common01 },
  { sym: "3階I", left: 1526, tops: common02 },
  { sym: "3階J", left: 1398, tops: [1046, 1082, ...common04] },
  { sym: "3階J", left: 1246, idx: 9,  tops: common04 },
  { sym: "3階J", left: 1180, idx: 15, tops: common04 },
  { sym: "3階J", left: 1032, idx: 21, tops: [1118, 1154, 1190, 1226] },
];

const horizontal_syms = [
  { sym: "2階E", top: 1392, idx: 5, lefts: [177, 141, 105, 69] },
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
  { sym: "企業", num: 1, left: 51,  top: 62, width: 69, height: 21 },
  { sym: "企業", num: 2, left: 147, top: 62, width: 69, height: 21 },
];

module.exports = {
  "tweet": {
    "url": "https://nijisanji.familiar-life.info",
    "hashtags": "にじそうさく",
    "related": "nijisanji_only"
  },
  "map": {
    image_width: "1888",
    image_height: "1504",
    mappings,
  },
};
