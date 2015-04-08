"use strict";

var React = require("react");
var Immutable = require("immutable");
var AppActions = require("../actions/app_actions");
var MenuStore = require("../stores/menu_store");
var CollapsiblePanel = require("./lib/collapsible_panel");

var menuItems = Immutable.fromJS([
  {
    name: "Reload",
    icon: "refresh",
    action: AppActions.receiveAppConfiguration
  }
]);

var defaultIcon = "circle-o";
var noop = () => {};

var getState = () => {
  return {
    items: MenuStore.getItems()
  };
};

var MenuPanel = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    MenuStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    MenuStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  triggerItem(cb, event) {
    event.preventDefault();
    cb();
  },

  render() {
    var items = menuItems.concat(this.state.items).map((item) => {
      return (
        <a className="list-group-item"
          href="#"
          onClick={this.triggerItem.bind(this, item.get("action") || noop)}
        >
          <i className={`fa fa-${item.get("icon") || defaultIcon} fa-fw`} />{item.get("name")}
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
