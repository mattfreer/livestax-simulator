"use strict";

var React = require("react");
var AppPanel = require("./app_panel");
var VerticalPanelBlock = require("./vertical_panel_block");
var AppConfigurator = require("./app_configurator");
var StorePanel = require("./store_panel");
var Logger = require("./logger");
var AppActions = require("../actions/app_actions");
var MessageGenerator = require("./message_generator");
var Constants = require("../constants/app_constants");
var HistoryTypes = Constants.History;
var History = require("./history");
var FlashMessage = require("./flash_message");
var MenuPanel = require("./menu_panel");
var DialogPanel = require("./dialog_panel");
var Immutable = require("immutable");

var cleanHistoryItem = (item) => {
  item = item.delete("createdAt");
  return item.delete("historyType");
};

var historyActions = Immutable.Map()
  .set(HistoryTypes.APPS, AppActions.receiveAppConfiguration)
  .set(HistoryTypes.MESSAGES, AppActions.receiveGeneratedMessage);

var App = React.createClass({
  triggerHistory(historyItem) {
    var action = historyActions.get(historyItem.get("historyType"));
    action(cleanHistoryItem(historyItem));
  },

  render() {
    return (
      <div className="main-container">
        <div className="panel-container">
          <VerticalPanelBlock>
            <AppConfigurator />
            <MessageGenerator />
            <MenuPanel />
          </VerticalPanelBlock>
          <AppPanel />
          <VerticalPanelBlock>
            <StorePanel />
            <History heading="History" onClick={this.triggerHistory} />
            <FlashMessage heading="Flash Message"/>
            <DialogPanel/>
          </VerticalPanelBlock>
        </div>
        <Logger />
      </div>
    );
  }
});

module.exports = App;
