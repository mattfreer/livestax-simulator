"use strict";

var React = require("react");
var Immutable = require("immutable");
var CollapsiblePanel = require("./lib/collapsible_panel");
var LogStore = require("../stores/logger_store");
var LoggerActions = require("../actions/logger_actions");
var FilterList = require("./lib/filter_list");
var PanelToolbar = require("./lib/panel_toolbar");

var getFilters = () => {
  return LogStore.getLogTypes().map((item) => {
    return Immutable.Map({
      label: item,
      data: item
    });
  });
};

var getState = () => {
  return Immutable.Map({
    logs: LogStore.getLogs(),
    filters: getFilters(),
    active: Immutable.List()
  });
};

var doesFilterExist = (list, filter) => {
  return list.map((item) => {
    return item.get("data");
  }).contains(filter);
};

var Logger = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    LogStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    LogStore.removeChangeListener(this._onChange);
  },

  componentWillUpdate() {
    var node = this.getDOMNode().querySelector(".panel-body-container");
    this.shouldScroll = node.scrollTop + node.offsetHeight >= node.scrollHeight;
  },

  componentDidUpdate() {
    if (this.shouldScroll) {
      var node = this.getDOMNode().querySelector(".panel-body-container");
      node.scrollTop = node.scrollHeight;
    }
  },

  _onChange() {
    this.onFilterChange(this.state.get("active").toJS());
  },

  clear() {
    LoggerActions.clearLog();
  },

  arrowClass(log) {
    return log.get("direction") === "to" ? "sign-in text-muted" : "sign-out text-primary";
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
        <td>
          <i className={"fa fa-" + this.arrowClass(log)}></i>
          {log.get("type")}
        </td>
        <td>{subtype}</td>
        <td>{payload}</td>
      </tr>);
  },

  onFilterChange(filterList) {
    var filters = getFilters();

    Immutable.fromJS(filterList).filter((filter) => {
      return doesFilterExist(filters, filter);
    });

    var nextState = this.state
      .set("filters", filters)
      .set("active", Immutable.fromJS(filterList))
      .set("logs", LogStore.getLogs.apply(LogStore, filterList));

    this.replaceState(nextState);
  },

  render() {
    var logs = this.state.get("logs").map(this._renderLog).toJS();

    if (this.state.get("logs").size === 0) {
      return (
        <CollapsiblePanel heading="Logger">
          <h2>Events to and from the app will appear in this panel.</h2>
        </CollapsiblePanel>
      );
    }

    return (
      <CollapsiblePanel heading="Logger">
        <PanelToolbar>
          <div className="panel-toolbar-actions">
            <FilterList filters={this.state.get("filters").toJS()}
              active={this.state.get("active").toJS()}
              onFilterChange={this.onFilterChange} />

            <span className="label label-danger clear-logger pull-right" onClick={this.clear}>
              Clear
            </span>
          </div>
        </PanelToolbar>

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
