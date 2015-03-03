"use strict";

var React = require("react");

var AppIframe = React.createClass({
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
