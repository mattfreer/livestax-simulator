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
    var {error, name, label, value, onChange, ...rest} = this.props;
    var errorMessage = null;
    if (error) {
      formClass += " has-error";
      errorMessage = (<span className="help-block">{error}</span>);
    }
    return (
      <div className={formClass}>
        <label htmlFor={name} className="col-lg-2 control-label">{label}</label>
        <div className="col-lg-10">
          <input type="text" name={name} className="form-control" placeholder={label} value={value} onChange={onChange} {...rest} />
          {errorMessage}
        </div>
      </div>
    );
  }
});

module.exports = InputHorizontal;
