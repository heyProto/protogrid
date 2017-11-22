const webpack = require('webpack');
const card = require('./webpack.config.data.js');
const home = require('./webpack.config.home.js');
const district = require('./webpack.config.district.js');


module.exports = [
  card, home, district
];
