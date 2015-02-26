"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var AppStore = require("../../scripts/stores/app_store");
var AppPanel = require("../../scripts/components/app_panel");
var AppBlocker = require("../../scripts/components/app_blocker");

describe("AppPanel", () => {
  var appPanel, blocker, iframe;
  beforeEach(() => {
    AppStore.reset();
    appPanel = TestUtils.renderIntoDocument(React.createElement(AppPanel));
    iframe = TestUtils.findRenderedDOMComponentWithTag(appPanel, "iframe");
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

  describe("when ready", () => {
    beforeEach(() => {
        AppStore.replaceState({ status: "ready" });
    });

    it("renders an app blocker", () => {
      expect(blocker.props.status).to.eql("ready");
    });
  });
});
