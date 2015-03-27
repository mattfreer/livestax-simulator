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

  describe("getInteraction()", () => {
    var interaction = {
      type: "confirm"
    };

    describe("when a flash interaction action is triggerd", () => {
      beforeEach(() => {
        FlashActions.flashInteraction(interaction);
      });

      it("updates the store state", () => {
        expect(FlashMessageStore.getInteraction()).to.eql("confirm");
      });

      describe("when an app configuration action is received", () => {
        beforeEach(() => {
          AppActions.receiveAppConfiguration(Immutable.fromJS({}));
        });

        it("resets the state.flash property to null", () => {
          expect(FlashMessageStore.getInteraction()).to.eql(null);
        });
      });
    });
  });
});

