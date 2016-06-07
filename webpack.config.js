var webpack = require("webpack");
var path    = require("path");

module.exports = {
  entry: [
    // Set up an ES6-ish environment
    'babel-polyfill',

    // Add your application's scripts below
    './public/src-es6/script.js',
  ],
  module: {
    loaders: [
       {
         loader: "babel-loader",

         // Skip any files outside of your project's `src-es6` directory
         include: [
           path.resolve(__dirname, "public/src-es6"),
         ],

         // Only run `.js` and `.jsx` files through Babel
         test: /\.js/,

         // Options to configure babel with
         query: {
           plugins: ['transform-runtime'],
           presets: ['es2015'],
         }
       },
     ]
  }
}
