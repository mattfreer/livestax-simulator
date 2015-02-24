"use strict";

var React = require("react");

var VerticalPanelBlock = React.createClass({
  render() {
    return (
      <div className="vertical-panels-container">
        {this.props.children}
      </div>
    );
  }
});

module.exports = VerticalPanelBlock;
