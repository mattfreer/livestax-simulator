"use strict";

var React = require("react");
var SignedRequestApp = require("./signed_request_app");
var MessageStore = require("../stores/message_store");
var KeyValueStore = require("../stores/key_value_store");
var FlashMessageStore = require("../stores/flash_message_store");
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
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
    KeyValueStore.removeChangeListener(this._onKeyValueChange);
    FlashMessageStore.removeChangeListener(this._onFlashMessageChange);
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

  _onFlashMessageChange(event) {
    var interaction = FlashMessageStore.getInteraction();

    if(interaction) {
      var payload = Immutable.Map({
        type: "flash",
        payload: {
          type: interaction
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
