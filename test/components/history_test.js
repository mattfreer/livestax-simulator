"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var HistoryStore = require("../../scripts/stores/history_store");
var History = require("../../scripts/components/history");

describe("History", () => {
  var history, listItems, callback;

  beforeEach(() => {
    callback = sinon.stub();
    HistoryStore.replaceState(Immutable.fromJS({
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
      ]
    }));
    history = TestUtils.renderIntoDocument(<History historyKey="apps" onClick={callback} heading="History" />);
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "li");
  });

  it("renders an li per history item", function() {
    expect(listItems.length).to.eql(2);
  });

  it("triggers the callback when the text item is clicked", function() {
    var links = TestUtils.scryRenderedDOMComponentsWithTag(listItems[0], "a");
    var link = links.find((el) => el.props.children === "Some App");
    TestUtils.Simulate.click(link.getDOMNode());
    expect(callback).to.have.been.calledWith(Immutable.fromJS({
      name: "Some App",
      namespace: "some-app",
      url: "examples/app.html"
    }));
  });

  it("deletes a history item when the x is clicked", function() {
    var links = TestUtils.scryRenderedDOMComponentsWithTag(listItems[0], "a");
    TestUtils.Simulate.click(links[1].getDOMNode());
    listItems = TestUtils.scryRenderedDOMComponentsWithTag(history, "li");
    expect(listItems.length).to.eql(1);
  });
});
