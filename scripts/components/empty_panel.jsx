"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");

var EmptyPanel = React.createClass({
  propTypes: {
    header: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <CollapsiblePanel heading={this.props.header}>
        <h4 className="help-message">{this.props.message}</h4>
      </CollapsiblePanel>
    );
  }
});

module.exports = EmptyPanel;
