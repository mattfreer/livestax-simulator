"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var Input = require("./lib/input_horizontal");
var StoreTable = require("./store_table");
var AppActions = require("../actions/app_actions");
var KeyValueStore = require("../stores/key_value_store");
var Validator = require("../lib/validator");
var CustomValidators = require("../lib/custom_validators");
var ValidationForm = require("./validation_form");

var validations = {
  key: [Validator.required, CustomValidators.namespaceKey]
};

var getState = () => {
  return Immutable.Map({
    form: Immutable.Map({
      key: "",
      value: ""
    }),
    values: Immutable.fromJS(KeyValueStore.getValues()),
    errors: Immutable.Map()
  });
};

var StorePanel = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    KeyValueStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    KeyValueStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    var nextState = this.state
      .set("values", getState().get("values"))
      .set("errors", Immutable.Map());
    this.replaceState(nextState);
  },

  changeField(event) {
    var nextState = this.state.setIn(["form", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  submitForm(event) {
    this.replaceState(this.state.set("errors", null));
    AppActions.receiveStoreConfiguration(this.state.get("form"));
  },

  populateForm(key, val) {
    if (typeof val === "object") {
      val = JSON.stringify(val);
    }
    var nextState = this.state
      .setIn(["form", "key"], key)
      .setIn(["form", "value"], val.toString());
    this.replaceState(nextState);
  },

  deleteItem(key) {
    AppActions.deleteStoreItem(key);
  },

  formError(errors) {
    this.replaceState(this.state.set("errors", errors));
  },

  render() {
    var form = this.state.get("form");
    var errors = this.state.get("errors");
    return (
      <CollapsiblePanel heading="Key Value Store">
        <ValidationForm fields={form}
          validations={validations}
          onSubmit={this.submitForm}
          onError={this.formError}>

          <Input label="Key"
            placeholder="Namespace.Key"
            name="key"
            value={this.state.getIn(["form", "key"])}
            error={errors.getIn(["key", 0])}
            onChange={this.changeField}
          />

          <Input label="Value"
            name="value"
            value={this.state.getIn(["form", "value"])}
            error={errors.getIn(["value", 0])}
            onChange={this.changeField}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </ValidationForm>

        <StoreTable onClick={this.populateForm} onDelete={this.deleteItem} values={this.state.get("values")} />
      </CollapsiblePanel>
    );
  }
});

module.exports = StorePanel;
