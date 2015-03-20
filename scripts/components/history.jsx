"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var HistoryStore = require("../stores/history_store");
var HistoryActions = require("../actions/history_actions");
var Constants = require("../constants/app_constants");
var HistoryTypes = Constants.History;
var Moment = require("moment");
var Immutable = require("immutable");

var timestampToDateString = (timestamp) => {
  return Moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
};

var historyIcons = Immutable.Map()
  .set(HistoryTypes.APPS, "cog")
  .set(HistoryTypes.MESSAGES, "volume-off");

var historyFilters = Immutable.Map()
  .set("all", "All")
  .set(HistoryTypes.APPS, "App config")
  .set(HistoryTypes.MESSAGES, "Messages");

var History = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    historyKey: React.PropTypes.string
  },

  getInitialState() {
    return Immutable.fromJS({
      filter: this.props.historyKey,
      historyItems: HistoryStore.getHistory(this.props.historyKey)
    });
  },

  componentDidMount() {
    HistoryStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    HistoryStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(this.state.set("historyItems",
      HistoryStore.getHistory(this.state.get("filter"))
    ));
  },

  triggerHistoryClick(historyItem) {
    this.props.onClick(historyItem);
  },

  deleteHistoryItem(key, historyItem) {
    HistoryActions.deleteHistoryItem(key, historyItem);
  },

  getHistoryType(item) {
    if(item.has("historyType")) {
      return item.get("historyType");
    }
    return this.props.historyKey;
  },

  applyFilter(item) {
    var filter = item === "all" ? undefined : item;

    var nextState = this.state
      .set("filter", filter)
      .set("historyItems", HistoryStore.getHistory(filter));

    this.replaceState(nextState);
  },

  render() {
    var icon;
    var history = this.state.get("historyItems").map((historyItem, i) => {
      icon = `fa fa-${historyIcons.get(this.getHistoryType(historyItem))} text-muted`;

      return (
        <tr key={historyItem}>
          <td onClick={this.triggerHistoryClick.bind(this, historyItem)}><i className={icon}></i></td>
          <td className="item-content" onClick={this.triggerHistoryClick.bind(this, historyItem)}>
            <span className="timestamp text-muted">{timestampToDateString(historyItem.get("createdAt"))}</span>
            {historyItem.get("name")}
          </td>

          <td className="delete-item" onClick={this.deleteHistoryItem.bind(this, historyItem.get("historyType"), historyItem)}>
            <i className="fa fa-times text-muted"></i>
          </td>
        </tr>
      );
    }).toJS();

    var filterList = HistoryStore.getHistoryTypes()
      .unshift("all")
      .map((item) => {
        var itemCssClass = "label label-default";

        if(item === this.state.get("filter") || item === "all" && !this.state.get("filter")) {
          itemCssClass = "label label-primary";
        }

        return <span
          onClick={this.applyFilter.bind(this, item)}
          key={item}
          className={itemCssClass}>
          {historyFilters.get(item)}
        </span>
      }).toJS();

    return (
      <CollapsiblePanel heading={this.props.heading}>
        <div className="history-filter">
          {filterList}
        </div>
        <table className="table table-condensed table-hover history-table">
          <tbody>
            {history}
          </tbody>
        </table>
      </CollapsiblePanel>
    );
  }
});

module.exports = History;
