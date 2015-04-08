"use strict";

require("../test_helper");
var Immutable = require("immutable");
var MenuStore = require("../../scripts/stores/menu_store");
var AppActions = require("../../scripts/actions/app_actions");

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
    });
  });
});

