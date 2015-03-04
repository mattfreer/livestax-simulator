"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var MessageStore = require("../../scripts/stores/message_store");
var MessageGenerator = require("../../scripts/components/message_generator");

describe("MessageGenerator", () => {
  var messageGenerator, inputs, form;

  beforeEach(() => {
    MessageStore.reset();
    messageGenerator = TestUtils.renderIntoDocument(React.createElement(MessageGenerator));
    inputs = TestUtils.scryRenderedDOMComponentsWithTag(messageGenerator, "input");
    form = TestUtils.findRenderedDOMComponentWithTag(messageGenerator, "form");
  });

  it("displays a form with the store values", () => {
    var message = MessageStore.getMessage();
    expect(inputs[0].getDOMNode().value).to.eql(message.get("namespace"));
    expect(inputs[1].getDOMNode().value).to.eql(message.get("key"));
    expect(inputs[2].getDOMNode().value).to.eql(message.get("value"));
  });

  describe("when the form is changed with valid data", () => {
    beforeEach(() => {
      TestUtils.Simulate.change(inputs[0].getDOMNode(), {
        target: {
          name: "namespace",
          value: "valid-namespace"
        }
      });
    });

    it("shows the new value in the input box", () => {
      expect(inputs[0].getDOMNode().value).to.eql("valid-namespace");
    });

    it("doesn't show any errors", function() {
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(messageGenerator.getDOMNode().textContent).to.not.include("Can't be blank");
    });

    it("Updates the store with the new state on submit", () => {
      var oldNamespace = MessageStore.getMessage().get("namespace");
      TestUtils.Simulate.submit(form.getDOMNode());
      var newNamespace = MessageStore.getMessage().get("namespace");
      expect(oldNamespace).to.not.equal(newNamespace);
      expect(newNamespace).to.eql("valid-namespace");
    });
  });

  describe("when the form is changed with invalid data", () => {
    beforeEach(() => {
      TestUtils.Simulate.change(inputs[0].getDOMNode(), {
        target: {
          name: "namespace",
          value: "invalid namespace"
        }
      });

      TestUtils.Simulate.change(inputs[1].getDOMNode(), {
        target: {
          name: "key",
          value: ""
        }
      });
    });

    it("highlights the errors to the fields", () => {
      expect(messageGenerator.getDOMNode().textContent).to.not.include("Must only contain lowercase letters, numbers and dashes");
      expect(messageGenerator.getDOMNode().textContent).to.not.include("Can't be blank");
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(messageGenerator.getDOMNode().textContent).to.include("Must only contain lowercase letters, numbers and dashes");
      expect(messageGenerator.getDOMNode().textContent).to.include("Can't be blank");
    });
  });
});
