"use strict";

var React = require("react");
var MessageStore = require("../stores/message_store");
var safeJSONParse = require("../lib/safe_json_parse");

var AppIframe = React.createClass({
  componentDidMount() {
    MessageStore.addChangeListener(this._onMessageChange);
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
  },

  componentWillUpdate() {
    var iframe = this.getDOMNode();
    if (iframe) {
      //Ensure src is changed so that a reload on the same url will work
      iframe.src = "about:blank";
      iframe.src = this.props.src;
    }
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.status !== "ready";
  },

  _onMessageChange(event) {
    var payload = {
      type:(event.get("namespace") + "." + event.get("key")),
      data: safeJSONParse(event.get("value"))
    };

    var contentWindow = this.getDOMNode().contentWindow;

    if(contentWindow.postMessage) {
      contentWindow.postMessage({
        type: "trigger",
        payload: payload
      }, "*");
    }
  },

  render() {
    if (this.props.status === "timeout") {
      return null;
    }
    return (
      <iframe className="app-iframe" src={this.props.src}></iframe>
    );
  }
});

module.exports = AppIframe;
