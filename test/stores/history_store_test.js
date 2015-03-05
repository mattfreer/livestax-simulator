"use strict";

require("../test_helper");

var Immutable = require("immutable");
var AppActions = require("../../scripts/actions/app_actions");
var HistoryStore = require("../../scripts/stores/history_store");
var HistoryActions = require("../../scripts/actions/history_actions");

describe("HistoryStore", () => {
  beforeEach(() => {
    window.localStorage.history = JSON.stringify({
      apps: [
        {
          name: "Some App",
          namespace: "some-app",
          url: "examples/app.html"
        },
        {
          name: "Another App",
          namespace: "another-app",
          url: "examples/app.html"
        }
      ],
      messages: []
    });
    HistoryStore.reset();
  });

  describe("getHistory()", () => {
    it("returns the history for that key", () => {
      expect(HistoryStore.getHistory("apps").size).to.eql(2);
      expect(HistoryStore.getHistory("messages").size).to.eql(0);
    });
  });

  describe("when a generated mesage is received", () => {
    beforeEach(() => {
      AppActions.receiveGeneratedMessage(Immutable.fromJS({
        namespace: "different-app",
        key: "selected",
        value: 5
      }));
    });

    it("saves the result to localStorage", () => {
      expect(window.localStorage.history).to.include("\"namespace\":\"different-app\"");
    });

    it("adds the item to the message history", () => {
      expect(HistoryStore.getHistory("messages").size).to.eql(1);
    });

    it("creates a name field", () => {
      expect(HistoryStore.getHistory("messages").getIn([0, "name"])).to.eql("different-app.selected");
    });
  });

  describe("when an app configuration mesage is received", () => {
    beforeEach(() => {
      AppActions.receiveAppConfiguration(Immutable.fromJS({
        name: "New App",
        namespace: "new-app",
        url: "examples/new_app.html"
      }));
    });

    it("saves the result to localStorage", () => {
      expect(window.localStorage.history).to.include("\"name\":\"New App\"");
    });

    it("adds the item to the apps history", () => {
      expect(HistoryStore.getHistory("apps").size).to.eql(3);
    });
  });

  describe("when a delete history message is received", () => {
    beforeEach(() => {
      HistoryActions.deleteHistoryItem("apps", 0);
    });

    it("removes the result from localStorage", () => {
      expect(window.localStorage.history).to.not.include("\"name\":\"Some App\"");
    });

    it("removes the item from the apps history", () => {
      expect(HistoryStore.getHistory("apps").size).to.eql(1);
    });
  });
});
