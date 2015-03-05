"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var HistoryStore = require("../stores/history_store");
var HistoryActions = require("../actions/history_actions");
var Moment = require("moment");

var timestampToDateString = (timestamp) => {
  return Moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
};

var History = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    historyKey: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return HistoryStore.getHistory(this.props.historyKey);
  },
  componentDidMount() {
    HistoryStore.addChangeListener(this._onChange);
  },
  componentWillUnmount() {
    HistoryStore.removeChangeListener(this._onChange);
  },
  _onChange() {
    this.replaceState(HistoryStore.getHistory(this.props.historyKey));
  },
  triggerHistoryClick(historyItem) {
    this.props.onClick(historyItem);
  },
  deleteHistoryItem(key, index) {
    HistoryActions.deleteHistoryItem(key, index);
  },
  render() {
    var history = this.state.map((historyItem, i) => {

      return (
        <tr key={historyItem}>
          <td className="item-content" onClick={this.triggerHistoryClick.bind(this, historyItem)}>
            <span className="timestamp text-muted">{timestampToDateString(historyItem.get("createdAt"))}</span>
            {historyItem.get("name")}
          </td>

          <td className="delete-item" onClick={this.deleteHistoryItem.bind(this, this.props.historyKey, i)}>
            <i className="fa fa-times text-muted"></i>
          </td>
        </tr>
      );
    }).toJS();

    return (
      <CollapsiblePanel heading={this.props.heading}>
        <table className="table table-bordered table-hover history-table">
          <tbody>
            {history}
          </tbody>
        </table>
      </CollapsiblePanel>
    );
  }
});

module.exports = History;
