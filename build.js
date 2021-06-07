const { default: getHex } = require('./utils/getHex');

const StyleDictionary = require('style-dictionary').extend({
  source: ['tokens/*.json'],
  // transform: {
  //   // Now we can use the transform 'myTransform' below
  //   myTransform: {
  //     type: 'name',
  //     transformer: (token) => token.path.join('_').toUpperCase(),
  //   },
  // },
  // format: {
  //   myFormat: ({ dictionary, platform }) => {
  //     console.log(dictionary);
  //     return dictionary.allTokens
  //       .map((token) => `${token.name}: ${token.value}`)
  //       .join('\n');
  //   },
  // },
  platforms: {
    // test: {
    //   transform: ['myTransform'],
    //   transformGroup: 'js',
    //   buildPath: 'build/json/',
    //   files: [
    //     {
    //       destination: 'myform.json',
    //       format: 'myFormat',
    //     },
    //   ],
    // },
    'json-flat': {
      transforms: ['color/hex'],
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [
        // {
        //   destination: 'styles.json',
        //   format: 'json/flat', // 디렉토리 구조 flat
        // },
        {
          destination: 'clo-set.json',
          format: 'json/clo-set',
        },
        // {
        //   destination: 'test.json',
        //   format: 'json/test', // 디렉토리 구조 유지
        // },
      ],
    },
    // 'javascript-object': {
    //   transforms: ['color/hex'],
    //   transformGroup: 'js',
    //   buildPath: 'build/js/',
    //   files: [
    //     {
    //       destination: 'js-object.js',
    //       format: 'javascript/object',
    //     },
    //   ],
    // },
  },
});

const GLOBAL = 'global';
StyleDictionary.registerFormat({
  name: 'json/clo-set',
  formatter: function (dictionary, config) {
    const allTokens = dictionary.allProperties;

    const aliasTokens = allTokens.filter(
      (item) => !item.path[0].includes(GLOBAL)
    );

    const globalTokens = allTokens
      .filter((item) => item.path[0].includes(GLOBAL))
      .map((item) => {
        item.path.shift();
        return item;
      });

    console.log(aliasTokens);

    const preprocessedToken = {};
    const globalTokenMap = {};

    for (let i = 0; i < globalTokens.length; i++) {
      const { path, value } = globalTokens[i];
      const key = path.join('_').replace(/[- ]/g, '_').toUpperCase();
      const hexValue = getHex(value);
      preprocessedToken[key] = hexValue;
      globalTokenMap[hexValue] = key;
    }

    for (let i = 0; i < aliasTokens.length; i++) {
      const { path, value } = aliasTokens[i];
      const key = path.join('_').replace(/[- ]/g, '_').toUpperCase();
      const hexValue = getHex(value);
      const globalMappedKey = globalTokenMap[hexValue];
      preprocessedToken[key] = globalMappedKey ? `{${globalMappedKey}}` : value;
    }

    return JSON.stringify(preprocessedToken);
  },
});

StyleDictionary.buildAllPlatforms();
