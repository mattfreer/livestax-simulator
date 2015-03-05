"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var HistoryStore = require("../stores/history_store");
var HistoryActions = require("../actions/history_actions");

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
        <li key={historyItem} className="list-group-item">
          <a onClick={this.triggerHistoryClick.bind(this, historyItem)}>{historyItem.get("name")}</a>
          <a className="pull-right" onClick={this.deleteHistoryItem.bind(this, this.props.historyKey, i)}>x</a>
        </li>);
    }).toJS();
    return (
      <CollapsiblePanel heading={this.props.heading}>
        <ul className="list-group">
          {history}
        </ul>
      </CollapsiblePanel>
    );
  }
});

module.exports = History;
