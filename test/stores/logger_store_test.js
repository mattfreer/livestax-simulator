"use strict";

require("../test_helper");

var Immutable = require("immutable");
var LoggerStore = require("../../scripts/stores/logger_store");
var AppActions = require("../../scripts/actions/app_actions");
var LoggerActions = require("../../scripts/actions/logger_actions");
var FlashActions = require("../../scripts/actions/flash_actions");

describe("LoggerStore", () => {
  beforeEach(() => {
    LoggerStore.reset();
  });

  describe("#getLogs()", () => {
    it("returns an empty immutable list by default", () => {
      expect(LoggerStore.getLogs()).to.eql(Immutable.List());
    });

    describe("When a postMessage is received", () => {
      describe("if type is not in the whitelist", () => {
        it("doesn't add the log to the store", () => {
          AppActions.receivePostMessage({
            type: "ready"
          });

          var logs = LoggerStore.getLogs();

          expect(logs.size).to.eql(0);
        });
      });

      describe("if type is in the whitelist", () => {
        describe("if the subtype is not in the whitelist", () => {
          it("doesn't add the log to the store", () => {
            AppActions.receivePostMessage({
              type: "flash",
              payload: {
                type: "foobar"
              }
            });

            var logs = LoggerStore.getLogs();

            expect(logs.size).to.eql(0);
          });
        });

        describe("if the subtype is in the whitelist", () => {
          it("adds the log to the store", () => {
            AppActions.receivePostMessage({
              type: "on",
              payload: {
                type: "another-app.heading"
              }
            });

            var logs = LoggerStore.getLogs();

            expect(logs.size).to.eql(1);
            expect(logs.getIn([0, "type"])).to.eql("on");
            expect(logs.getIn([0, "direction"])).to.eql("from");
            expect(logs.getIn([0, "payload"])).to.eql(Immutable.fromJS({
              type: "another-app.heading"
            }));
          });
        });
      });
    });

    describe("When a message generator message is received", () => {
      it("adds the log to the store", () => {
        AppActions.receiveGeneratedMessage(Immutable.fromJS({
          namespace: "some-app",
          key: "some-key",
          value: 123
        }));

        var logs = LoggerStore.getLogs();

        expect(logs.size).to.eql(1);
        expect(logs.getIn([0, "type"])).to.eql("trigger");
        expect(logs.getIn([0, "direction"])).to.eql("to");
        expect(logs.getIn([0, "payload"])).to.eql(Immutable.fromJS({
          type: "some-app.some-key",
          data: 123
        }));
      });
    });

    describe("When a flash message interaction is received", () => {
      it("adds the log to the store", () => {
        FlashActions.flashInteraction({ type: "confirm" });

        var logs = LoggerStore.getLogs();

        expect(logs.size).to.eql(1);
        expect(logs.getIn([0, "type"])).to.eql("flash");
        expect(logs.getIn([0, "direction"])).to.eql("to");
        expect(logs.getIn([0, "payload"])).to.eql(Immutable.fromJS({
          type: "confirm"
        }));
      });
    });

    describe("When a store generator configuration is received", () => {
      it("adds the log to the store", () => {
        AppActions.receiveStoreConfiguration(Immutable.fromJS({
          key: "some-app.some-key",
          value: 123
        }));

        var logs = LoggerStore.getLogs();
        var expected = Immutable.fromJS({
          type: "set",
          data: {
            key: "some-key",
            value: 123
          }
        });

        expect(logs.size).to.eql(1);
        expect(logs.getIn([0, "type"])).to.eql("store");
        expect(logs.getIn([0, "direction"])).to.eql("to");
        expect(Immutable.is(logs.getIn([0, "payload"]), expected)).to.eql(true);
      });
    });

    describe("When a store item is deleted", () => {
      it("adds the store deletoin log to the store", () => {
        AppActions.deleteStoreItem("some-app.some-key");

        var logs = LoggerStore.getLogs();
        var expected = Immutable.fromJS({
          type: "unset",
          data: {
            key: "some-key"
          }
        });

        expect(logs.size).to.eql(1);
        expect(logs.getIn([0, "type"])).to.eql("store");
        expect(logs.getIn([0, "direction"])).to.eql("to");
        expect(Immutable.is(logs.getIn([0, "payload"]), expected)).to.eql(true);
      });
    });

    describe("When a clear event is sent", () => {
      it("removes the loges in the store", () => {
        AppActions.deleteStoreItem("some-app.some-key");
        AppActions.deleteStoreItem("some-app.some-key");

        var logs = LoggerStore.getLogs();
        expect(logs.size).to.eql(2);

        LoggerActions.clearLog();

        logs = LoggerStore.getLogs();
        expect(logs.size).to.eql(0);
      });
    });

    describe("when multiple log types exist", () => {
      beforeEach(() => {
        AppActions.receiveGeneratedMessage(Immutable.fromJS({
          namespace: "some-app",
          key: "some-key",
          value: 123
        }));

        AppActions.deleteStoreItem("some-app.some-key");
        AppActions.deleteStoreItem("some-app.some-other-key");
      });

      it("returns the logs for a specified filter", () => {
        expect(LoggerStore.getLogs("trigger").size).to.eql(1);
        expect(LoggerStore.getLogs("store").size).to.eql(2);
      });
    });
  });

  describe("getLogTypes", () => {
    it("returns a (unique) set of all log types", () => {
      AppActions.receiveGeneratedMessage(Immutable.fromJS({
        namespace: "some-app",
        key: "some-key",
        value: 123
      }));

      AppActions.deleteStoreItem("some-app.some-key");
      AppActions.deleteStoreItem("some-app.some-key");

      var types = LoggerStore.getLogTypes();
      expect(Immutable.is(types, Immutable.Set(["store", "trigger"]))).to.be.true;
    });
  });
});
