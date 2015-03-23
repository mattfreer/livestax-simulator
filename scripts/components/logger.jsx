"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var LogStore = require("../stores/logger_store");

var getState = () => {
  return Immutable.Map({
    logs: LogStore.getLogs()
  });
};

var Logger = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    LogStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    LogStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  _renderLog(log) {
    var payload = log.get("payload");
    if (typeof payload === "object") {
      payload = JSON.stringify(payload);
    }
    return (<li>{log.get("type")}: {payload}</li>);
  },

  render() {
    var logs = this.state.get("logs").map(this._renderLog).toJS();
    return (
      <CollapsiblePanel heading="Logger">
        <ul>
          {logs}
        </ul>
      </CollapsiblePanel>
    );
  },
});

module.exports = Logger;
