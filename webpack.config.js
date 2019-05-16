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
  },
  externals: {
    'Config': JSON.stringify(process.env.NODE_ENV === 'production' ? {
      appConfigURL: "https://members.pep-dortmund.org/event/1/config",
      eventRegistrationURL: "https://members.pep-dortmund.org/event/1/register",
    } : {
      appConfigURL: "http://127.0.0.1:5000/event/1/config",
      eventRegistrationURL: "http://127.0.0.1:5000/event/1/register",
    })
  }
};
