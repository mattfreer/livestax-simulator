"use strict";

var React = require("react");

var AppPanel = React.createClass({
  render() {
    return (
      <div className="app-panel-container panel panel-default">
        <div className="panel-heading">App</div>
        <iframe className="app-iframe" src="examples/app.html"></iframe>
      </div>
    );
  }
});

module.exports = AppPanel;
