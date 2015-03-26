"use strict";

var React = require("react");

var PanelToolbar = React.createClass({
  render() {
    return (
      <div className="panel-toolbar">
        {this.props.children}
      </div>
    );
  }
});

module.exports = PanelToolbar;
