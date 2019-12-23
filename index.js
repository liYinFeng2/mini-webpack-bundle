const options = require('./webpack.config.js')
const Webpack = require('./bundle/mini-webpack.js')

new Webpack(options).run()