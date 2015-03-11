"use strict";

var React = require("react");

var InputGroupHorizontal = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired
  },
  render() {
    return (
      <div className="form-group">
        <label className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = InputGroupHorizontal;
