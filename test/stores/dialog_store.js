"use strict";

require("../test_helper");
var Immutable = require("immutable");

var DialogStore = require("../../scripts/stores/dialog_store");
var AppActions = require("../../scripts/actions/app_actions");
var DialogActions = require("../../scripts/actions/dialog_actions");

describe("DialogStore", () => {
  var postMessage = {
    type: "dialog",
    payload: {
      data: {
        title: "Dialog title",
        message: "Dialog message"
      }
    }
  };

  describe("getDialog()", () => {
    describe("when a dialog mesage is received", () => {
      beforeEach(() => {
        AppActions.receivePostMessage(postMessage);
      });

      it("updates the store state", () => {
        expect(DialogStore.getDialog()).to.eql(
          Immutable.fromJS(postMessage.payload.data)
        );
      });
    });
  });

  describe("when a dialog interaction event is received", () => {
    var interaction = {
      title: "yes"
    };

    it("triggers a change event with the interaction", () => {
      var callback = sinon.stub();
      DialogStore.addChangeListener(callback);
      DialogActions.dialogInteraction(interaction);
      expect(callback).to.have.been.calledWith({title: "yes"});
    });
  });
});
