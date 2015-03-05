"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var Input = require("./lib/input_horizontal");
var MessageActions = require("../actions/message_actions");
var MessageStore = require("../stores/message_store");
var Validator = require("../lib/validator");
var CustomValidators = require("../lib/custom_validators");

var validations = {
  namespace: [Validator.required, CustomValidators.namespace],
  key: [Validator.required]
};

var MessageGenerator = React.createClass({
  getInitialState() {
    return Immutable.Map({
      message: MessageStore.getMessage(),
      errors: Immutable.Map()
    });
  },

  changeField(event) {
    var nextState = this.state.setIn(["message", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  submitForm(event) {
    event.preventDefault();
    var errors = Validator.validate(this.state.get("message"), validations);
    if (!Validator.hasErrors(errors)) {
      MessageActions.receiveGeneratedMessage(this.state.get("message"));
    }
    this.replaceState(this.state.set("errors", errors));
  },

  render() {
    var message = this.state.get("message");
    var errors = this.state.get("errors");
    return (
      <CollapsiblePanel heading="Message Generator">
        <form className="form-horizontal" onSubmit={this.submitForm}>
          <Input label="Namespace"
            name="namespace"
            value={message.get("namespace")}
            error={errors.getIn(["namespace", 0])}
            onChange={this.changeField}
          />

          <Input label="Key"
            name="key"
            value={message.get("key")}
            error={errors.getIn(["key", 0])}
            onChange={this.changeField}
          />

          <Input label="Value"
            name="value"
            value={message.get("value")}
            error={errors.getIn(["value", 0])}
            onChange={this.changeField}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </form>
      </CollapsiblePanel>
    );
  }
});

module.exports = MessageGenerator;
