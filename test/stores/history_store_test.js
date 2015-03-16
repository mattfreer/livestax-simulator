"use strict";

require("../test_helper");

var Immutable = require("immutable");
var AppActions = require("../../scripts/actions/app_actions");
var HistoryStore = require("../../scripts/stores/history_store");
var HistoryActions = require("../../scripts/actions/history_actions");
var Moment = require("moment");

describe("HistoryStore", () => {
  var clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();

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
      messages: [
        {
          namespace: "another-app",
          key: "app-title",
          value: "hello world"
        }
      ]
    });
    HistoryStore.reset();
  });

  afterEach(() => {
    clock.restore();
  });

  describe("getHistory()", () => {
    it("returns the history for a specified key", () => {
      expect(HistoryStore.getHistory("apps").size).to.eql(2);
      expect(HistoryStore.getHistory("messages").size).to.eql(1);
    });

    describe("when no key is specified", () => {
      it("returns all history items", () => {
        expect(HistoryStore.getHistory().size).to.eql(3);
      });

      it("adds a `historyType` attribute to each history item", () => {
        var types = HistoryStore.getHistory().map((item) => {
          return item.get("historyType");
        });
        expect(types).to.eql(Immutable.List(["apps", "apps", "messages"]));
      });
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
      expect(HistoryStore.getHistory("messages").size).to.eql(2);
    });

    it("creates a name field", () => {
      expect(HistoryStore.getHistory("messages").getIn([1, "name"])).to.eql("different-app.selected = 5");
    });

    it("creates a createdAt field", () => {
      expect(HistoryStore.getHistory("messages").getIn([1, "createdAt"])).to.eql(Moment().unix());
    });
  });

  describe("when an app configuration mesage is received", () => {
    var data = Immutable.fromJS({
      name: "New App",
      namespace: "new-app",
      url: "examples/new_app.html"
    });

    beforeEach(() => {
      AppActions.receiveAppConfiguration(data);
    });

    it("saves the result to localStorage", () => {
      expect(window.localStorage.history).to.include("\"name\":\"New App\"");
    });

    it("adds the item to the apps history", () => {
      expect(HistoryStore.getHistory("apps").size).to.eql(3);
    });

    describe("when a delete history message is received", () => {
      beforeEach(() => {
        HistoryActions.deleteHistoryItem("apps", HistoryStore.getHistory().get(2));
      });

      it("removes the result from localStorage", () => {
        expect(window.localStorage.history).to.not.include("\"name\":\"New App\"");
      });

      it("removes the item from the apps history", () => {
        expect(HistoryStore.getHistory("apps").size).to.eql(2);
      });
    });
  });

});
