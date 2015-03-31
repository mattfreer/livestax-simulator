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

    it("returns history for multiple specified types", () => {
      expect(HistoryStore.getHistory("apps", "messages").size).to.eql(3);
    });

    it("adds a `historyType` attribute to each history item", () => {
      var types = HistoryStore.getHistory("apps").map((item) => {
        return item.get("historyType");
      });
      expect(types).to.eql(Immutable.List(["apps", "apps"]));
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

  describe("getHistoryTypes", () => {
    it("returns a list of all history types that are not empty", () => {
      var types = HistoryStore.getHistoryTypes();
      expect(Immutable.is(types, Immutable.List(["apps", "messages"]))).to.be.true;

      HistoryActions.deleteHistoryItem("messages", HistoryStore.getHistory().get(2));
      types = HistoryStore.getHistoryTypes();
      expect(Immutable.is(types, Immutable.List(["apps"]))).to.be.true;
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
    var data;

    describe("when use_post is set to true", () => {
      beforeEach(() => {
        data = Immutable.fromJS({
          app: {
            name: "New App",
            namespace: "new-app",
            url: "examples/new_app.html",
            use_post: true
          },
          post_data: {
            secret_key: "a_secret_key",
            payload: {
              instance_id: "an_instance_id",
              timestamp: 0,
              user_id: "a_user_id",
              is_admin: false,
              is_guest: true,
            }
          }
        });
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

    describe("when use_post is set to false", () => {
      beforeEach(() => {
        data = Immutable.fromJS({
          app: {
            name: "New App",
            namespace: "new-app",
            url: "examples/new_app.html",
            use_post: false
          },
        });
        AppActions.receiveAppConfiguration(data);
      });

      it("sets the post_data to a blank stub", () => {
        var historyItem = HistoryStore.getHistory("apps").get(2);
        expect(historyItem.get("post_data")).to.eql(Immutable.fromJS({ payload: {} }));
      });
    });
  });
});
