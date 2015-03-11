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

var disableFields = (state) => {
  var disabled = Immutable.List();
  if (state.getIn(["post_data", "payload", "is_guest"])) {
    disabled = disabled.push("user_id");
  }
  return disabled;
};

var getState = () => {
  var state = Immutable.Map({
    post_data: AppStore.getApp().get("post_data"),
    disabled_fields: Immutable.List()
  });

  return state.set("disabled_fields", disableFields(state));
};

var SignedRequest = React.createClass({
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

  toggleSignedRequest() {
    var nextState = this.state.updateIn(["post_data", "use_post"], (isChecked) => !isChecked);
    this.replaceState(nextState);
  },

  changeField(event) {
    var nextState = this.state.setIn(["post_data", "payload", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  changeSecret(event) {
    var nextState = this.state.setIn(["post_data", "secret_key"], event.target.value);
    this.replaceState(nextState);
  },

  toggleUserType(event) {
    var nextState = this.state.setIn(["post_data", "payload", "is_admin"], false);
    nextState = nextState.setIn(["post_data", "payload", "is_guest"], false);
    nextState = nextState.setIn(["post_data", "payload", event.target.value], true);
    nextState = nextState.set("disabled_fields", disableFields(nextState));
    this.replaceState(nextState);
  },

  submitForm(event) {
    event.preventDefault();
    AppActions.receiveSignedRequest(this.state.get("post_data"));
  },

  render() {
    var payload = this.state.getIn(["post_data", "payload"]);
    var disabled = this.state.get("disabled_fields");
    return (
      <CollapsiblePanel heading="Signed Request">
        <form className="form-horizontal" onSubmit={this.submitForm}>
          <Checkbox name="use_post"
            checked={this.state.getIn(["post_data", "use_post"])}
            onChange={this.toggleSignedRequest}
            label="App Type"
            text="Signed Request"
          />

          <Input label="Secret Key"
            name="secret_key"
            value={this.state.getIn(["post_data", "secret_key"])}
            onChange={this.changeSecret}
          />

          <Input label="Instance ID"
            name="instance_id"
            value={payload.get("instance_id")}
            onChange={this.changeField}
          />

          <Input label="Timestamp"
            name="timestamp"
            value={payload.get("timestamp")}
            onChange={this.changeField}
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
            onChange={this.changeField}
            disabled={disabled.contains("user_id")}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </form>
      </CollapsiblePanel>
    );
  }
});

module.exports = SignedRequest;