"use strict";

var CustomValidators = {
  namespace(field) {
    if (!field.match(/^[a-z0-9\-]+$/)) {
      return "Must only contain lowercase letters, numbers and dashes";
    }
  }
};

module.exports = CustomValidators;
