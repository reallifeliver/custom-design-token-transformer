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
      rtn[transformedKey] = obj[key].value;
    } else {
      const transformedKey = key.replace(/ /g, '_');
      rtn[transformedKey] = generateStructure(obj[key]);
    }
  }
  return rtn;
}

StyleDictionary.buildAllPlatforms();
