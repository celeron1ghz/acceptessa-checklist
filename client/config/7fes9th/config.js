const _ = require('lodash');

const width = 22;
const height = 28;
const common01  = [70, 89, 107, 126, 144, 163, 181, 200, 218, 237, 255, 274, 356, 375, 393, 412];
const reverse01 = [...common01].reverse();

const vertical_syms = [
  { sym: "ミ", left: 752, tops: [228, 258, 288, 318, 349, 379, 471, 502, 532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 945, 975, 1006, 1035, 1066, 1096] },
  { sym: "ツ", left: 666, tops: [411, 440, 471, 502, 532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 884, 914, 945, 975, 1006, 1035, 1066, 1096] },
  { sym: "バ", left: 586, tops: [411, 440, 471, 502, 532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 884, 914, 945, 975, 1006, 1035, 1066, 1096] },
  { sym: "チ", left: 500, tops: [532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 945, 975, 1006, 1035, 1066, 1096] },
];

const horizontal_syms = [
  //{ sym: "シ", top: 315, lefts: common01 },
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
    image_width: "839",
    image_height: "1377",
    mappings,
  },
};
