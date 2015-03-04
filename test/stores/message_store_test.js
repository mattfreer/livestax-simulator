"use strict";

require("../test_helper");

var Immutable = require("immutable");
var MessageStore = require("../../scripts/stores/message_store");
var AppActions = require("../../scripts/actions/app_actions");

describe("MessageStore", () => {
  beforeEach(() => {
    MessageStore.reset();
  });

  describe("getMessage()", () => {
    it("returns the default message", () => {
      expect(MessageStore.getMessage().getIn(["namespace"])).to.equal("another-app");
      expect(MessageStore.getMessage().getIn(["key"])).to.equal("heading");
      expect(MessageStore.getMessage().getIn(["value"])).to.equal("New Heading");
    });
  });

  describe("when a generated mesage is received", () => {
    it("updates the message to the received message", () => {
      AppActions.receiveGeneratedMessage(Immutable.fromJS({
        namespace: "different-app",
        key: "selected",
        value: 5
      }));
      expect(MessageStore.getMessage().getIn(["namespace"])).to.equal("different-app");
      expect(MessageStore.getMessage().getIn(["key"])).to.equal("selected");
      expect(MessageStore.getMessage().getIn(["value"])).to.equal(5);
    });
  });
});
