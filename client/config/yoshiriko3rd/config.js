const _ = require('lodash');

const width = 13;
const height = 24;
//const vertical_syms = [
//  { sym: "恋", left: 327, tops: [204, 222, 240, 258, 276, 294, 312, 330, 348, 366, 384, 402, 444, 462, 480, 498, 564, 582, 600, 618 ]}, 
//  { sym: "夢", left: 279, tops: [295, 313, 331, 349, 399, 417, 435, 453, 471, 489, 528, 546, 564, 582 ]},
//];

const horizontal_syms = [
  //{ sym: "ん", top: 42, lefts: [193, 219] },
  { sym: "あ", top: 42, lefts: [193, 219, 245, 272, 357, 383, 409, 435, 515, 541, 567, 593 ] },
  { sym: "ん", top: 118, lefts: [193, 219, 245, 272, 357, 383, 409, 435, ] },
  { sym: "こ", top: 198, lefts: [193, 219, 245, 272, 357, 383, 409, 435, ] },
];

const mappings = [
/*
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
*/
  ..._.flattenDeep([
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
    "url": "http://yoshiriko.info",
    "hashtags": "よしりこオンリー",
    "related": "yoshiriko_only"
  },
  "map": {
    image_width: "647",
    image_height: "490",
    mappings,
  },
};

