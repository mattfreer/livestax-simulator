"use strict";

var React = require("react");
var AppPanel = require("./app_panel");
var VerticalPanelBlock = require("./vertical_panel_block");

var App = React.createClass({
  render() {
    return (
      <div className="main-container">
        <div className="panel-container">
          <VerticalPanelBlock />
          <AppPanel />
          <VerticalPanelBlock />
        </div>
      </div>
    );
  }
});

module.exports = App;
