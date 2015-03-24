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

  _renderLog(log, key) {
    var payload = log.get("payload");
    var subtype = (<span className="text-muted">null</span>);

    if(payload) {
      if(payload.has("type")) {
        subtype = payload.get("type");
        payload = payload.delete("type");
      }

      if(!payload.isEmpty()) {
        payload = JSON.stringify(payload.toJS());
      } else {
        payload = undefined;
      }
    }

    return (<tr key={key}>
        <td>{log.get("type")}</td>
        <td>{subtype}</td>
        <td>{payload}</td>
      </tr>)
  },

  render() {
    var logs = this.state.get("logs").map(this._renderLog).toJS();
    return (
      <CollapsiblePanel heading="Logger">
        <table className="table table-condensed table-hover logger-table">
          <tbody>
            {logs}
          </tbody>
        </table>
      </CollapsiblePanel>
    );
  },
});

module.exports = Logger;
