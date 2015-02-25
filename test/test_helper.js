"use strict";

global.chai = require("chai");
global.expect = global.chai.expect;

if (typeof document === "undefined") {
  var jsdom = require("jsdom").jsdom;
  global.document = jsdom(undefined);
  global.window = global.document.parentWindow;
  global.navigator = global.window.navigator;
}
