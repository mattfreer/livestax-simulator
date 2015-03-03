"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var AppStore = require("../../scripts/stores/app_store");
var AppConfigurator = require("../../scripts/components/app_configurator");

describe("AppConfigurator", () => {
  var appConfigurator, inputs, form;

  beforeEach(() => {
    AppStore.reset();
    appConfigurator = TestUtils.renderIntoDocument(React.createElement(AppConfigurator));
    inputs = TestUtils.scryRenderedDOMComponentsWithTag(appConfigurator, "input");
    form = TestUtils.findRenderedDOMComponentWithTag(appConfigurator, "form");
  });

  it("displays a form with the store values", () => {
    var app = AppStore.getApp();
    expect(inputs[0].getDOMNode().value).to.eql(app.getIn(["app", "name"]));
    expect(inputs[1].getDOMNode().value).to.eql(app.getIn(["app", "namespace"]));
    expect(inputs[2].getDOMNode().value).to.eql(app.getIn(["app", "url"]));
  });

  describe("when the form is changed", () => {
    beforeEach(() => {
      TestUtils.Simulate.change(inputs[0].getDOMNode(), {
        target: {
          name: "name",
          value: "New Value"
        }
      });
    });

    it("shows the new value in the input box", () => {
      expect(inputs[0].getDOMNode().value).to.eql("New Value");
    });

    it("Updates the store with the new state on submit", () => {
      var oldName = AppStore.getApp().getIn(["app", "name"]);
      TestUtils.Simulate.submit(form.getDOMNode());
      var newName = AppStore.getApp().getIn(["app", "name"]);
      expect(oldName).to.not.equal(newName);
      expect(newName).to.eql("New Value");
    });
  });
});
