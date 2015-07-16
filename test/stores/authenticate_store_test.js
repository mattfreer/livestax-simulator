"use strict";

require("../test_helper");
var Immutable = require("immutable");
var AuthenticateStore = require("../../scripts/stores/authenticate_store");
var AppActions = require("../../scripts/actions/app_actions");

describe("AuthenticateStore", () => {
  var postMessage = {
    type: "authenticate",
    payload: {
      data: {
        provider: "Third party service",
        url: "http://www.example.com"
      }
    }
  };

  describe("getAuthRequest()", () => {
    describe("when an authenticate mesage is received", () => {
      it("updates the store state", () => {
        AppActions.receivePostMessage(postMessage);
        expect(AuthenticateStore.getAuthRequest()).to.eql(
          Immutable.fromJS(postMessage.payload.data)
        );
      });

      it("triggers a change event", () => {
        var callback = sinon.stub();
        AuthenticateStore.addChangeListener(callback);
        AppActions.receivePostMessage(postMessage);
        expect(callback).to.have.been.called;
      });
    });
  });

  describe("when an app configuration action is received", () => {
    it("resets the authRequest property to null", () => {
      AuthenticateStore.setState(["authRequest"], {
        provider: "Third Party Service",
        url: "http://www.example.com"
      });

      expect(AuthenticateStore.getAuthRequest()).to.not.eql(null);
      AppActions.receiveAppConfiguration(Immutable.fromJS({}));
      expect(AuthenticateStore.getAuthRequest()).to.eql(null);
    });
  });
});
