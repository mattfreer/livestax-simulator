"use strict";

require("../test_helper");

var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var LoggerStore = require("../../scripts/stores/logger_store");
var Logger = require("../../scripts/components/logger");

describe("Logger", () => {
  beforeEach(() => {
    LoggerStore.reset();
    var logState = Immutable.fromJS([
      {
        type: "on",
        payload: {type: "another-app.some_id"},
        direction: "from"
      },
      {
        type: "store",
        payload: {
          type: "set",
          data: {
            key: "selected_customer",
            value: 57
          }
        },
        direction: "to"
      },
    ]);
    LoggerStore.replaceState(logState);
  });

  it("displays the results in the panel", function() {
    var logger = TestUtils.renderIntoDocument(<Logger />);
    var rows = TestUtils.scryRenderedDOMComponentsWithTag(logger, "tr");
    expect(rows[0].getDOMNode().textContent).to.include("on");
    expect(rows[0].getDOMNode().textContent).to.include("another-app.some_id");
    expect(rows[0].getDOMNode().querySelector("i").className).to.include("fa-sign-out");
    expect(rows[1].getDOMNode().textContent).to.include("store");
    expect(rows[1].getDOMNode().textContent).to.include("set");
    expect(rows[1].getDOMNode().textContent).to.include("selected_customer");
    expect(rows[1].getDOMNode().textContent).to.include("57");
    expect(rows[1].getDOMNode().querySelector("i").className).to.include("fa-sign-in");
  });

  it("clears the results when clear is pressed", function() {
    var logger = TestUtils.renderIntoDocument(<Logger />);
    var clear = TestUtils.findRenderedDOMComponentWithClass(logger, "clear-logger");
    expect(LoggerStore.getLogs().size).to.eql(2);
    TestUtils.Simulate.click(clear.getDOMNode());
    expect(LoggerStore.getLogs().size).to.eql(0);
  });

  describe("filters", () => {
    var logger, filters;

    beforeEach(() => {
      logger = TestUtils.renderIntoDocument(<Logger />);
      var filterContainer = TestUtils.findRenderedDOMComponentWithClass(logger, "filters");
      filters = TestUtils.scryRenderedDOMComponentsWithClass(filterContainer, "label");
    });

    it("renders log items for selected filters", function() {
      var rows;

      TestUtils.Simulate.click(filters[1].getDOMNode());
      rows = TestUtils.scryRenderedDOMComponentsWithTag(logger, "tr");
      expect(rows.length).to.eql(1);

      TestUtils.Simulate.click(filters[2].getDOMNode());
      rows = TestUtils.scryRenderedDOMComponentsWithTag(logger, "tr");
      expect(rows.length).to.eql(2);
    });

    describe("when clear is clicked", () => {
      it("clears the active filters", function() {
        var clear = TestUtils.findRenderedDOMComponentWithClass(logger, "clear-logger");
        TestUtils.Simulate.click(filters[1].getDOMNode());
        expect(logger.state.get("active")).to.eql(Immutable.List(["on"]));
        TestUtils.Simulate.click(clear.getDOMNode());
        expect(logger.state.get("active")).to.eql(Immutable.List([]));
      });
    });
  });
});
