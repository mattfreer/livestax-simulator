"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var Input = require("./lib/input_horizontal");
var MessageActions = require("../actions/message_actions");
var MessageStore = require("../stores/message_store");
var Validator = require("../lib/validator");
var CustomValidators = require("../lib/custom_validators");
var ValidationForm = require("./validation_form");

var validations = {
  namespace: [Validator.required, CustomValidators.namespace],
  key: [Validator.required]
};

var getState = () => {
  return Immutable.Map({
    message: MessageStore.getMessage(),
    errors: Immutable.Map()
  });
};

var MessageGenerator = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    MessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  changeField(event) {
    var nextState = this.state.setIn(["message", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  submitForm(event) {
    MessageActions.receiveGeneratedMessage(this.state.get("message"));
  },

  formError(errors) {
    this.replaceState(this.state.set("errors", errors));
  },

  render() {
    var message = this.state.get("message");
    var errors = this.state.get("errors");
    return (
      <CollapsiblePanel heading="Message Generator">
        <ValidationForm fields={message}
          validations={validations}
          onSubmit={this.submitForm}
          onError={this.formError}>

          <Input label="Namespace"
            name="namespace"
            value={message.get("namespace").toString()}
            error={errors.getIn(["namespace", 0])}
            onChange={this.changeField}
          />

          <Input label="Key"
            name="key"
            value={message.get("key").toString()}
            error={errors.getIn(["key", 0])}
            onChange={this.changeField}
          />

          <Input label="Value"
            name="value"
            value={message.get("value").toString()}
            error={errors.getIn(["value", 0])}
            onChange={this.changeField}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </ValidationForm>
      </CollapsiblePanel>
    );
  }
});

module.exports = MessageGenerator;
