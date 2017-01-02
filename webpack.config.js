var path = require('path')
var webpack = require('webpack')
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin')

module.exports = {
  entry: {
    app: './src/main.js'
  }, 
  output: {
    // Not sure what is that for but lets left it here.
    path: path.resolve(__dirname, './dist'),
    // You might wanna change here to your enviroment.
    // if you are in local just change it to localhost:2992
    publicPath: 'http://192.168.33.10:2992/assets/',
    // chunkhash didnt work for me so i changed it to [hash]
    filename: '[name].[hash].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this nessessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    // manifest file generator
    new ManifestRevisionPlugin(path.join('dist', 'manifest.json'), {
      rootAssetPath: path.resolve(__dirname, './src'),
      ignorePaths: ['/node_modules', '/src']
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
