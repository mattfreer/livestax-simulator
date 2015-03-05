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
      ]
    }));
    history = TestUtils.renderIntoDocument(<History historyKey="apps" onClick={callback} heading="History" />);
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
  });

  afterEach(() => {
    clock.restore();
  });

  it("renders a tr per history item", function() {
    expect(listItems.length).to.eql(2);
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
    TestUtils.Simulate.click(link.getDOMNode());
    expect(callback).to.have.been.calledWith(Immutable.fromJS({
      name: "Some App",
      namespace: "some-app",
      url: "examples/app.html",
      createdAt: Moment().unix()
    }));
  });

  it("deletes a history item when the x is clicked", function() {
    var links = TestUtils.scryRenderedDOMComponentsWithClass(listItems[0], "delete-item");
    TestUtils.Simulate.click(links[0].getDOMNode());
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "tr");
    expect(listItems.length).to.eql(1);
  });
});
