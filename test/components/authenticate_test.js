"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var AuthenticateStore = require("../../scripts/stores/authenticate_store");
var AuthenticatePanel = require("../../scripts/components/authenticate_panel");
var AuthenticateActions = require("../../scripts/actions/authenticate_actions");

describe("AuthenticatePanel", () => {
  var instance;

  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(
      <AuthenticatePanel />
    );
  });

  afterEach(() => {
    React.unmountComponentAtNode(instance.getDOMNode().parentNode);
  });

  describe("when no authenticate message has been received", () => {
    it("renders a help message ", () => {
      var help = TestUtils.findRenderedDOMComponentWithClass(instance, "help-message");
      expect(help.getDOMNode().textContent).to.eql("Authenticate messages from the app will appear in this panel.");
    });
  });

  describe("when an authenticate message is received", () => {
    var authMessage;

    beforeEach(() => {
      AuthenticateStore.replaceState(Immutable.fromJS({
        authRequest: {
          provider: "Third party service",
          url: "http://www.example.com"
        }
      }));

      authMessage = TestUtils.findRenderedDOMComponentWithClass(instance, "dialog-message");
    });

    it("renders the auth provider", () => {
      var panelBody = TestUtils.findRenderedDOMComponentWithClass(authMessage, "panel-body");
      expect(panelBody.getDOMNode().children[0].textContent).to.eql("Login with Third party service");
    });

    describe("when the clear button is clicked", () => {
      var clear;

      beforeEach(() => {
        clear = TestUtils.findRenderedDOMComponentWithClass(instance, "clear-auth");
      });

      it("clears the auth request", function() {
        expect(AuthenticateStore.getAuthRequest()).to.not.eql(null);
        TestUtils.Simulate.click(clear.getDOMNode());
        expect(AuthenticateStore.getAuthRequest()).to.eql(null);
      });

      it("renders a help message ", () => {
        var help = TestUtils.scryRenderedDOMComponentsWithClass(instance, "help-message");
        expect(help.length).to.eql(0);

        TestUtils.Simulate.click(clear.getDOMNode());

        help = TestUtils.scryRenderedDOMComponentsWithClass(instance, "help-message");
        expect(help.length).to.eql(1);
      });
    });

    describe("when the cancel button is clicked", () => {
      var cancel;

      beforeEach(() => {
        cancel = TestUtils.findRenderedDOMComponentWithClass(instance, "cancel-btn");
      });

      it("clears the auth request", function() {
        expect(AuthenticateStore.getAuthRequest()).to.not.eql(null);
        TestUtils.Simulate.click(cancel.getDOMNode());
        expect(AuthenticateStore.getAuthRequest()).to.eql(null);
      });

      it("renders a help message ", () => {
        var help = TestUtils.scryRenderedDOMComponentsWithClass(instance, "help-message");
        expect(help.length).to.eql(0);

        TestUtils.Simulate.click(cancel.getDOMNode());

        help = TestUtils.scryRenderedDOMComponentsWithClass(instance, "help-message");
        expect(help.length).to.eql(1);
      });
    });

    describe("Authenticate button", () => {
      var authButton;

      beforeEach(() => {
        var panelFooter = TestUtils.findRenderedDOMComponentWithClass(authMessage, "panel-footer");
        authButton = TestUtils.findRenderedDOMComponentWithClass(panelFooter, "auth-btn");
      });

      it("renders an 'Authenticate' button", () => {
        expect(authButton.getDOMNode().textContent).to.eql("Authenticate");
      });

      describe("when the 'Authenticate` button is clicked", () => {
        it("triggers an `openWindow` action", () => {
          sinon.spy(AuthenticateActions, "openWindow");
          TestUtils.Simulate.click(authButton.getDOMNode());
          expect(AuthenticateActions.openWindow).to.have.been.calledWith("http://www.example.com");
        });
      });
    });
  });
});
