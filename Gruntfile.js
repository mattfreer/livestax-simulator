"use strict";

module.exports = function(grunt) {
  require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.production.config.js");
  grunt.initConfig({
    webpack: {
      options: webpackConfig,
      build: {
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
           "process.env": {
             // This has effect on the react lib size
             "NODE_ENV": JSON.stringify("production")
           }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
          ),
        devtool: false,
        debug: false
      },
      "build-dev": {
        devtool: "sourcemap",
        debug: true
      }
    },
  });
  // Production build
  grunt.registerTask("build", ["webpack:build"]);
};
