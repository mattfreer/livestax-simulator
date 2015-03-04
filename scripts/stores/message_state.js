"use strict";

var Immutable = require("immutable");

module.exports = {
  initial() {
    return Immutable.fromJS({
      namespace: "another-app",
      key: "heading",
      value: "New Heading",
    });
  }
};

