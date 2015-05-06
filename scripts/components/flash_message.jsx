"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var FlashMessageStore = require("../stores/flash_message_store");
var FlashActions = require("../actions/flash_actions");
var PanelToolbar = require("./lib/panel_toolbar");
var EmptyPanel = require("./empty_panel");

var getState = () => {
  return {
    flash: FlashMessageStore.getFlash()
  };
};

var FlashMessage = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    FlashMessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    FlashMessageStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  triggerAction(type) {
    FlashActions.flashInteraction({type: type});
  },

  clear() {
    FlashActions.clearFlash();
  },

  renderButtons(callbacks) {
    return ["ignore", "dismiss", "confirm"]
      .map((item, index) => {
        var disabled = callbacks.indexOf(item) === -1;
        var btnClass = "btn btn-default";
        if (disabled) {
          btnClass += " disabled";
        } else {
          btnClass += " btn-primary-inverse";
        }
        return (
          <a key={index}
            className={btnClass}
            onClick={this.triggerAction.bind(this, item)}>

            {item}
          </a>
        );
      });
  },

  render() {
    var flash = this.state.flash;

    if(flash === null) {
      return (
        <EmptyPanel header={this.props.heading}
          message="Flash messages from the app will appear in this panel." />
      );
    }

    var panelHeaderClasses = `flash-header flash-header-${flash.get("type")}`;
    var callbacks = flash.get("callbacks") || ["ignore", "dismiss", "confirm"];

    return (
      <CollapsiblePanel heading={this.props.heading}>
        <PanelToolbar>
          <div className="panel-toolbar-actions">
            <span className="label label-danger clear-flash pull-right" onClick={this.clear}>
              Clear
            </span>
          </div>
        </PanelToolbar>
        <div className={panelHeaderClasses}></div>
        <div className="panel panel-default panel-message flash-message">
          <div className="panel-body">
            {flash.get("message")}
          </div>

          <div className="panel-footer" style={{background: "white"}}>
            <div className="btn-group btn-group-justified">
              {this.renderButtons(callbacks)}
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = FlashMessage;
