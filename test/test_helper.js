"use strict";

var Immutable = require("immutable");
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

var deepEqual = global.sinon.deepEqual;
global.sinon.deepEqual = function(a, b) {
  if(Immutable.is(a, Immutable.fromJS(a))) {
    return Immutable.is(a, b);
  }
  return deepEqual(a, b);
};
