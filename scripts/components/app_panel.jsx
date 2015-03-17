"use strict";

var React = require("react");
var AppBlocker = require("./app_blocker");
var AppIframe = require("./app_iframe");
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
          <AppBlocker status={this.state.get("status")} />
          <AppIframe status={this.state.get("status")}
            usePost={this.state.getIn(["app", "use_post"])}
            postData={this.state.get("post_data")}
            src={this.state.getIn(["app", "url"])}
          />
      </div>
    );
  }
});

module.exports = AppPanel;
