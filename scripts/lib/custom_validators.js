"use strict";

var CustomValidators = {
  namespace(field) {
    if (!field.match(/^[a-z0-9\-]+$/)) {
      return "Must only contain lowercase letters, numbers and dashes";
    }
  },

  namespaceKey(field) {
    if (!field.match(/^[a-z0-9\-]+\.[a-zA-Z0-9\-\_]+$/)) {
      return "Must contain a namespace and key which only contain letters, numbers and dashes";
    }
  }
};

module.exports = CustomValidators;
