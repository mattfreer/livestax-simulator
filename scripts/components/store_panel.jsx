"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var Input = require("./lib/input_horizontal");
var AppActions = require("../actions/app_actions");

var getState = () => {
  return Immutable.Map({
    store: Immutable.Map({
      key: "",
      value: ""
    })
  });
};

var AppConfigurator = React.createClass({
  getInitialState: getState,

  changeField(event) {
    var nextState = this.state.setIn(["store", event.target.name], event.target.value);
    this.replaceState(nextState);
  },

  submitForm(event) {
    event.preventDefault();
    AppActions.receiveStoreConfiguration(this.state.get("store"));
  },

  render() {
    return (
      <CollapsiblePanel heading="Key Value Store">
        <form className="form-horizontal" onSubmit={this.submitForm}>

          <Input label="Key"
            name="key"
            value={this.state.getIn(["store", "key"])}
            onChange={this.changeField}
          />

          <Input label="Value"
            name="value"
            value={this.state.getIn(["store", "value"])}
            onChange={this.changeField}
          />

          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </form>
      </CollapsiblePanel>
    );
  }
});

module.exports = AppConfigurator;
