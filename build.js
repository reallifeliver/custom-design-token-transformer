const StyleDictionary = require('style-dictionary').extend({
  source: ['tokens/*.json'],
  platforms: {
    'json-flat': {
      transforms: ['color/hex'],
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'styles.json',
          format: 'json/flat', // 디렉토리 구조 flat
        },
        // {
        //   destination: 'clo-set.json',
        //   format: 'json/clo-set',
        // },
        {
          destination: 'test.json',
          format: 'json/test', // 디렉토리 구조 유지
        },
      ],
    },
    'javascript-object': {
      transforms: ['color/hex'],
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'js-object.js',
          format: 'javascript/object',
        },
      ],
    },
  },
});

// StyleDictionary.registerFormat({
//   name: 'json/clo-set',
//   formatter: function (dictionary, config) {
//     const allTokens = dictionary.allProperties;
//     const data = allTokens.reduce((acc, cur) => {
//       let { value, name } = cur;
//       name = name.replace(/-/g, '_').toUpperCase();
//       acc[name] = value;
//       return acc;
//     }, {});

//     return JSON.stringify(data);
//   },
// });

StyleDictionary.registerFormat({
  name: 'json/test',
  formatter: function (dictionary, config) {
    // return JSON.stringify(dictionary);
    return JSON.stringify(generateStructure(dictionary.properties));
  },
});

function generateStructure(obj) {
  const rtn = {};
  for (let key in obj) {
    if (obj[key].value) {
      const transformedKey = key.replace(/-/g, '_').toUpperCase();
      rtn[transformedKey] = getHex(obj[key].value);
    } else {
      const transformedKey = key.replace(/ /g, '_');
      rtn[transformedKey] = generateStructure(obj[key]);
    }
  }
  return rtn;
}

function getHex(rgba) {
  const match = rgba.match(/^rgba?\(([0-9,/\s]*)\)/i);
  if (!match || !match[1]) return rgba;
  const [r, g, b, a] = match[1]
    .replace(/\s/g, '')
    .split(',')
    .map((el) => Number(el));

  if (!!a && a < 1) return rgba; // opacity가 적용되어 있는 경우 rgba 유지

  return `#${toDecimal(r) + toDecimal(g) + toDecimal(b)}`;
}

function toDecimal(num) {
  let decimal = num.toString(16);
  return decimal.length === 1 ? '0' + decimal : decimal;
}

StyleDictionary.buildAllPlatforms();
