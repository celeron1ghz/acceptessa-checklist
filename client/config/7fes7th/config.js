const _ = require('lodash');

const top = [
  753,717,678,642,603,567,528,492,375,339,300,264,225,189,150,114
];

const syms = [
  { sym: "S", left: 454 },
  { sym: "T", left: 507 },
  { sym: "A", left: 596 },
  { sym: "Y", left: 648 },
  { sym: "G", left: 737 },
  { sym: "O", left: 789 },
  { sym: "L", left: 878 },
  { sym: "D", left: 930 },
];

const width = 18;
const height = 33;

const mappings = _.flattenDeep(
  syms.map(sym =>
    _.zip(_.range(1,17), top).map(p => {
      return {
        sym: sym.sym,
        left: sym.left,
        num: p[0],
        top: p[1],
        width,
        height,
      };
    })
  )
);

module.exports = {
  "tweet": {
    "url": "http://7fes.com",
    "hashtags": "ナナフェス",
    "related": "7fes_info"
  },
  "map": {
    image_width: "1200",
    image_height: "1047",
    mappings,
  },
};