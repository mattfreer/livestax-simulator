"use strict";

var React = require("react");
var AppBlocker = require("./app_blocker");
var AppStore = require("../stores/app_store");

var AppPanel = React.createClass({
  getInitialState() {
    return AppStore.getApp();
  },
  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange() {
    this.replaceState(AppStore.getApp());
  },
  render() {
    return (
      <div className="app-panel-container panel panel-default">
        <div className="panel-heading">App</div>
        <AppBlocker status={this.state.status} />
        <iframe className="app-iframe" src="examples/app.html"></iframe>
      </div>
    );
  }
});

module.exports = AppPanel;
