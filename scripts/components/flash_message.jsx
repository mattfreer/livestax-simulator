"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var FlashMessageStore = require("../stores/flash_message_store");
var FlashActions = require("../actions/flash_actions");

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

  renderButtons() {
    return ["ignore", "dismiss", "confirm"]
      .map((item, index) => {
        return (
          <a key={index}
            href="#"
            className="btn btn-default btn-xs"
            onClick={this.triggerAction.bind(this, item)}>

            {item}
          </a>
        )
      });
  },

  render() {
    var flash = this.state.flash;

    if(flash === null) {
      return (
        <CollapsiblePanel heading={this.props.heading}>
          <h4 className="help-message">Flash messages from the app will appear in this panel.</h4>
        </CollapsiblePanel>
      );
    }

    var panelClasses = `panel panel-${flash.get("type")} flash-message`;

    return (
      <CollapsiblePanel heading={this.props.heading}>
        <div className={panelClasses}>
          <div className="panel-body">
            {flash.get("message")}
          </div>

          <div className="panel-footer">
            <div className="btn-group btn-group-justified">
              {this.renderButtons()}
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = FlashMessage;
