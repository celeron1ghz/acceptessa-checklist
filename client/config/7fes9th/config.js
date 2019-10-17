const _ = require('lodash');
const sizeOf = require('image-size');

function generateConfig(param) {
  const width = param.width;
  const height = param.height;

  const vertical_syms = param.vertical_syms;
  const horizontal_syms = param.horizontal_syms;

  const vertInflated = _.flattenDeep(
    vertical_syms.map(sym => {
      const idx = sym.idx || 1;
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
    })
  );

  const horiInflated = _.flattenDeep(
    horizontal_syms.map(sym => {
      const idx = sym.idx || 1;
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
  );

  //console.log("inflated vertical   :", vertical_syms.length, "-->", vertInflated.length);
  //console.log("inflated horizontal :", horizontal_syms.length, "-->", horiInflated.length);

  const mapImagePath = __dirname + "/map.png";
  const mapMeta =  sizeOf(mapImagePath);
  const map = {
    image_width: mapMeta.width,
    image_height: mapMeta.height,
    mappings: [...vertInflated, ...horiInflated],
  };

  console.log("space =", vertInflated.length + horiInflated.length, "image =", mapMeta);

  return { tweet: param.tweet, map };
}


module.exports = generateConfig({
  width: 22,
  height: 28,

  vertical_syms: [
    { sym: "ミ", left: 752, tops: [228, 258, 288, 318, 349, 379, 471, 502, 532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 945, 975, 1006, 1035, 1066, 1096] },
    { sym: "ツ", left: 666, tops: [411, 440, 471, 502, 532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 884, 914, 945, 975, 1006, 1035, 1066, 1096] },
    { sym: "バ", left: 586, tops: [411, 440, 471, 502, 532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 884, 914, 945, 975, 1006, 1035, 1066, 1096] },
    { sym: "チ", left: 500, tops: [532, 562, 593, 623, 701, 731, 762, 792, 823, 853, 945, 975, 1006, 1035, 1066, 1096] },
  ],

  horizontal_syms: [
    //{ sym: "シ", top: 315, lefts: common01 },
  ],

  tweet: {
    "url": "http://7fes.com",
    "hashtags": "ナナフェス",
    "related": "7fes_info",
  },
});
