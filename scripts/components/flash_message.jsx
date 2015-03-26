"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var FlashMessageStore = require("../stores/flash_message_store");

var FlashMessage = React.createClass({
  render() {
    return (
      <CollapsiblePanel heading={this.props.heading}>
      </CollapsiblePanel>
    );
  }
});

module.exports = FlashMessage;
