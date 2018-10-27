const _ = require('lodash');

const width = 13;
const height = 17;
//const common01 = [632, 668, 704, 740, 776, 812, 848, 884, 984, 1020, 1056, 1092, 1128, 1164, 1200, 1236];

const vertical_syms = [
  { sym: "天", left: 413, tops: [147, 165, 183, 201, 219, 237, 282, 300, 318, 336, 354, 372, 447, 465, 483, 501] },
  { sym: "天", left: 369, idx: 17, tops: [184, 202, 220, 238, 256, 274, 295, 310, 375, 393, 411, 429, 447, 465, 483, 501] },
  { sym: "照", left: 324, tops:          [184, 202, 220, 238, 256, 274, 295, 310, 375, 393, 411, 429, 447, 465, 483, 501] },
  { sym: "照", left: 281, idx: 17, tops: [411, 429, 447, 465, 483, 501] },
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
