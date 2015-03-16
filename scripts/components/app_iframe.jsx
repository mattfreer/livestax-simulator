"use strict";

var React = require("react");
var SignedRequestApp = require("./signed_request_app");
var MessageStore = require("../stores/message_store");
var KeyValueStore = require("../stores/key_value_store");
var safeJSONParse = require("../lib/safe_json_parse");

var AppIframe = React.createClass({
  componentDidMount() {
    MessageStore.addChangeListener(this._onMessageChange);
    KeyValueStore.addChangeListener(this._onKeyValueChange);
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
    KeyValueStore.removeChangeListener(this._onKeyValueChange);
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

  _postMessage(type, payload) {
    if (!this.getDOMNode()) {
      return;
    }

    var contentWindow = this.getDOMNode().querySelector("iframe").contentWindow;

    if(contentWindow.postMessage) {
      contentWindow.postMessage({
        type: type,
        payload: payload
      }, "*");
    }
  },

  _onKeyValueChange(event) {
    if (!event) {
      return;
    }
    this._postMessage("store", event);
  },

  _onMessageChange(event) {
    var payload = {
      type:(event.get("namespace") + "." + event.get("key")),
      data: safeJSONParse(event.get("value"))
    };
    this._postMessage("trigger", payload);
  },

  render() {
    if (this.props.status === "timeout") {
      return null;
    }
    if (this.props.postData.get("use_post")) {
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
