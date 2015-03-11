"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var Radio = require("../../../scripts/components/lib/radio_horizontal");

describe("Radio", () => {
  describe("props.name", () => {
    var instance;
    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(<Radio name="male" />);
    });

    it("renders the name on an input ", () => {
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().name).to.eql("male");
    });
  });

  describe("props.checked", () => {
    it("sets the checked attribute of the input when false", () => {
      var instance = TestUtils.renderIntoDocument(<Radio checked={false} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().checked).to.eql(false);
    });

    it("sets the checked attribute of the input when true", () => {
      var instance = TestUtils.renderIntoDocument(<Radio checked={true} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().checked).to.eql(true);
    });
  });

  describe("props.onChange", () => {
    it("calls the passed function when the input changes", () => {
      var callback = sinon.spy();
      var instance = TestUtils.renderIntoDocument(<Radio onChange={callback} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      TestUtils.Simulate.change(element.getDOMNode(), {});
      expect(callback).to.have.been.called;
    });
  });

  describe("props.text", () => {
    it("outputs the text in a label next to the checkbox", () => {
      var instance = TestUtils.renderIntoDocument(<Radio text="Male" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "label");
      expect(element.getDOMNode().textContent).to.eql("Male");
    });
  });

  describe("other props", () => {
    it("puts all other props on the input", () => {
      var instance = TestUtils.renderIntoDocument(<Radio disabled="true" title="bar" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().disabled).to.eql(true);
      expect(element.getDOMNode().title).to.eql("bar");
    });
  });
});

