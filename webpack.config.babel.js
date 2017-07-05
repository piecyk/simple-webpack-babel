import path from 'path';
import webpack from 'webpack';

const buildTimestamp = Date.now();
const nodeEnv = process.env.NODE_ENV;
const isDevelopmentMode = nodeEnv !== 'production';
const nodePaths = (process.env.NODE_PATH || '').split(':').map(p => path.resolve(p));

const distPath = path.resolve(__dirname, 'dist');
const publicPath = '/';

const options = {
  entry: [
    path.resolve(__dirname, 'src/index.js'),
  ],
  output: {
    publicPath,
    path: distPath,
    filename: 'bundle.js'
  },
  resolve: {
    modules: [...nodePaths]
  },
  module: {
    rules: [
      {
        exclude: [/(node_modules)/],
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin((() => {
      const env = {
        ...process.env,
        IS_DEVELOPMENT_MODE: isDevelopmentMode,
        BUILD_TIMESTAMP: buildTimestamp,
        NODE_ENV: nodeEnv
      };
      return {
        'process.env': Object.keys(env).reduce(
          (acc, k) => ({...acc, [k]: JSON.stringify(env[k])}), {}
        )
      };
    })())
  ],
  devServer: {
    publicPath,
    host: '0.0.0.0',
    port: '8081'
  }
};

export default options;
