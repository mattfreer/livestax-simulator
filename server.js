"use strict";

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config");

var port = process.env.PORT || 3001;

config.entry = config.entry.map(function(entry) {
  return entry.replace("PORT", port);
});

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true
}).listen(port, "0.0.0.0", function (err) {
  if (err) {
    console.log(err);
  }

  console.log("Listening at 0.0.0.0:" + port);
});
