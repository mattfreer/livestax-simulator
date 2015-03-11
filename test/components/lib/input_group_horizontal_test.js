"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var InputGroup = require("../../../scripts/components/lib/input_group_horizontal");

describe("InputGroup", () => {
  describe("props.label", () => {
    it("renders the label in a label element", () => {
      var instance = TestUtils.renderIntoDocument(<InputGroup label="My Label" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "label");
      expect(element.getDOMNode().textContent).to.eql("My Label");
    });
  });

  describe("props.children", () => {
    it("puts the children in a div", () => {
      var instance = TestUtils.renderIntoDocument(<InputGroup>
        <h1>Test</h1>
        <h2>Content</h2>
      </InputGroup>);
      expect(instance.getDOMNode().textContent).to.eql("TestContent");
    });
  });
});

