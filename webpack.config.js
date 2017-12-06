const webpack = require('webpack');
const minifier = require('minifier');
const card = require('./webpack.config.data.js');
const home = require('./webpack.config.home.js');
const district = require('./webpack.config.district.js');

// Generic css
const input = ['./src/css/proto-grid.css', './src/css/jal-jagran-style.css'];
const options = {
  output: "jaljagran-style.min.css"
};
minifier.minify(input, options);

module.exports = [
  card, home, district
];
