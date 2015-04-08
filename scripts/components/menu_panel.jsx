"use strict";

var React = require("react");
var Immutable = require("immutable");
var AppActions = require("../actions/app_actions");
var CollapsiblePanel = require("./lib/collapsible_panel");

var menuItems = Immutable.fromJS([
  {
    name: "Reload",
    icon: "refresh",
    action: AppActions.receiveAppConfiguration
  }
]);

var MenuPanel = React.createClass({
  triggerItem(cb, event) {
    event.preventDefault();
    cb();
  },

  render() {
    var items = menuItems.map((item) => {
      return (
        <a className="list-group-item"
          href="#"
          onClick={this.triggerItem.bind(this, item.get("action"))}
        >
          <i className={`fa fa-${item.get("icon")} fa-fw`} />{item.get("name")}
        </a>
      );
    }).toJS();
    return (
      <CollapsiblePanel heading="Menu">
        <div className="list-group">
          {items}
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = MenuPanel;
