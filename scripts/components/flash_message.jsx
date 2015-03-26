"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var FlashMessageStore = require("../stores/flash_message_store");

var getState = () => {
  return FlashMessageStore.getFlash();
};

var FlashMessage = React.createClass({
  getInitialState: getState(),

  componentDidMount() {
    FlashMessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    FlashMessageStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(FlashMessageStore.getFlash());
  },

  render() {
    if(this.state === null) {
      return (
        <CollapsiblePanel heading={this.props.heading}>
          <h4 className="help-message">Flash messages from the app will appear in this panel.</h4>
        </CollapsiblePanel>
      );
    }

    var panelClasses = `panel panel-${this.state.get("type")} flash-message`;

    return (
      <CollapsiblePanel heading={this.props.heading}>
        <div className={panelClasses}>
          <div className="panel-body">
            {this.state.get("message")}
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = FlashMessage;
