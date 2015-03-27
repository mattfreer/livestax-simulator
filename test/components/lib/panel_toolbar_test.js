"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var PanelToolbar = require("../../../scripts/components/lib/panel_toolbar");

describe("PanelToolbar", () => {
  describe("props.children", () => {
    it("puts the children in a div", () => {
      var instance = TestUtils.renderIntoDocument(
        <PanelToolbar>
          <h1>foo</h1>
        </PanelToolbar>
      );
      var headerParent = TestUtils.findRenderedDOMComponentWithTag(instance, "h1").getDOMNode().parentNode;
      expect(headerParent.className).to.eql("panel-toolbar");
    });
  });
});

