"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var AppActions = require("../actions/app_actions");
var AppStore = require("../stores/app_store");
var Input = require("./lib/input_horizontal");
var Validator = require("../lib/validator");
var CustomValidators = require("../lib/custom_validators");

var validations = {
  name: [Validator.required],
  namespace: [Validator.required, CustomValidators.namespace],
  url: [Validator.required]
};

var AppConfigurator = React.createClass({
  getInitialState() {
    return Immutable.Map({
      app: AppStore.getApp().get("app"),
      errors: Immutable.Map()
    });
  },
  changeField(event) {
    var nextState = this.state.setIn(["app", event.target.name], event.target.value);
    this.replaceState(nextState);
  },
  submitForm(event) {
    event.preventDefault();
    var errors = Validator.validate(this.state.get("app"), validations);
    if (!Validator.hasErrors(errors)) {
      AppActions.receiveAppConfiguration(this.state.get("app"));
    }
    this.replaceState(this.state.set("errors", errors));
  },
  render() {
    var app = this.state.get("app");
    var errors = this.state.get("errors");
    return (
      <CollapsiblePanel heading="App Configuration">
        <form className="form-horizontal" onSubmit={this.submitForm}>
          <Input label="Name" name="name" value={app.get("name")} error={errors.getIn(["name", 0])} onChange={this.changeField} />
          <Input label="Namespace" name="namespace" value={app.get("namespace")} error={errors.getIn(["namespace", 0])} onChange={this.changeField} />
          <Input label="App URL" name="url" value={app.get("url")} error={errors.getIn(["url", 0])} onChange={this.changeField} />
          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </form>
      </CollapsiblePanel>
    );
  }
});

module.exports = AppConfigurator;
