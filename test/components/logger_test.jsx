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
    var logState = Immutable.List([
      Immutable.Map({
        type: "on",
        payload: "another-app.some_id"
      }),
      Immutable.Map({
        type: "store",
        payload: {
          type: "set",
          data: {
            key: "selected_customer",
            value: 57
          }
        }
      }),
    ]);
    LoggerStore.replaceState(logState);
  });

  it("displays the results in the panel", function() {
    var logger = TestUtils.renderIntoDocument(<Logger />);
    var rows = TestUtils.scryRenderedDOMComponentsWithTag(logger, "li");
    expect(rows[0].getDOMNode().textContent).to.include("on");
    expect(rows[0].getDOMNode().textContent).to.include("another-app.some_id");
    expect(rows[1].getDOMNode().textContent).to.include("store");
    expect(rows[1].getDOMNode().textContent).to.include("set");
    expect(rows[1].getDOMNode().textContent).to.include("selected_customer");
    expect(rows[1].getDOMNode().textContent).to.include("57");
  });
});
