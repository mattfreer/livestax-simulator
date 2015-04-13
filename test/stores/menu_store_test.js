"use strict";

require("../test_helper");
var Immutable = require("immutable");
var MenuStore = require("../../scripts/stores/menu_store");
var AppActions = require("../../scripts/actions/app_actions");
var MenuActions = require("../../scripts/actions/menu_actions");

describe("MenuStore", () => {

  beforeEach(() => {
    MenuStore.reset();
  });

  var postMessage = {
    type: "menu",
    payload: {
      type: "set",
      data: {
        name: "Help"
      }
    }
  };

  describe("getItems()", () => {
    it("is empty by default", () => {
      expect(MenuStore.getItems()).to.eql(Immutable.OrderedSet());
    });

    describe("when a menu mesage is received", () => {
      beforeEach(() => {
        AppActions.receivePostMessage(postMessage);
      });

      it("adds the item to the list", () => {
        var expected = Immutable.OrderedSet([Immutable.Map(postMessage.payload.data)]);
        expect(Immutable.is(MenuStore.getItems(), expected)).to.eql(true);
      });

      it("ignores duplicates", () => {
        var oldSize = MenuStore.getItems().size;
        AppActions.receivePostMessage(postMessage);
        expect(MenuStore.getItems().size).to.eql(oldSize);
      });

      describe("when an app configuration action is received", () => {
        beforeEach(() => {
          AppActions.receiveAppConfiguration(Immutable.fromJS({}));
        });

        it("resets the menu", () => {
          expect(MenuStore.getItems()).to.eql(Immutable.OrderedSet());
        });
      });

      describe("when a `ready` message is received", () => {
        beforeEach(() => {
          AppActions.receivePostMessage({ type: "ready" });
        });

        it("resets the menu", () => {
          expect(MenuStore.getItems()).to.eql(Immutable.OrderedSet());
        });
      });
    });
  });

  describe("removing menu items", () => {

    beforeEach(() => {
      MenuStore.replaceState(Immutable.Map({
        items: Immutable.OrderedSet([
          Immutable.Map({
            name: "Help"
          }),
          Immutable.Map({
            name: "Another"
          }),
          Immutable.Map({
            name: "Clear Selection"
          })
        ])
      }));
    });

    it("clears all the menu items on a clear event", () => {
      expect(MenuStore.getItems().size).to.eql(3);
      AppActions.receivePostMessage({
        type: "menu",
        payload: {
          type: "clear"
        }
      });
      expect(MenuStore.getItems().size).to.eql(0);
    });

    it("removes a specific item on an unset event", () => {
      AppActions.receivePostMessage({
        type: "menu",
        payload: {
          type: "unset",
          data: {
            name: "Another"
          }
        }
      });
      var expected = MenuStore.getItems().toList().map((item) => item.get("name"));
      expect(expected).to.eql(Immutable.List(["Help", "Clear Selection"]));
    });
  });

  describe("when a menu interaction action is triggered", () => {
    it("triggers a change event with the interaction", () => {
      var callback = sinon.stub();
      MenuStore.addChangeListener(callback);
      MenuActions.menuInteraction("help");
      expect(callback).to.have.been.calledWith("help");
    });
  });
});
