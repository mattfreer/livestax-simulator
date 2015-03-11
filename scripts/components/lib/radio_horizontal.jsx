"use strict";

var React = require("react");

var Radio = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    text: React.PropTypes.string,
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },
  render() {
    var {name, value, text, checked, onChange, ...rest} = this.props;
    return (
      <div className="radio">
        <label>
          <input type="radio" name={name} value={value} checked={checked} onChange={onChange} {...rest} />
          {text}
        </label>
      </div>
    );
  }
});

module.exports = Radio;
