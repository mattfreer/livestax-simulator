"use strict";

var Immutable = require("immutable");

var Validator = {
  required(field) {
    if (!field || field === "") {
      return "Can't be blank";
    }
  },

  numeric(field) {
    if (typeof field !== "number") {
      return "Must be a number";
    }
  },

  validate(state, validations) {
    return Immutable.fromJS(validations).map((rules, field) => {
      return rules
      .toSet()
      .reduce((acc, rule) => {
        return acc.push(rule(state.get(field)));
      }, Immutable.List())
      .filter(error => error && error !== "");
    });
  }
};

module.exports = Validator;
