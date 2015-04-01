"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var Input = require("./lib/input_horizontal");
var StoreTable = require("./store_table");
var AppActions = require("../actions/app_actions");
var KeyValueStore = require("../stores/key_value_store");

var getState = () => {
  return Immutable.Map({
    form: Immutable.Map({
      key: "",
      value: ""
    }),
    values: Immutable.fromJS(KeyValueStore.getValues())
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
    var nextState = this.state.set("values", getState().get("values"));
    this.replaceState(nextState);
  },

  changeField(event) {
    var nextState = this.state.setIn(["form", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  submitForm(event) {
    event.preventDefault();
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

  render() {
    return (
      <CollapsiblePanel heading="Key Value Store">
        <form className="form-horizontal" onSubmit={this.submitForm}>

          <Input label="Key"
            placeholder="Namespace.Key"
            name="key"
            value={this.state.getIn(["form", "key"])}
            onChange={this.changeField}
          />

          <Input label="Value"
            name="value"
            value={this.state.getIn(["form", "value"])}
            onChange={this.changeField}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </form>
        <StoreTable onClick={this.populateForm} onDelete={this.deleteItem} values={this.state.get("values")} />
      </CollapsiblePanel>
    );
  }
});

module.exports = StorePanel;
