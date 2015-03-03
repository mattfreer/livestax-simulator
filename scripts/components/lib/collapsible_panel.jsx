"use strict";

var React = require("react");

var CollapsiblePanel = React.createClass({
  propTypes: {
    heading: React.PropTypes.string.isRequired,
    collapsed: React.PropTypes.bool,
    type: React.PropTypes.oneOf(["default", "primary", "warning", "danger", "info", "success"])
  },

  getInitialState() {
    return { collapsed: this.props.collapsed };
  },

  toggleCollapse() {
    this.replaceState({collapsed: !this.state.collapsed});
  },

  render() {
    var type = this.props.type || "default";
    var panelClass = `panel panel-${type} panel-collapsible`;
    var headingClass = "panel-heading";
    var bodyClass = "panel-collapse";

    if (this.state.collapsed) {
      headingClass += " collapsed";
      bodyClass += " collapse";
    } else {
      panelClass += " expanded";
    }

    return (
      <div className={panelClass}>
        <div className={headingClass} onClick={this.toggleCollapse}>
          <h4 className="panel-title"><strong>{this.props.heading}</strong></h4>
        </div>
        <div id={this.props.target} className={bodyClass}>
          <div className="panel-body">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CollapsiblePanel;
