"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var AppActions = require("../actions/app_actions");
var AppStore = require("../stores/app_store");
var Input = require("./lib/input_horizontal");

var AppConfigurator = React.createClass({
  getInitialState() {
    return AppStore.getApp().get("app");
  },
  changeField(event) {
    var nextState = this.state.set(event.target.name, event.target.value);
    this.replaceState(nextState);
  },
  submitForm(event) {
    event.preventDefault();
    AppActions.receiveAppConfiguration(this.state);
  },
  render() {
    return (
      <CollapsiblePanel heading="App Configuration">
        <form className="form-horizontal" onSubmit={this.submitForm}>
          <Input label="Name" name="name" value={this.state.get("name")} onChange={this.changeField} />
          <Input label="Namespace" name="namespace" value={this.state.get("namespace")} onChange={this.changeField} />
          <Input label="App URL" name="url" value={this.state.get("url")} onChange={this.changeField} />
          <button type="submit" className="btn btn-primary pull-right">Submit</button>
        </form>
      </CollapsiblePanel>
    );
  }
});

module.exports = AppConfigurator;
