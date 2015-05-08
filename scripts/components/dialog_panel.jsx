"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var DialogStore = require("../stores/dialog_store");
var EmptyPanel = require("./empty_panel");
var DialogProjections = require("../projections/dialog_projections");
var DialogActions = require("../actions/dialog_actions");
var PanelToolbar = require("./lib/panel_toolbar");

var getState = () => {
  return {
    dialog: DialogStore.getDialog()
  };
};

var triggerAction = (title) => {
  DialogActions.dialogInteraction({title: title});
};

var clear = () => {
  DialogActions.clearDialog();
};

var buttonClass = {
  "ok": "btn-primary",
  "cancel": "btn-primary-inverse",
  "info": "btn-info",
  "danger": "btn-danger",
  "default": "btn-default"
};

var buttonStyles = (type) => {
  return `btn ${buttonClass[type]}`;
};

var renderButtons = (buttons) => {
  return buttons.map((item, index) => {
    return (
      <a key={index} className={buttonStyles(item.get('type'))}
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
        <PanelToolbar>
          <div className="panel-toolbar-actions">
            <span className="label label-danger clear-flash pull-right" onClick={clear}>
              Clear
            </span>
          </div>
        </PanelToolbar>

        <div className="panel panel-default panel-message dialog-message">
          <div className="panel-body">
            <h3><strong>{dialog.get("title")}</strong></h3>
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
