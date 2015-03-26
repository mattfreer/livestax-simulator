"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");

var FlashMessage = React.createClass({
  render() {
    return (
      <CollapsiblePanel heading={this.props.heading}>
      </CollapsiblePanel>
    );
  }
});

module.exports = FlashMessage;
