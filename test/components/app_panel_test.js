"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var AppStore = require("../../scripts/stores/app_store");
var AppPanel = require("../../scripts/components/app_panel");
var AppBlocker = require("../../scripts/components/app_blocker");
var AppIframe = require("../../scripts/components/app_iframe");

describe("AppPanel", () => {
  var appPanel, blocker, iframe;

  beforeEach(() => {
    AppStore.reset();
    appPanel = TestUtils.renderIntoDocument(React.createElement(AppPanel));
    iframe = TestUtils.findRenderedComponentWithType(appPanel, AppIframe);
    blocker = TestUtils.findRenderedComponentWithType(appPanel, AppBlocker);
  });

  describe("when loading", () => {
    it("renders an iframe with the correct src", () => {
      expect(iframe.getDOMNode().src).to.eql("examples/app.html");
    });

    it("renders an app blocker", () => {
      expect(blocker.props.status).to.eql("loading");
    });
  });

  describe("when timed out", () => {
    beforeEach(() => {
      AppStore.setState(["status"], "timeout");
    });

    it("doesn't render an iframe", () => {
      expect(iframe.getDOMNode()).to.eql(null);
    });


    it("renders an app blocker", () => {
      expect(blocker.props.status).to.eql("timeout");
    });
  });

  describe("when ready", () => {
    beforeEach(() => {
      AppStore.setState(["status"], "ready");
    });

    it("renders an iframe with the correct src", () => {
      expect(iframe.getDOMNode().src).to.eql("examples/app.html");
    });

    it("renders an app blocker", () => {
      expect(blocker.props.status).to.eql("ready");
    });
  });
});
