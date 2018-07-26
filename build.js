const path = require('path');
const webpack = require('webpack');

const webpackConfig = {
  context: path.resolve(__dirname, ''),
  
  entry: './src/index.js',
  
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'vue-upload.min.js',
      libraryTarget: 'umd'
  },
  
  resolve: {
      extensions: ['.js'],
  },

  module: {
      rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
              presets: ['blue'],
              babelrc: false
          }
      }]
  },

  plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
            comments: false,
            screw_ie8: true,
        },
        sourceMap: true
      })
  ]
};

const compiler = webpack(webpackConfig);

compiler.run(function (error, stats) {
    if (error) {
        console.log('');
        console.log(error);
        process.exit(1);
    }

    process.stdout.write(stats.toString({
        colors: true,
        hash: false,
        version: false,
        timings: false,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n');
});