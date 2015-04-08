"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var MenuPanel = require("../../scripts/components/menu_panel");

describe("MenuPanel", () => {
  var instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <MenuPanel />
    );
  });

  afterEach(() => {
    React.unmountComponentAtNode(instance.getDOMNode().parentNode);
  });

  describe("menu items", () => {
    var items;

    beforeEach(() => {
      items = TestUtils.scryRenderedDOMComponentsWithClass(instance, "list-group-item");
    });

    it("renders a reload menu item", () => {
      expect(items[0].getDOMNode().textContent).to.eql("Reload");
      expect(items[0].getDOMNode().querySelector(".fa").className).to.include("fa-refresh");
    });

  });
});
