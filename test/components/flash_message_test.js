"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var FlashMessageStore = require("../../scripts/stores/flash_message_store");
var FlashMessage = require("../../scripts/components/flash_message");

describe("FlashMessage", () => {
  var instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <FlashMessage heading="Flash Message" />
    );
  });

  afterEach(() => {
    React.unmountComponentAtNode(instance.getDOMNode().parentNode);
  });

  describe("when no flash message has been received", () => {
    it("renders a help message ", () => {
      var help = TestUtils.findRenderedDOMComponentWithClass(instance, "help-message");
      expect(help.getDOMNode().textContent).to.eql("Flash messages from the app will appear in this panel.");
    });
  });

  describe("when a flash post message is received", () => {
    beforeEach(() => {
      FlashMessageStore.replaceState(Immutable.fromJS({
        flash: {
          type: "success",
          message: "a flash message",
          showConfirm: false
        }
      }));
    });

    it("renders the flash message text", () => {
      var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "flash-message");
      expect(panel.getDOMNode().textContent).to.eql("a flash message");
    });

    it("renders a panel with a class based on the type of the message", () => {
      var panel = TestUtils.findRenderedDOMComponentWithClass(instance, "flash-message");
      expect(panel.getDOMNode().className.match(/panel-success/)).to.not.be.null;
    });
  });
});
