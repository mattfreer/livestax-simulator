"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var KeyValueStore = require("../../scripts/stores/key_value_store");
var StorePanel = require("../../scripts/components/store_panel");
var AppActions = require("../../scripts/actions/app_actions");

describe("StorePanel", () => {
  var storePanel, inputs, form;

  beforeEach(() => {
    KeyValueStore.reset();
    sinon.spy(AppActions, "receiveStoreConfiguration");
    storePanel = TestUtils.renderIntoDocument(React.createElement(StorePanel));
    inputs = TestUtils.scryRenderedDOMComponentsWithTag(storePanel, "input");
    form = TestUtils.findRenderedDOMComponentWithTag(storePanel, "form");
  });

  afterEach(() => {
    AppActions.receiveStoreConfiguration.restore();
  });

  describe("when the form is changed with valid data", () => {
    beforeEach(() => {
      TestUtils.Simulate.change(inputs[0].getDOMNode(), {
        target: {
          name: "key",
          value: "valid-namespace.key_to_set"
        }
      });

      TestUtils.Simulate.change(inputs[1].getDOMNode(), {
        target: {
          name: "value",
          value: "27"
        }
      });
    });

    it("shows the new value in the input box", () => {
      expect(inputs[0].getDOMNode().value).to.eql("valid-namespace.key_to_set");
      expect(inputs[1].getDOMNode().value).to.eql("27");
    });

    it("triggers a storeConfiguration event on submit", () => {
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(AppActions.receiveStoreConfiguration).to.have.been.called;
    });
  });
});
