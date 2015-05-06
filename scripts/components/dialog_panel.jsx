"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var DialogStore = require("../stores/dialog_store");
var EmptyPanel = require("./empty_panel");

var getState = () => {
  return {
    dialog: DialogStore.getDialog()
  };
};

var DialogPanel = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    DialogStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    DialogStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  render() {
    var dialog = this.state.dialog;

    if(dialog === null) {
      return (
        <EmptyPanel header={this.props.heading}
          message="Dialog messages from the app will appear in this panel." />
      );
    }

    return (
      <CollapsiblePanel heading="Dialog">
        <div className="panel panel-default panel-message dialog-message">
          <div className="panel-body">
            <div>{dialog.get("title")}</div>
            <div>{dialog.get("message")}</div>
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = DialogPanel;
