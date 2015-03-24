"use strict";

require("../test_helper");

var Immutable = require("immutable");
var LoggerStore = require("../../scripts/stores/logger_store");
var AppActions = require("../../scripts/actions/app_actions");

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
  });
});
