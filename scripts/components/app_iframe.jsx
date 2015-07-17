"use strict";

var React = require("react");
var SignedRequestApp = require("./signed_request_app");
var MessageStore = require("../stores/message_store");
var KeyValueStore = require("../stores/key_value_store");
var FlashMessageStore = require("../stores/flash_message_store");
var MenuStore = require("../stores/menu_store");
var DialogStore = require("../stores/dialog_store");
var AuthenticateStore = require("../stores/authenticate_store");
var Projections = require("../projections/app_projections");
var Immutable = require("immutable");

var AppIframe = React.createClass({
  propTypes:{
    src: React.PropTypes.string.isRequired,
    usePost: React.PropTypes.bool.isRequired,
    postData: React.PropTypes.object
  },

  componentDidMount() {
    MessageStore.addChangeListener(this._onMessageChange);
    KeyValueStore.addChangeListener(this._onKeyValueChange);
    FlashMessageStore.addChangeListener(this._onFlashMessageChange);
    MenuStore.addChangeListener(this._onMenuChange);
    DialogStore.addChangeListener(this._onDialogChange);
    AuthenticateStore.addChangeListener(this._onAuthenticateChange);
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
    KeyValueStore.removeChangeListener(this._onKeyValueChange);
    FlashMessageStore.removeChangeListener(this._onFlashMessageChange);
    MenuStore.removeChangeListener(this._onMenuChange);
    DialogStore.removeChangeListener(this._onDialogChange);
    AuthenticateStore.removeChangeListener(this._onAuthenticateChange);
  },

  componentWillUpdate() {
    if (!this.getDOMNode()) {
      return;
    }
    var iframe = this.getDOMNode().querySelector("iframe");
    if (iframe) {
      //Ensure src is changed so that a reload on the same url will work
      iframe.src = "about:blank";
      iframe.src = this.props.src;
    }
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.status !== "ready";
  },

  _postMessage(payload) {
    if (!this.getDOMNode()) {
      return;
    }

    var contentWindow = this.getDOMNode().querySelector("iframe").contentWindow;

    if(contentWindow.postMessage) {
      contentWindow.postMessage(payload.toJS(), "*");
    }
  },

  _onKeyValueChange(event) {
    if (!event) {
      return;
    }
    this._postMessage(Projections.storePayload(event));
  },

  _onMessageChange(event) {
    this._postMessage(Projections.generatorPayload(event));
  },

  _onFlashMessageChange(interaction) {
    if(!interaction) {
      return;
    }

    var payload = Immutable.Map({
      type: "flash",
      payload: {
        type: interaction
      }
    });
    this._postMessage(payload);
  },

  _onMenuChange(name) {
    if(!name) {
      return;
    }

    var payload = Immutable.Map({
      type: "menu",
      payload: {
        type: name
      }
    });
    this._postMessage(payload);
  },

  _onDialogChange(interaction) {
    if(!interaction) {
      return;
    }

    var payload = Immutable.Map({
      type: "dialog",
      payload: {
        type: "action",
        data: interaction.title
      }
    });
    this._postMessage(payload);
  },

  _onAuthenticateChange(e) {
    if(e && e.type === "response") {
      var payload = Immutable.Map({
        type: "authenticate",
        payload: {
          type: "respond",
          data: e.data
        }
      });
      this._postMessage(payload);
      }
  },

  render() {
    if (this.props.status === "timeout") {
      return null;
    }
    if (this.props.usePost) {
      return (
        <SignedRequestApp {...this.props} />
      );
    } else {
      return (
        <div className="app-container">
          <iframe className="app-iframe" src={this.props.src}></iframe>
        </div>
      );
    }
  }
});

module.exports = AppIframe;
