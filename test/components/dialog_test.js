"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var DialogStore = require("../../scripts/stores/dialog_store");
var DialogPanel = require("../../scripts/components/dialog_panel");

describe("DialogPanel", () => {
  var instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <DialogPanel heading="Dialog" />
    );
  });

  afterEach(() => {
    React.unmountComponentAtNode(instance.getDOMNode().parentNode);
  });

  describe("when no dialog message has been received", () => {
    it("renders a help message ", () => {
      var help = TestUtils.findRenderedDOMComponentWithClass(instance, "help-message");
      expect(help.getDOMNode().textContent).to.eql("Dialog messages from the app will appear in this panel.");
    });
  });

  describe("when a dialog message is received", () => {
    var dialogMessage;

    beforeEach(() => {
      DialogStore.replaceState(Immutable.fromJS({
        dialog: {
          title: "a dialog title",
          message: "a dialog message"
        }
      }));
      dialogMessage = TestUtils.findRenderedDOMComponentWithClass(instance, "dialog-message");
    });

    it("renders the dialog title and message text", () => {
      var panelBody = TestUtils.findRenderedDOMComponentWithClass(dialogMessage, "panel-body");
      expect(panelBody.getDOMNode().children[0].textContent).to.eql("a dialog title");
      expect(panelBody.getDOMNode().children[1].textContent).to.eql("a dialog message");
    });
  });
});
