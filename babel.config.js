/* eslint-disable local/prefer-export */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 2,
      },
    ],
    '@babel/preset-flow',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-async-generator-functions',
    '@babel/plugin-transform-async-to-generator',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    'add-module-exports',
    [
      'babel-plugin-transform-builtin-extend',
      {
        globals: ['Error'],
      },
    ],
    [
      'react-intl',
      {
        messagesDir: '.tx/extract/javascript',
      },
    ],
    'react-hot-loader/babel',
  ],
  ignore: ['javascript/flow/**/*.js'],
  env: {
    /** We run our jest tests with NODE_ENV=testing. Plugins added here
     *  will be used by jest when running tests but will not apply to
     *  code being bundled for our normal target environments. This is generally
     *  useful for features that need different handling in nodejs vs the browser,
     *  such as dynamic import.
     */
    testing: {
      plugins: ['dynamic-import-node'],
    },
  },
};
