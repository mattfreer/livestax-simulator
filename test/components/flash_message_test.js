"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var FlashMessageStore = require("../../scripts/stores/flash_message_store");
var FlashMessage = require("../../scripts/components/flash_message");
var FlashActions = require("../../scripts/actions/flash_actions");

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
    var flashMessage;

    beforeEach(() => {
      FlashMessageStore.replaceState(Immutable.fromJS({
        flash: {
          type: "success",
          message: "a flash message",
          callbacks: ["ignore", "confirm"]
        }
      }));
      flashMessage = TestUtils.findRenderedDOMComponentWithClass(instance, "flash-message");
    });

    it("renders the flash message text", () => {
      var panelBody = TestUtils.findRenderedDOMComponentWithClass(flashMessage, "panel-body");
      expect(panelBody.getDOMNode().textContent).to.eql("a flash message");
    });

    it("renders a flash-header with a class based on the type of the message", () => {
      var header = TestUtils.findRenderedDOMComponentWithClass(instance, "flash-header");
      expect(header.getDOMNode().className.match(/flash-header-success/)).to.not.be.null;
    });

    describe("interaction buttons", () => {
      var panelFooter;
      var buttons;

      beforeEach(() => {
        panelFooter = TestUtils.findRenderedDOMComponentWithClass(flashMessage, "panel-footer");
        buttons = TestUtils.scryRenderedDOMComponentsWithClass(panelFooter, "btn");
      });

      it("renders a button for each interaction type", () => {
        var buttonText = Immutable.List(buttons).map((item) => {
          return item.getDOMNode().textContent;
        });
        expect(buttonText).to.eql(Immutable.List(["ignore", "dismiss", "confirm"]));
      });

      it("disables the buttons that don't have callbacks", () => {
        var disabled = TestUtils.scryRenderedDOMComponentsWithClass(panelFooter, "disabled");
        expect(disabled.length).to.eql(1);
      });

      describe("when a flash message button is clicked", () => {
        it("triggers a flash interaction action", () => {
          sinon.spy(FlashActions, "flashInteraction");
          var confirmButton = buttons[2].getDOMNode();
          TestUtils.Simulate.click(confirmButton);
          expect(FlashActions.flashInteraction).to.have.been.calledWith({
            type: "confirm"
          });
        });
      });
    });
  });
});
