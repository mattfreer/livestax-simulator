"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var MenuPanel = require("../../scripts/components/menu_panel");
var MenuStore = require("../../scripts/stores/menu_store");
var MenuActions = require("../../scripts/actions/menu_actions");

describe("MenuPanel", () => {
  var instance;

  beforeEach(() => {
    MenuStore.replaceState(Immutable.fromJS({
      items: [
        {
          name: "Help"
        },
        {
          name: "Beer",
          icon: "beer",
        },
        {
          name: "Another Menu Item"
        }
      ]
    }));
    instance = TestUtils.renderIntoDocument(
      <MenuPanel />
    );
  });

  afterEach(() => {
    React.unmountComponentAtNode(instance.getDOMNode().parentNode);
  });

  describe("menu items", () => {
    var items;

    beforeEach(() => {
      items = TestUtils.scryRenderedDOMComponentsWithClass(instance, "menu-item");
    });


    describe("reload menu item", () => {
      it("renders the text", () => {
        expect(items[0].getDOMNode().textContent).to.eql("Reload");
      });

      it("renders the icon", () => {
        expect(items[0].getDOMNode().querySelector(".fa").className).to.include("fa-refresh");
      });

    });

    describe("custom menu items", () => {
      it("renders the text", () => {
        var itemTexts = Immutable.fromJS(items).shift().map((item) => item.getDOMNode().textContent);
        expect(itemTexts).to.eql(Immutable.List(["Help", "Beer", "Another Menu Item"]));
      });

      it("renders the icons with circle-o as a fallback", () => {
        var icons = Immutable.fromJS(items).shift().map((item) => item.getDOMNode().querySelector(".fa").className);
        expect(icons.get(0)).to.include("circle-o");
        expect(icons.get(1)).to.include("beer");
        expect(icons.get(2)).to.include("circle-o");
      });

      it("triggers a menu action with the item name", () => {
        sinon.spy(MenuActions, "menuInteraction");
        TestUtils.Simulate.click(items[3].getDOMNode());
        expect(MenuActions.menuInteraction).to.have.been.calledWith("Another Menu Item");
      });
    });
  });
});
