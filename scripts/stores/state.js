"use strict";

var Immutable = require("immutable");

module.exports = {
  initial() {
    return Immutable.fromJS({
      status: "loading"
    });
  }
};

