import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const buildTimestamp = Date.now();
const nodeEnv = process.env.NODE_ENV;
const nodePaths = (process.env.NODE_PATH || '').split(':').map(p => path.resolve(p));
const isDevelopmentMode = nodeEnv !== 'production';

const projectRootDir =__dirname;
const srcPath = path.resolve(projectRootDir, 'src');
const outPath = path.resolve(projectRootDir, 'dist');
const publicPath = '/';

const babelrc = JSON.parse(
  fs.readFileSync(path.resolve(projectRootDir, '.babelrc'), 'utf8')
);
const babelOptions = {
  babelrc: false,
  ...babelrc,
  presets: [
    ['env', {modules: false}]
  ],
  plugins: [
    ...babelrc.plugins,
    'syntax-dynamic-import',
    ['transform-react-jsx', {'pragma':'h'}],
  ]
};

const developmentPlugins = () => [
];

const productionPlugins = () => [
];

console.log(`Starting ${isDevelopmentMode ?
  'development' : 'production'} mode build (NODE_ENV:${nodeEnv})`);

const options = {
  entry: [
    path.resolve(srcPath, 'index.js')
  ],
  output: {
    publicPath,
    path: outPath,
    filename: 'bundle.js'
  },
  resolve: {
    modules: [...nodePaths]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: babelOptions,
        exclude: [
          /(node_modules)/
        ]
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin((() => {
      const env = {
        // ...process.env,
        IS_DEVELOPMENT_MODE: isDevelopmentMode,
        BUILD_TIMESTAMP: buildTimestamp,
        NODE_ENV: nodeEnv
      };
      return {
        'process.env': Object.keys(env).reduce(
          (acc, k) => ({...acc, [k]: JSON.stringify(env[k])}), {}
        )
      };
    })()),
    ...(isDevelopmentMode ? developmentPlugins() : productionPlugins())
  ],
  devServer: {
    publicPath,
    host: '0.0.0.0',
    port: '8081'
  }
};

export default options;
