"use strict";

var React = require("react");
var AppPanel = require("./app_panel");
var VerticalPanelBlock = require("./vertical_panel_block");
var AppConfigurator = require("./app_configurator");
var AppActions = require("../actions/app_actions");
var MessageGenerator = require("./message_generator");
var Constants = require("../constants/app_constants");
var HistoryTypes = Constants.History;
var History = require("./history");

var App = React.createClass({
  triggerAppHistory(historyItem) {
    AppActions.receiveAppConfiguration(historyItem);
  },
  triggerMessageGeneratorHistory(historyItem) {
    AppActions.receiveGeneratedMessage(historyItem.delete("name"));
  },
  render() {
    return (
      <div className="main-container">
        <div className="panel-container">
          <VerticalPanelBlock>
            <AppConfigurator />
            <MessageGenerator />
          </VerticalPanelBlock>
          <AppPanel />
          <VerticalPanelBlock>
            <History heading="App Configuration History" historyKey={HistoryTypes.APPS} onClick={this.triggerAppHistory} />
            <History heading="Message History History" historyKey={HistoryTypes.MESSAGES} onClick={this.triggerMessageGeneratorHistory} />
          </VerticalPanelBlock>
        </div>
      </div>
    );
  }
});

module.exports = App;
