"use strict";

var Immutable = require("immutable");

module.exports = {
  initial() {
    return Immutable.fromJS({
      status: "loading",
      app: {
        name: "Test App",
        namespace: "test-app",
        url: "examples/app.html"
      }
    });
  }
};

