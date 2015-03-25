"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var Input = require("../../../scripts/components/lib/input_horizontal");

describe("Input", () => {
  describe("props.name", () => {
    var instance;
    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(<Input name="name_firstname" label="label_firstname" />);
    });

    it("renders the name in a for attribute", () => {
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "label");
      expect(element.getDOMNode().htmlFor).to.eql("name_firstname");
    });

    it("renders the name on an input ", () => {
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().name).to.eql("name_firstname");
    });
  });

  describe("props.label", () => {
    it("renders the label in a label element", () => {
      var instance = TestUtils.renderIntoDocument(<Input name="name_lastname" label="label_lastname" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "label");
      expect(element.getDOMNode().textContent).to.eql("label_lastname");
    });
  });

  describe("props.value", () => {
    it("renders the value in a value attribute", () => {
      var callback = sinon.spy();
      var instance = TestUtils.renderIntoDocument(<Input onChange={callback} name= "name_myname" label="label_myname" value="value_myname" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().value).to.eql("value_myname");
    });
  });

  describe("props.onChange", () => {
    it("calls the passed function when the input changes", () => {
      var callback = sinon.spy();
      var instance = TestUtils.renderIntoDocument(<Input name="name_myname" label="label_myname" onChange={callback} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      TestUtils.Simulate.change(element.getDOMNode(), {});
      expect(callback).to.have.been.called;
    });
  });

  describe("props.error", () => {
    it("does not render a help block when there is not an error", () => {
      var instance = TestUtils.renderIntoDocument(<Input name="name_myname" label="label_myname" error={null} />);
      var errors = TestUtils.scryRenderedDOMComponentsWithClass(instance, "help-block");
      expect(errors.length).to.eql(0);
    });

    describe("when there is an error", () => {
      var instance;
      beforeEach(() => {
        instance = TestUtils.renderIntoDocument(<Input name="name_myname" label="label_myname" error="Some Error" />);
      });

      it("renders an error when there is an error", () => {
        var error = TestUtils.findRenderedDOMComponentWithClass(instance, "help-block");
        expect(error.getDOMNode().textContent).to.eql("Some Error");
      });

      it("renders an error when there is an error", () => {
        expect(instance.getDOMNode().className).to.include("has-error");
      });
    });
  });

  describe("other props", () => {
    it("puts all other props on the input", () => {
      var instance = TestUtils.renderIntoDocument(<Input name="name_myname" label="label_myname" disabled="true" title="bar" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().disabled).to.eql(true);
      expect(element.getDOMNode().title).to.eql("bar");
    });
  });
});

