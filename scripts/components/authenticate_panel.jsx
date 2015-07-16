"use strict";

var React = require("react");
var CollapsiblePanel = require("./lib/collapsible_panel");
var AuthenticateStore = require("../stores/authenticate_store");
var EmptyPanel = require("./empty_panel");

var getState = () => {
  return {
    authRequest: AuthenticateStore.getAuthRequest()
  };
};

const AuthenticatePanel = React.createClass({
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
        <div className="panel panel-default panel-message dialog-message">
          <div className="panel-body">
            <h3><strong>Login with {authRequest.get("provider")}</strong></h3>
          </div>
        </div>
      </CollapsiblePanel>
    );
  }
});

module.exports = AuthenticatePanel;
