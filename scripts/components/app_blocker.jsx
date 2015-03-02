"use strict";

var React = require("react");
var Notice = require("./lib/notice");

var messages = {
  "loading": "",
  "timeout": "The loading of the app has timed-out",
};

var types = {
  "loading": "info",
  "timeout": "warning",
};

var icons = {
  "loading": "fa fa-flag",
  "timeout": "fa fa-exclamation-triangle"
};

var AppBlocker = React.createClass({
  propTypes: {
    status: React.PropTypes.oneOf(["loading", "ready", "timeout"])
  },

  render() {
    if (this.props.status === "ready") {
      return null;
    }

    return (
      <div className="app-blocker">
        <Notice type={types[this.props.status]}
          icon={icons[this.props.status]}>
          <h2 className={`text-${types[this.props.status]}`}>
            <strong>{this.props.status}</strong>
          </h2>
          <p>{messages[this.props.status]}</p>
        </Notice>
      </div>
    );
  }
});

module.exports = AppBlocker;
