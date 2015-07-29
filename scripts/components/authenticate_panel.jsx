"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var AuthenticateStore = require("../stores/authenticate_store");
var AuthenticateActions = require("../actions/authenticate_actions");
var EmptyPanel = require("./empty_panel");
var PanelToolbar = require("./lib/panel_toolbar");

var getState = () => {
  return {
    authRequest: AuthenticateStore.getAuthRequest()
  };
};

var openAuthPage = (url) => {
  AuthenticateActions.openWindow(url);
};

var AuthenticatePanel = React.createClass({
  getInitialState: getState,

  componentDidMount() {
    AuthenticateStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    AuthenticateStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.replaceState(getState());
  },

  clear() {
    AuthenticateActions.clearRequest();
  },

  render() {
    var authRequest = this.state.authRequest;

    if(authRequest === null) {
      return (
        <EmptyPanel header="Authentication"
          message="Authenticate messages from the app will appear in this panel." />
      );
    }

    return (
      <CollapsiblePanel heading="Authentication">
        <PanelToolbar>
          <div className="panel-toolbar-actions">
            <span className="label label-danger clear-auth pull-right" onClick={this.clear}>
              Clear
            </span>
          </div>
        </PanelToolbar>
        <div className="panel panel-default panel-message dialog-message">
          <div className="panel-body">
            <h3><strong>Login with {authRequest.get("provider")}</strong></h3>
          </div>

          <div className="panel-footer" style={{background: "white"}}>
            <div className="btn-group btn-group-justified">
              <a className="btn btn-primary-inverse cancel-btn"
                onClick={this.clear}>
                Cancel
              </a>
              <a className="btn btn-primary auth-btn"
                onClick={openAuthPage.bind(this, authRequest.get("url"))}>
                Authenticate
              </a>
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = AuthenticatePanel;
