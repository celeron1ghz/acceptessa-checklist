const _ = require('lodash');

const width = 19;
const height = 19;
const common01 = [73, 92, 112, 130, 150, 169, 189, 208, 227, 246, 266, 285, 361, 380, 399, 418, 438, 457, 476, 495, 515, 534];

const left_pillar  = [73, 92, 150, 169, 189, 208, 266, 285];
const left_full  = [73, 92, 112, 130, 150, 169, 189, 208, 227, 246, 266, 285];
const right_full = [361, 380, 399, 418, 438, 457, 476, 495, 515, 534];
const both_full  = [...left_full, ...right_full];

const vertical_syms = [
  { sym: "A", idx: 11, left: 598, tops: [57, 76, 96, 115, 174, 193, 213, 232, 252, 271 ] },
  { sym: "B", left: 18,  tops: [174, 193, 213, 232, 252, 271, 320, 339, 358, 377, 397, 416, 466, 485, 505, 524, 544, 563, 582, 601, 620, 639] },
  { sym: "R", idx: 11, left: 598, tops: [320, 339, 358, 377, 397, 416] },
];

const horizontal_syms = [
  { sym: "A", top: 29, lefts: [380, 399, 419, 438, 458, 477, 515, 534, 554, 573] },

  { sym: "C", top: 115, lefts: right_full }, { sym: "C", idx: 11, top: 149, lefts: [402, 421, 441, 460, 515, 534] },
  { sym: "D", top: 196, lefts: both_full }, { sym: "D", idx: 23, top: 230, lefts: both_full },
  { sym: "E", top: 277, lefts: both_full }, { sym: "E", idx: 23, top: 311, lefts: both_full },
  { sym: "F", top: 359, lefts: left_full }, { sym: "F", idx: 13, top: 392, lefts: left_full },
  { sym: "G", top: 442, lefts: left_pillar },
  { sym: "G", idx: 9,  top: 476, lefts: left_full },
  { sym: "G", idx: 21, top: 476, lefts: right_full },
  { sym: "H", top: 523, lefts: both_full }, { sym: "H", idx: 23, top: 557, lefts: both_full },
  { sym: "I", top: 663, lefts: left_full },
  { sym: "I", idx: 13, top: 663, lefts: [371, 390, 409, 428] },
  { sym: "I", idx: 17, top: 697, lefts: left_pillar },
  { sym: "I", idx: 25, top: 697, lefts: [409, 428] },
  { sym: "J", top: 755, lefts: [...left_full, 371, 390, 409, 428] },
  { sym: "R", top: 311, lefts: right_full },
  { sym: "R", idx: 17, top: 358, lefts: right_full },
  { sym: "R", idx: 27, top: 392, lefts: right_full },
  { sym: "R", idx: 37, top: 441, lefts: [399, 418, 438, 457, 515, 534] },
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
    "url": "https://holokle.info",
    "hashtags": "ホロクル",
    "related": "holokle_info"
  },
  "map": {
    image_width: "894",
    image_height: "1088",
    mappings,
  },
};
