"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var AppPanel = require("../../scripts/components/app_panel");

describe("appPanel", function() {
  it("Renders an iframe with the correct src", function() {
    var appPanel = TestUtils.renderIntoDocument(React.createElement(AppPanel));
    var iframe = TestUtils.findRenderedDOMComponentWithTag(appPanel, "iframe");
    expect(iframe.getDOMNode().src).to.eql("examples/app.html");
  });
});
