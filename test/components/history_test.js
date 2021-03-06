"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var HistoryStore = require("../../scripts/stores/history_store");
var History = require("../../scripts/components/history");
var Moment = require("moment");

describe("History", () => {
  var history, listItems, callback, clock;

  beforeEach(() => {
    callback = sinon.stub();
    clock = sinon.useFakeTimers();

    HistoryStore.replaceState(Immutable.fromJS({
      apps: [
        {
          name: "Some App",
          namespace: "some-app",
          url: "examples/app.html",
          createdAt: Moment().unix()
        },
        {
          name: "Another App",
          namespace: "another-app",
          url: "examples/app.html"
        }
      ],
      messages: [
        {
          namespace: "some-app",
          key: "m1",
          value: "a val"
        }
      ]
    }));
    history = TestUtils.renderIntoDocument(<History onClick={callback} heading="History" />);
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
  });

  afterEach(() => {
    clock.restore();
    React.unmountComponentAtNode(history.getDOMNode().parentNode);
  });

  it("renders a tr per history item", function() {
    expect(listItems.length).to.eql(3);
  });

  it("renders a timestamp per item", function() {
    var items = TestUtils.scryRenderedDOMComponentsWithClass(listItems[0], "item-content");
    var item = items.find((el) => el.props.children.indexOf("Some App"));
    var timestamp = new Moment().format("DD/MM/YYYY, HH:mm");
    expect(item.getDOMNode().textContent).to.include(timestamp);
  });

  it("triggers the callback when the text item is clicked", function() {
    var links = TestUtils.scryRenderedDOMComponentsWithClass(listItems[0], "item-content");
    var link = links.find((el) => el.props.children.indexOf("Some App"));
    var expected = HistoryStore.getHistory().get(0);
    TestUtils.Simulate.click(link.getDOMNode());
    expect(callback).to.have.been.calledWith(expected);
  });

  it("deletes a history item when the x is clicked", function() {
    var links = TestUtils.scryRenderedDOMComponentsWithClass(listItems[0], "delete-item");
    TestUtils.Simulate.click(links[0].getDOMNode());
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
    expect(listItems.length).to.eql(2);
  });

  it("clears all history items when `clear` is clicked", function() {
    var toolbar = TestUtils.findRenderedDOMComponentWithClass(history, "panel-toolbar-actions");
    var actions = TestUtils.scryRenderedDOMComponentsWithClass(toolbar, "label");
    TestUtils.Simulate.click(actions[0].getDOMNode());
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
    expect(listItems.length).to.eql(0);
  });

  describe("filters", () => {
    var filterContainer;

    beforeEach(() => {
      filterContainer = TestUtils.findRenderedDOMComponentWithClass(history, "filters");
    });

    describe("when filters are selected", () => {
      it("only renders history items for those filters", function() {
        var filters = TestUtils.scryRenderedDOMComponentsWithClass(filterContainer, "label");

        TestUtils.Simulate.click(filters[2].getDOMNode());
        listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
        expect(listItems.length).to.eql(1);

        TestUtils.Simulate.click(filters[1].getDOMNode());
        listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
        expect(listItems.length).to.eql(3);

        TestUtils.Simulate.click(filters[0].getDOMNode());
        listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
        expect(listItems.length).to.eql(3);
      });
    });

    describe("when the last history item is deleted from a filter set", () => {
      beforeEach(() => {
        var filters = TestUtils.scryRenderedDOMComponentsWithClass(filterContainer, "label");
        TestUtils.Simulate.click(filters[2].getDOMNode());
        var deleteLinks = TestUtils.scryRenderedDOMComponentsWithClass(history, "delete-item");
        TestUtils.Simulate.click(deleteLinks[0]);
      });

      it("removes the filter type from the list", function() {
        var filters = TestUtils.scryRenderedDOMComponentsWithClass(filterContainer, "label");
        var filterText = Immutable.List(filters).map((item) => {
          return item.getDOMNode().textContent;
        });
        expect(filterText).to.eql(Immutable.List(["All", "App config"]));
      });

      it("selects the 'All' filter", () => {
        var filters = TestUtils.scryRenderedDOMComponentsWithClass(filterContainer, "label");
        var selectedFilter = Immutable.List(filters).find((item) => {
          return item.getDOMNode().className.match(/label-primary/);
        });
        expect(selectedFilter.getDOMNode().textContent).to.eql("All");
      });
    });

    describe("when all history items are deleted", () => {
      beforeEach(() => {
        var deleteLinks = TestUtils.scryRenderedDOMComponentsWithClass(history, "delete-item");
        TestUtils.Simulate.click(deleteLinks[2]);
        TestUtils.Simulate.click(deleteLinks[1]);
        TestUtils.Simulate.click(deleteLinks[0]);
      });

      it("displays no filters", () => {
        var filters = TestUtils.scryRenderedDOMComponentsWithClass(history, "label");
        expect(filters.length).to.eql(0);
      });

      it("displays a notice", () => {
        var help = TestUtils.findRenderedDOMComponentWithClass(history, "panel-body");
        expect(help.getDOMNode().textContent).to.eql("History items will appear in this panel.");
      });
    });
  });
});
