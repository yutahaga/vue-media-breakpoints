import { CheckerPlugin } from 'awesome-typescript-loader';
import sysPath from 'path';

export default {
  mode: 'production',

  context: sysPath.resolve('./src'),

  entry: {
    index: './index.ts'
  },

  devtool: 'source-map',

  output: {
    path: sysPath.resolve('./dist'),
    filename: '[name].js',
    library: 'VueMediaBreakPointsPlugin',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: {
          declaration: false
        }
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js', '.json']
  },

  plugins: [new CheckerPlugin()]
};
