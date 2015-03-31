"use strict";

var React = require("react");
var PanelToolbar = require("./panel_toolbar");

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

  toolbarIndex(children) {
    var toolbar = children.filter((child) => {
      return child.type === PanelToolbar.type;
    })[0];
    return toolbar ? children.indexOf(toolbar) : -1;
  },

  renderableChildren(children) {
    var toolbarIndex = this.toolbarIndex(children);
    return children.filter((child, index) => {
      return index !== toolbarIndex;
    });
  },

  renderToolbar(children, target, bodyClass) {
    var toolbarIndex = this.toolbarIndex(children);
    if (toolbarIndex >= 0) {
      return (
        <div id={target} className={"panel-toolbar-container " + bodyClass}>
          {children[toolbarIndex]}
        </div>
      );
    }
    return null;
  },

  childrenList(children) {
    return Array.isArray(children) ? children : [children];
  },

  render() {
    var elements = this.childrenList(this.props.children);
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
        {this.renderToolbar(elements, this.props.target, bodyClass)}
        <div id={this.props.target} className={"panel-body-container " + bodyClass}>
          <div className="panel-body">
            {this.renderableChildren(elements)}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CollapsiblePanel;
