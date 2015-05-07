"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var DialogStore = require("../stores/dialog_store");
var EmptyPanel = require("./empty_panel");
var DialogProjections = require("../projections/dialog_projections");
var DialogActions = require("../actions/dialog_actions");

var getState = () => {
  return {
    dialog: DialogStore.getDialog()
  };
};

var triggerAction = (title) => {
  DialogActions.dialogInteraction({title: title});
};

var renderButtons = (buttons) => {
  return buttons.map((item, index) => {
    return (
      <a key={index} className="btn btn-default"
        onClick={triggerAction.bind(this, item.get("title"))}>
        {item.get("title")}
      </a>
    );
  }).toJS();
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
        <EmptyPanel header="Dialog"
          message="Dialog messages from the app will appear in this panel." />
      );
    }

    var buttons = dialog.get("buttons");

    return (
      <CollapsiblePanel heading="Dialog">
        <div className="panel panel-default panel-message dialog-message">
          <div className="panel-body">
            <div>{dialog.get("title")}</div>
            <div>{dialog.get("message")}</div>
          </div>

          <div className="panel-footer" style={{background: "white"}}>
            <div className="btn-group btn-group-justified">
              {renderButtons(DialogProjections.orderedButtons(buttons))}
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = DialogPanel;
