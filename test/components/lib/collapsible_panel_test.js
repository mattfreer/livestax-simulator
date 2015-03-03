"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var CollapsiblePanel = require("../../../scripts/components/lib/collapsible_panel");

describe("CollapsiblePanel", () => {
  describe("props.collapsed", () => {
    describe("when not set", () => {
      var instance;

      beforeEach(() => {
        instance = TestUtils.renderIntoDocument(<CollapsiblePanel />);
      });

      it("applies an `expanded` css class to the panel element", () => {
        var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "panel");
        expect(panel.getDOMNode().className).to.include("expanded");
      });

      it("doesn't apply a `collapsed` css class to the panel-header element", () => {
        var panelHeading = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-heading");
        expect(panelHeading.getDOMNode().className).to.not.include("collapsed");
      });

      it("doesn't apply a `collapse` css class to the panel-collapse element", () => {
        var element = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-collapse");
        expect(element.getDOMNode().className).to.not.include("panel-collapse collapse");
      });
    });

    describe("when set to false", () => {
      var instance;

      beforeEach(() => {
        instance = TestUtils.renderIntoDocument(<CollapsiblePanel collapsed={false} />);
      });

      it("applies an `expanded` css class to the panel element", () => {
        var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "panel");
        expect(panel.getDOMNode().className).to.include("expanded");
      });

      it("doesn't apply a `collapsed` css class to the panel-header element", () => {
        var panelHeading = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-heading");
        expect(panelHeading.getDOMNode().className).to.not.include("collapsed");
      });

      it("doesn't apply a `collapse` css class to the panel-collapse element", () => {
        var element = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-collapse");
        expect(element.getDOMNode().className).to.not.include("panel-collapse collapse");
      });
    });

    describe("when set to true", () => {
      var instance;

      beforeEach(() => {
        instance = TestUtils.renderIntoDocument(<CollapsiblePanel collapsed={true} />);
      });

      it("doesn't apply a `expanded` css class to the panel element", () => {
        var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "panel");
        expect(panel.getDOMNode().className).to.not.include("expanded");
      });

      it("applies a `collapsed` css class to the panel-header element", () => {
        var panelHeading = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-heading");
        expect(panelHeading.getDOMNode().className).to.include("collapsed");
      });

      it("applies a `collapse` css class to the panel-collapse element", () => {
        var element = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-collapse");
        expect(element.getDOMNode().className).to.include("panel-collapse collapse");
      });
    });
  });

  describe("props.heading", () => {
    it("renders a heading", () => {
      var instance = TestUtils.renderIntoDocument(<CollapsiblePanel heading="foobar" />);
      var heading = TestUtils.findRenderedDOMComponentWithClass(instance, "panel-title");
      expect(heading.getDOMNode().textContent).to.eql("foobar");
    });
  });

  describe("props.type", () => {
    it("applies a panel-default class by default", () => {
      var instance = TestUtils.renderIntoDocument(<CollapsiblePanel />);
      var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "panel");
      expect(panel.getDOMNode().className).to.include("panel-default");
    });

    it("applies a panel-warning class when type is warning", () => {
      var instance = TestUtils.renderIntoDocument(<CollapsiblePanel type="warning"/>);
      var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "panel");
      expect(panel.getDOMNode().className).to.include("panel-warning");
    });
  });
});
