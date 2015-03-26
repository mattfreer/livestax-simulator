"use strict";

require("../../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var FilterList = require("../../../scripts/components/lib/filter_list");

var filters = [
  {label: "App config", data: "apps"},
  {label: "Messages", data: "messages"},
];

describe("FilterList", () => {
  var callback;

  beforeEach(() => {
    callback = sinon.stub();
  });

  it("renders labels for each filter and includes an `All` filter", () => {
    var instance = TestUtils.renderIntoDocument(
      <FilterList filters={filters} onFilterChange={callback} />
    );
    var labels = TestUtils.scryRenderedDOMComponentsWithClass(instance, "label");
    var filterText = Immutable.List(labels).map((item) => {
      return item.getDOMNode().textContent;
    });
    expect(filterText).to.eql(Immutable.List(["All", "App config", "Messages"]));
  });

   describe("when a filter is clicked", () => {
     it("triggers `props.onFilterChange`", () => {
       var instance = TestUtils.renderIntoDocument(
         <FilterList filters={filters} onFilterChange={callback} />
       );

       var labels = TestUtils.scryRenderedDOMComponentsWithClass(instance, "label");
       TestUtils.Simulate.click(labels[2].getDOMNode());
       expect(callback).to.have.been.calledWith("messages");
     });
   });
});

