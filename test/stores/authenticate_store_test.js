"use strict";

require("../test_helper");
var Immutable = require("immutable");
var AuthenticateStore = require("../../scripts/stores/authenticate_store");
var AuthenticateIncident = require("../../scripts/incidents/authenticate_incident");
var AppActions = require("../../scripts/actions/app_actions");
var AuthenticateActions = require("../../scripts/actions/authenticate_actions");

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

    describe("when an authenticate message of type `response` is received", () => {
      var responsePostMessage;

      beforeEach(() => {
        AuthenticateStore.setState(["authRequest"], {
          provider: "Third Party Service",
          url: "http://www.example.com"
        });

        responsePostMessage = {
          type: "authenticate",
          payload: {
            type: "response",
          }
        };
      });

      it("resets the authRequest property to null", () => {
        expect(AuthenticateStore.getAuthRequest()).to.not.eql(null);
        AppActions.receivePostMessage(responsePostMessage);
        expect(AuthenticateStore.getAuthRequest()).to.eql(null);
      });

      it("triggers a change event", () => {
        var callback = sinon.stub();
        AuthenticateStore.addChangeListener(callback);
        AppActions.receivePostMessage(responsePostMessage);
        expect(callback).to.have.been.called;
      });

      it("triggers AuthenticateIncident.responded", () => {
        sinon.spy(AuthenticateIncident, "responded");
        AppActions.receivePostMessage(responsePostMessage);
        expect(AuthenticateIncident.responded).to.have.been.called;
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

  describe("when an open authenticate window action is received", () => {
    beforeEach(() => {
      sinon.stub(AuthenticateIncident, "openWindow");
    });

    afterEach(() => {
      AuthenticateIncident.openWindow.restore();
    });

     it("triggers an `openWindow` incident", () => {
       AuthenticateActions.openWindow("http://www.example.com");
       expect(AuthenticateIncident.openWindow).to.have.been.calledWith("http://www.example.com");
     });
  });

  describe("when a clear auth request action is received", () => {
    it("resets the authRequest property to null", () => {
      AuthenticateStore.setState(["authRequest"], {
        provider: "Third Party Service",
        url: "http://www.example.com"
      });

      expect(AuthenticateStore.getAuthRequest()).to.not.eql(null);
      AuthenticateActions.clearRequest();
      expect(AuthenticateStore.getAuthRequest()).to.eql(null);
    });
  });
});
