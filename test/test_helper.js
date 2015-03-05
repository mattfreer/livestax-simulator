"use strict";

var sinonChai = require("sinon-chai");
global.chai = require("chai");
global.expect = global.chai.expect;
global.sinon = require("sinon");
global.chai.use(sinonChai);

if (typeof document === "undefined") {
  var jsdom = require("jsdom").jsdom;
  global.document = jsdom(undefined);
  global.window = global.document.parentWindow;
  global.navigator = global.window.navigator;
}

if (!global.window.localStorage) {
  global.window.localStorage = {};
}
