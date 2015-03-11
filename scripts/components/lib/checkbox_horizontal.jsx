"use strict";

var React = require("react");

var CheckboxHorizontal = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    text: React.PropTypes.string,
    checked: React.PropTypes.bool,
    error: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  defaultProps: {
    checked: null,
    onChange: null
  },
  render() {
    var formClass = "form-group";
    var {error, name, label, text, checked, onChange, ...rest} = this.props;
    var errorMessage = null;
    if (error) {
      formClass += " has-error";
      errorMessage = (<span className="help-block">{error}</span>);
    }

    return (
      <div className={formClass}>
        <label className="col-lg-2 control-label">
          {label}
        </label>
        <div className="col-lg-10">
          <div className="checkbox">
            <label>
              <input type="checkbox" name={name} checked={checked} onChange={onChange} {...rest} />
              {text}
            </label>
            {errorMessage}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CheckboxHorizontal;
