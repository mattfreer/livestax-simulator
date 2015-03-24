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
        expect(logs.getIn([0, "payload"])).to.eql({
          type: "another-app.heading"
        });
      });
    });
  });
});
