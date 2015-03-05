"use strict";

var webpackConfig = require("./webpack.config.js");
webpackConfig.entry = ["./scripts/index"];
webpackConfig.plugins = [];
module.exports = webpackConfig;
