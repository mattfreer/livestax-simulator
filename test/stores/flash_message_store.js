"use strict";

require("../test_helper");
var Immutable = require("immutable");

var FlashMessageStore = require("../../scripts/stores/flash_message_store");
var AppActions = require("../../scripts/actions/app_actions");
var FlashActions = require("../../scripts/actions/flash_actions");

describe("FlashMessageStore", () => {
  var postMessage = {
    type: "flash",
    payload: {
      type: "success",
      message: "a flash message",
      showConfirm: false
    }
  };

  describe("getFlash()", () => {
    describe("when a flash mesage is received", () => {
      beforeEach(() => {
        AppActions.receivePostMessage(postMessage);
      });

      it("updates the store state", () => {
        expect(FlashMessageStore.getFlash()).to.eql(
          Immutable.fromJS(postMessage.payload)
        );
      });

      describe("when an app configuration action is received", () => {
        beforeEach(() => {
          AppActions.receiveAppConfiguration(Immutable.fromJS({}));
        });

        it("resets the state.flash property to null", () => {
          expect(FlashMessageStore.getFlash()).to.eql(null);
        });
      });
    });
  });

  describe("interaction events", () => {
    var interaction = {
      type: "confirm"
    };

    describe("when a flash interaction action is triggered", () => {
      it("triggers a change event with the interaction", () => {
        var callback = sinon.stub();
        FlashMessageStore.addChangeListener(callback);
        FlashActions.flashInteraction(interaction);
        expect(callback).to.have.been.calledWith("confirm");
      });
    });
  });
});

