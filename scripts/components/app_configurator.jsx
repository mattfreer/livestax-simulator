"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var AppActions = require("../actions/app_actions");
var AppStore = require("../stores/app_store");
var Input = require("./lib/input_horizontal");
var Validator = require("../lib/validator");
var CustomValidators = require("../lib/custom_validators");
var ValidationForm = require("./validation_form");

var validations = {
  name: [Validator.required],
  namespace: [Validator.required, CustomValidators.namespace],
  url: [Validator.required]
};

var getState = () => {
  return Immutable.Map({
    app: AppStore.getApp().get("app"),
    errors: Immutable.Map()
  });
};

var AppConfigurator = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  changeField(event) {
    var nextState = this.state.setIn(["app", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  formError(errors) {
    this.replaceState(this.state.set("errors", errors));
  },

  submitForm(event) {
    AppActions.receiveAppConfiguration(this.state.get("app"));
  },

  render() {
    var app = this.state.get("app");
    var errors = this.state.get("errors");
    return (
      <CollapsiblePanel heading="App Configuration">
        <ValidationForm fields={app}
          validations={validations}
          onSubmit={this.submitForm}
          onError={this.formError}>

          <Input label="Name"
            name="name"
            value={app.get("name")}
            error={errors.getIn(["name", 0])}
            onChange={this.changeField}
          />

          <Input label="Namespace"
            name="namespace"
            value={app.get("namespace")}
            error={errors.getIn(["namespace", 0])}
            onChange={this.changeField}
          />

          <Input label="App URL"
            name="url"
            value={app.get("url")}
            error={errors.getIn(["url", 0])}
            onChange={this.changeField}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
          </ValidationForm>
      </CollapsiblePanel>
    );
  }
});

module.exports = AppConfigurator;
