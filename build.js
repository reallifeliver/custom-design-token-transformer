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
          format: 'json/flat',
        },
        {
          destination: 'clo-set.json',
          format: 'json/clo-set',
        },
        {
          destination: 'test.json',
          format: 'json/test',
        },
      ],
    },
    'javascript-object': {
      transforms: ['color/hex'],
      transformGroup: 'js',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'js-object.json',
          format: 'javascript/object',
        },
      ],
    },
  },
});

StyleDictionary.registerFormat({
  name: 'json/clo-set',
  formatter: function (dictionary, config) {
    const allTokens = dictionary.allProperties;
    const data = allTokens.reduce((acc, cur) => {
      let { value, name } = cur;
      name = name.replace(/-/g, '_').toUpperCase();
      acc[name] = value;
      return acc;
    }, {});

    return JSON.stringify(data);
  },
});

StyleDictionary.registerFormat({
  name: 'json/test',
  formatter: function (dictionary, config) {
    return JSON.stringify(dictionary);
  },
});

StyleDictionary.buildAllPlatforms();
