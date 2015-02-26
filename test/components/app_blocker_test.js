"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var AppBlocker = require("../../scripts/components/app_blocker");

describe("AppBlocker", () => {
  var blocker;
  describe("when loading", () => {
    beforeEach(() => {
      blocker = TestUtils.renderIntoDocument(React.createElement(AppBlocker));
    });

    it("renders loading text", () => {
      expect(blocker.getDOMNode().textContent).to.include("Loading");
    });
  });

  describe("when ready", () => {
    beforeEach(() => {
      blocker = TestUtils.renderIntoDocument(React.createElement(AppBlocker, { status: "ready" }));
    });
    it("doesn't render anything", () => {
      expect(blocker.getDOMNode()).to.eql(null);
    });
  });
});
