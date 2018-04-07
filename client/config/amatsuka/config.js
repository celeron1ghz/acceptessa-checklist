const _ = require('lodash');

const upper  = [ 424, 492, 561, 630, 699, 767, 836, 905, 1042, 1111, 1180, 1248, 1317, 1385, 1455, 1523 ];
const lower  = [ 1730, 1798, 1867, 1936, 2005, 2073 ];
const width  = 35;
const height = 68;

const mappings = [
  ..._.zip(_.range(1,16), _.chunk(upper,15)[0]).map(p => {
    return { sym: "G", left: 630, num: p[0], top: p[1], width, height };
  }),

  ..._.zip(_.range(1,7), _.chunk(lower,6)[0]).map(p => {
    return { sym: "J", left: 630, num: p[0], top: p[1], width, height };
  }),

  ..._.zip(_.range(1,16), _.chunk(upper,15)[0]).map(p => {
    return { sym: "B", left: 252, num: p[0], top: p[1], width, height };
  }),

  ..._.zip(_.range(1,7), _.chunk(lower,6)[0]).map(p => {
    return { sym: "P", left: 252, num: p[0], top: p[1], width, height };
  }),

  { sym: "J", num: 7, left: 527, top: 2280, width: height, height: width },
  { sym: "P", num: 7, left: 321, top: 2280, width: height, height: width },
  { sym: "P", num: 8, left: 390, top: 2280, width: height, height: width },
  { sym: "A", num: 1, left: 458, top: 2280, width: height, height: width },
];

module.exports = {
  "tweet": {
    "url": "http://familiar-life.info/GJ/",
    "hashtags": "大天使祭",
    "related": "FamiliarLife_PR"
  },
  "map": {
    image_width: "1130",
    image_height: "2508",
    mappings,
  },
};