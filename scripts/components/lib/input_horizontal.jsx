"use strict";

var React = require("react");

var InputHorizontal = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  defaultProps: {
    value: null,
    onChange: null
  },
  render() {
    var formClass = "form-group";
    var error = null;
    if (this.props.error) {
      formClass += " has-error";
      error = (<span className="help-block">{this.props.error}</span>);
    }
    return (
      <div className={formClass}>
        <label htmlFor={this.props.name} className="col-lg-2 control-label">{this.props.label}</label>
        <div className="col-lg-10">
          <input type="text" name={this.props.name} className="form-control" placeholder={this.props.label} value={this.props.value} onChange={this.props.onChange} />
          {error}
        </div>
      </div>
    );
  }
});

module.exports = InputHorizontal;
