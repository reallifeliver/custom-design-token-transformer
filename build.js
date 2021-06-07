const {
  default: multiDepthJsonFormatter,
} = require('./formatters/mulit-depth-json');
const { default: getHex } = require('./utils/getHex');

const StyleDictionary = require('style-dictionary').extend({
  source: ['tokens/*.json'],
  transform: {
    // Now we can use the transform 'myTransform' below
    myTransform: {
      type: 'name',
      transformer: (token) => token.path.join('_').toUpperCase(),
    },
  },
  format: {
    myFormat: ({ dictionary, platform }) => {
      console.log(dictionary);
      return dictionary.allTokens
        .map((token) => `${token.name}: ${token.value}`)
        .join('\n');
    },
  },
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

StyleDictionary.registerFormat({
  name: 'json/clo-set',
  formatter: function (dictionary, config) {
    const allTokens = dictionary.allProperties;
    console.log(allTokens);
    const data = allTokens.reduce((acc, cur) => {
      let { value, name, path } = cur;
      name = path.join('_').replace(/[- ]/g, '_').toUpperCase();
      acc[name] = getHex(value);
      return acc;
    }, {});

    return JSON.stringify(data);
  },
});

StyleDictionary.registerFormat({
  name: 'json/test',
  formatter: function (dictionary, config) {
    // return JSON.stringify(dictionary);
    return multiDepthJsonFormatter(dictionary, config);
  },
});

StyleDictionary.buildAllPlatforms();
