"use strict";

var React = require("react");
var Immutable = require("immutable");
var AppActions = require("../actions/app_actions");
var MenuStore = require("../stores/menu_store");
var MenuActions = require("../actions/menu_actions");
var CollapsiblePanel = require("./lib/collapsible_panel");

var menuItems = Immutable.fromJS([
  {
    name: "Reload",
    icon: "refresh",
    action: AppActions.receiveAppConfiguration
  }
]);

var defaultIcon = "circle-o";

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

  triggerCustomAction(name) {
    MenuActions.menuInteraction(name);
  },

  triggerItem(cb, event) {
    event.preventDefault();
    cb();
  },

  render() {
    var items = menuItems.concat(this.state.items).map((item, index) => {
      var defaultAction = this.triggerCustomAction.bind(this, item.get("name"));
      return (
        <tr key={index} className="menu-item" onClick={this.triggerItem.bind(this, item.get("action") || defaultAction)}>
          <td><i className={`fa fa-${item.get("icon") || defaultIcon} fa-fw`} /></td>
          <td className="item-content">
            {item.get("name")}
          </td>
        </tr>
      );
    }).toJS();
    return (
      <CollapsiblePanel heading="Menu">
        <table className="table table-condensed table-hover menu-table">
          <tbody>
            {items}
          </tbody>
        </table>
      </CollapsiblePanel>
    );
  }
});

module.exports = MenuPanel;
