"use strict";

var React = require("react");
var Validator = require("../lib/validator");

var ValidationForm = React.createClass({
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    validations: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onError: React.PropTypes.func.isRequired
  },

  submitForm(event) {
    event.preventDefault();
    var errors = Validator.validate(this.props.fields, this.props.validations);

    if (!Validator.hasErrors(errors)) {
      this.props.onSubmit(this.props.fields);
    } else {
      this.props.onError(errors);
    }
  },

  render() {
    return (
      <form className="form-horizontal" onSubmit={this.submitForm}>
        {this.props.children}
      </form>
    );
  }
});

module.exports = ValidationForm;
