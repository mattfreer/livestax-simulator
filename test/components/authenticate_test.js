"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var AuthenticateStore = require("../../scripts/stores/authenticate_store");
var AuthenticatePanel = require("../../scripts/components/authenticate_panel");

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
    beforeEach(() => {
      AuthenticateStore.replaceState(Immutable.fromJS({
        authRequest: {
          provider: "Third party service",
          url: "http://www.example.com"
        }
      }));
    });

    it("renders the auth provider", () => {
      var authMessage = TestUtils.findRenderedDOMComponentWithClass(instance, "dialog-message");
      var panelBody = TestUtils.findRenderedDOMComponentWithClass(authMessage, "panel-body");
      expect(panelBody.getDOMNode().children[0].textContent).to.eql("Login with Third party service");
    });
  });
});
