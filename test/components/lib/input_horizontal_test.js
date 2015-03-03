"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var Input = require("../../../scripts/components/lib/input_horizontal");

describe("Input", () => {
  describe("props.name", () => {
    var instance;
    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(<Input name="firstname" />);
    });

    it("renders the name in a for attribute", () => {
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "label");
      expect(element.getDOMNode().htmlFor).to.eql("firstname");
    });

    it("renders the name on an input ", () => {
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().name).to.eql("firstname");
    });
  });

  describe("props.label", () => {
    it("renders the label in a label element", () => {
      var instance = TestUtils.renderIntoDocument(<Input label="lastname" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "label");
      expect(element.getDOMNode().textContent).to.eql("lastname");
    });
  });

  describe("props.value", () => {
    it("renders the value in a value attribute", () => {
      var instance = TestUtils.renderIntoDocument(<Input value="myname" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().value).to.eql("myname");
    });
  });

  describe("props.onChange", () => {
    it("calls the passed function when the input changes", () => {
      var callback = sinon.spy();
      var instance = TestUtils.renderIntoDocument(<Input onChange={callback} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      TestUtils.Simulate.change(element.getDOMNode(), {});
      expect(callback).to.have.been.called;
    });
  });
});

