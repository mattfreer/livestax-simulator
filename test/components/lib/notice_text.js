"use strict";

require("../../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var Notice = require("../../../scripts/components/lib/notice");

describe("Notice", () => {
  describe("type prop", () => {
    it("applies a media-badge-default-inverse class by default", () => {
      var instance = TestUtils.renderIntoDocument(
        <Notice />
      );

      var badge = TestUtils.findRenderedDOMComponentWithClass(instance, "media-badge");
      expect(badge.getDOMNode().className).to.include("media-badge-default-inverse");
    });

    it("applies a media-badge-warning-inverse class when type is warning", () => {
      var instance = TestUtils.renderIntoDocument(
        <Notice type="warning" />
      );

      var badge = TestUtils.findRenderedDOMComponentWithClass(instance, "media-badge");
      expect(badge.getDOMNode().className).to.include("media-badge-warning-inverse");
    });
  });

  describe("icon prop", () => {
    it("applies the fa-flag icon by default", () => {
      var instance = TestUtils.renderIntoDocument(
        <Notice />
      );

      var icon = TestUtils.findRenderedDOMComponentWithClass(instance, "fa");
      expect(icon.getDOMNode().className).to.include("fa-flag");
    });

    it("applies an `fa fa-beer` class when icon is `fa-fa-beer`", () => {
      var instance = TestUtils.renderIntoDocument(
        <Notice icon="fa fa-beer" />
      );

      var icon = TestUtils.findRenderedDOMComponentWithClass(instance, "fa");
      expect(icon.getDOMNode().className).to.include("fa-beer");
    });
  });

  it("renders the children", () => {
      var instance = TestUtils.renderIntoDocument(
        <Notice>
          <h2>Heading</h2>
        </Notice>
      );
      var heading = TestUtils.findRenderedDOMComponentWithTag(instance, "h2");
      expect(heading.getDOMNode().textContent).to.eql("Heading");
  });
});
