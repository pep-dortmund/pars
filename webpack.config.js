module.exports = {
  entry: {
    script: './static/js/script',
    admin: './static/js/admin'
  },
  output: {
    path: './static/compiled/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  }
};
