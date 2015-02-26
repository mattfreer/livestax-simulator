"use strict";

var React = require("react");

var AppBlocker = React.createClass({
  propTypes: {
    status: React.PropTypes.oneOf(["loading", "ready"])
  },
  render() {
    if (this.props.status === "ready") {
      return null;
    }
    return (
      <div className="app-blocker">
        <h2>Loading</h2>
      </div>
    );
  }
});

module.exports = AppBlocker;
