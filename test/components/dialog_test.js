"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var DialogStore = require("../../scripts/stores/dialog_store");
var DialogPanel = require("../../scripts/components/dialog_panel");
var DialogActions = require("../../scripts/actions/dialog_actions");

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
          message: "a dialog message",
          buttons: [
            {
              title: "yes",
              callback: function(){},
              type: "ok"
            },
            {
              title: "no",
              callback: function(){},
              type: "cancel"
            }
          ]
        }
      }));
      dialogMessage = TestUtils.findRenderedDOMComponentWithClass(instance, "dialog-message");
    });

    it("renders the dialog title and message text", () => {
      var panelBody = TestUtils.findRenderedDOMComponentWithClass(dialogMessage, "panel-body");
      expect(panelBody.getDOMNode().children[0].textContent).to.eql("a dialog title");
      expect(panelBody.getDOMNode().children[1].textContent).to.eql("a dialog message");
    });

    describe("dialog buttons", () => {
      var buttons;

      beforeEach(() => {
        var panelFooter = TestUtils.findRenderedDOMComponentWithClass(dialogMessage, "panel-footer");
        buttons = TestUtils.scryRenderedDOMComponentsWithClass(panelFooter, "btn");
      });

      it("rendered in the correct order", () => {
        var buttonText = Immutable.List(buttons).map((item) => {
          return item.getDOMNode().textContent;
        });
        expect(buttonText).to.eql(Immutable.List(["no", "yes"]));
      });

      describe("when clicked", () => {
        it("trigger a dialog interaction action", () => {
          sinon.spy(DialogActions, "dialogInteraction");
          var cancelBtn = buttons[0].getDOMNode();
          TestUtils.Simulate.click(cancelBtn);
          expect(DialogActions.dialogInteraction).to.have.been.calledWith({
            title: "no"
          });
        });
      });
    });
  });
});
