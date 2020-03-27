/* eslint-disable flowtype/require-valid-file-annotation */
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import RobotstxtPlugin from 'robotstxt-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import UnusedFilesWebpackPlugin from 'unused-files-webpack-plugin';
import Dotenv from 'dotenv';
import webpack from 'webpack';

import {
  getAbsolutePath,
  getAbsoluteRootPath,
} from 'javascript/build_tools/webpack/paths';
import recursive from 'javascript/build_tools/webpack/recursive';

// Load ENV config options from `.env` file.
Dotenv.config();

const debug = process.argv.indexOf('--debug') > -1; // eslint-disable-line no-undef
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  console.error(process.env);
  throw new Error(
    'GOOGLE_MAPS_API_KEY environment variable missing. You can specify with `GOOGLE_MAPS_API_KEY="YOUR_KEY" npm run build` or add `.env` with `GOOGLE_MAPS_API_KEY="YOUR_API_KEY"'
  );
}

const getChunkName = function(ext, hashType = 'chunkhash') {
  const chunkNameArr = ['[name]'];
  if (!debug) {
    chunkNameArr.push(`-[${hashType}]`);
  }
  if (ext) {
    chunkNameArr.push(ext);
  }
  return chunkNameArr.join('');
};

// File paths

const ROOT_PATH = getAbsoluteRootPath();
const NODE_MODULES_PATH = getAbsolutePath(ROOT_PATH, 'node_modules');
const SOURCE_PATH = getAbsolutePath(ROOT_PATH, 'javascript/test-site-finder/static');

// Plugins

const plugins = [
  // node-slug will bundle a bunch of useless unicode translation crap if
  // you don't exclude this
  new webpack.IgnorePlugin(/unicode\/category\//),

  // don't load any moment locales to avoid bloating the bundle
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

  // Enforce exact casing match for paths
  new CaseSensitivePathsPlugin(),

  new webpack.DefinePlugin({
    // This is used to determine the feature namespace for Anatomy configuration
    '__DEBUG__': debug,

    /**
     * "Internal props" are props that expose normally-private behavior for
     * the sake of rendering things like the style guide. Things like
     * rendering a modal as a block-level element instead of taking over the
     * page or rendering buttons in a focused/hovered/depressed state.
     */
    '__INTERNAL_PROPS_ALLOWED__': false,

    // In production, set the equivalent of NODE_ENV to "production" so that
    // React dev warnings are minified out.
    'process.env': debug ? {} : {NODE_ENV: '"production"'},

    'GOOGLE_MAPS_API_KEY': JSON.stringify(GOOGLE_MAPS_API_KEY),
  }),

  new HtmlWebpackPlugin({
    title: 'Coronavirus (COVID-19) Testing Resource Center',
    template: 'index.html',
    favicon: 'images/favicon.svg',
  }),

  new UnusedFilesWebpackPlugin(),

  new RobotstxtPlugin({policy: [{userAgent: '*', disallow: '/'}]}),
];

if (debug) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({debug: true, logger: false}),
    new webpack.HotModuleReplacementPlugin()
  );
}

if (!debug) {
  plugins.push(
    new MiniCssExtractPlugin({
      // Need to use ``contenthash`` here to use the hash of the extracted
      // content
      filename: getChunkName('.css', 'contenthash'),
      publicPath: 'dist',
    })
  );
}

// Entry points

function getAllFiles(regex, path) {
  return recursive.filesMatchingPattern(regex, path);
}

let config = {
  context: SOURCE_PATH,
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    host: '0.0.0.0',
    port: '8082',
    public: 'localhost:8082',
    hot: true,
    inline: true,
    headers: {'Access-Control-Allow-Origin': '*'},
    publicPath: 'http://0.0.0.0:8082/',
  },
  entry: {
    app: [
      '@babel/polyfill',
      'focus-visible',
      path.resolve(SOURCE_PATH, 'index.jsx'),
      ...getAllFiles(/(\.jpg|\.gif|\.png|\.ico)$/i, SOURCE_PATH),
      ...getAllFiles(/(\.mp4|\.ogv|\.webm|\.swf)$/i, SOURCE_PATH),
    ],
  },
  output: {
    filename: getChunkName('.js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: debug ? '/' : '',
  },
  mode: debug ? 'development' : 'production',
  module: {
    rules: [
      {
        exclude: new RegExp(NODE_MODULES_PATH),
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.s?css$/,
        use: [
          debug ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(SOURCE_PATH, 'scss')],
              outputStyle: debug ? 'expanded' : 'compressed',
            },
          },
        ],
      },
      {
        test: /(\.jpg|\.gif|\.png|\.ico)$/i,
        use: {loader: 'file-loader'},
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      {
        test: /(\.yml|\.yaml)$/,
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  plugins,
  resolve: {
    modules: ['node_modules', ROOT_PATH, SOURCE_PATH],
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx'],
    alias: debug ? {'react-dom': '@hot-loader/react-dom'} : {},
  },
  stats: {
    colors: debug,
  },
};

export default config;
