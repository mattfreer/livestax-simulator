"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var AppActions = require("../actions/app_actions");
var AppStore = require("../stores/app_store");
var Input = require("./lib/input_horizontal");
var Checkbox = require("./lib/checkbox_horizontal");
var InputGroup = require("./lib/input_group_horizontal");
var Radio = require("./lib/radio_horizontal");
var Validator = require("../lib/validator");
var CustomValidators = require("../lib/custom_validators");
var ValidationForm = require("./validation_form");

var validations = Immutable.fromJS({
  name: [Validator.required],
  namespace: [Validator.required, CustomValidators.namespace],
  url: [Validator.required]
});

var validationsWithSignedRequest = validations.concat(Immutable.fromJS({
  secret_key: [Validator.required],
  instance_id: [Validator.required]
}));

var disableFields = (state) => {
  var disabled = Immutable.List();
  if (state.getIn(["post_data", "payload", "is_guest"])) {
    disabled = disabled.push("user_id");
  }
  return disabled;
};

var getState = () => {
  var storeData = AppStore.getApp();
  var state = Immutable.Map({
    app: storeData.get("app"),
    post_data: storeData.get("post_data"),
    errors: Immutable.Map()
  });
  return state.set("disabled_fields", disableFields(state));
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

  _updateField(path, value) {
    var nextState = this.state.setIn(path, value);
    this.replaceState(nextState);
  },

  toggleSignedRequest() {
    var nextState = this.state.updateIn(["app", "use_post"], (isChecked) => !isChecked);
    this.replaceState(nextState);
  },

  changeField(event) {
    this._updateField(["app", event.target.name], event.target.value);
  },

  changeSignedRequestField(event) {
    this._updateField(["post_data", "payload", event.target.name], event.target.value);
  },

  changeSecret(event) {
    this._updateField(["post_data", "secret_key"], event.target.value);
  },

  toggleUserType(event) {
    var nextState = this.state.setIn(["post_data", "payload", "is_admin"], false)
      .setIn(["post_data", "payload", "is_guest"], false)
      .setIn(["post_data", "payload", event.target.value], true);
    nextState = nextState.set("disabled_fields", disableFields(nextState));
    this.replaceState(nextState);
  },

  formError(errors) {
    this.replaceState(this.state.set("errors", errors));
  },

  submitForm() {
    AppActions.receiveAppConfiguration(this.state.delete("errors"));
  },

  getValidations() {
    if(this.state.getIn(["app", "use_post"])) {
      return validationsWithSignedRequest;
    }
    return validations;
  },

  getSignedRequestFormClasses() {
    if(!this.state.getIn(["app", "use_post"])) {
      return "hidden";
    }
    return "";
  },

  render() {
    var app = this.state.get("app");
    var payload = this.state.getIn(["post_data", "payload"]);
    var disabled = this.state.get("disabled_fields");
    var errors = this.state.get("errors");
    return (
      <CollapsiblePanel heading="App Configuration">
        <ValidationForm fields={this.state.flatten()}
          validations={this.getValidations().toJS()}
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

          <Checkbox name="use_post"
            checked={app.get("use_post")}
            onChange={this.toggleSignedRequest}
            label="App Type"
            text="Signed Request"
          />

          <div id="signed-request-form" className={this.getSignedRequestFormClasses()}>
            <Input label="Secret Key"
              name="secret_key"
              value={this.state.getIn(["post_data", "secret_key"])}
              error={errors.getIn(["secret_key", 0])}
              onChange={this.changeSecret}
            />

            <Input label="Instance ID"
              name="instance_id"
              value={payload.get("instance_id")}
              error={errors.getIn(["instance_id", 0])}
              onChange={this.changeSignedRequestField}
            />

            <Input label="Timestamp"
              name="timestamp"
              value={payload.get("timestamp")}
              onChange={this.changeSignedRequestField}
            />

            <InputGroup label="User Type">
              <Radio name="user_type"
                value="is_guest"
                text="Guest"
                checked={payload.get("is_guest")}
                onChange={this.toggleUserType}
              />

              <Radio name="user_type"
                value="is_admin"
                text="Admin"
                checked={payload.get("is_admin")}
                onChange={this.toggleUserType}
              />
            </InputGroup>

            <Input label="User ID"
              name="user_id"
              value={payload.get("user_id")}
              onChange={this.changeSignedRequestField}
              disabled={disabled.contains("user_id")}
            />
          </div>

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </ValidationForm>
      </CollapsiblePanel>
    );
  }
});

module.exports = AppConfigurator;
