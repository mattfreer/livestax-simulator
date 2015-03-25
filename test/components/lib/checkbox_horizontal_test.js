"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var Checkbox = require("../../../scripts/components/lib/checkbox_horizontal");

describe("Checkbox", () => {
  describe("props.name", () => {
    var instance;
    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(<Checkbox name="name_agree_terms" label="label_agree_terms"/>);
    });

    it("renders the name on an input ", () => {
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().name).to.eql("name_agree_terms");
    });
  });

  describe("props.label", () => {
    it("renders the label in a label element", () => {
      var instance = TestUtils.renderIntoDocument(<Checkbox name="name_over_18" label="label_over_18" />);
      var element = TestUtils.scryRenderedDOMComponentsWithTag(instance, "label")[0];
      expect(element.getDOMNode().textContent).to.eql("label_over_18");
    });
  });

  describe("props.checked", () => {
    it("sets the checked attribute of the input when false", () => {
      var instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" checked={false} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().checked).to.eql(false);
    });

    it("sets the checked attribute of the input when true", () => {
      var callback = sinon.spy();
      var instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" checked={true} onChange={callback} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().checked).to.eql(true);
    });
  });

  describe("props.onChange", () => {
    it("calls the passed function when the input changes", () => {
      var callback = sinon.spy();
      var instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" onChange={callback} />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      TestUtils.Simulate.change(element.getDOMNode(), {});
      expect(callback).to.have.been.called;
    });
  });

  describe("props.error", () => {
    it("does not render a help block when there is not an error", () => {
      var instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" error={null} />);
      var errors = TestUtils.scryRenderedDOMComponentsWithClass(instance, "help-block");
      expect(errors.length).to.eql(0);
    });

    describe("when there is an error", () => {
      var instance;
      beforeEach(() => {
        instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" error="Some Error" />);
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

  describe("props.text", () => {
    it("outputs the text in a label next to the checkbox", () => {
      var instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" text="Check to agree to our terms" />);
      var element = TestUtils.scryRenderedDOMComponentsWithTag(instance, "label")[1];
      expect(element.getDOMNode().textContent).to.eql("Check to agree to our terms");
    });
  });

  describe("other props", () => {
    it("puts all other props on the input", () => {
      var instance = TestUtils.renderIntoDocument(<Checkbox name="foo" label="foo" disabled="true" title="bar" />);
      var element = TestUtils.findRenderedDOMComponentWithTag(instance, "input");
      expect(element.getDOMNode().disabled).to.eql(true);
      expect(element.getDOMNode().title).to.eql("bar");
    });
  });
});

