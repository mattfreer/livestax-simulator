"use strict";

require("../test_helper");
var CustomValidators = require("../../scripts/lib/custom_validators");

describe("CustomValidators", () => {
  var error = "Must only contain lowercase letters, numbers and dashes";
  describe("namespace", () => {
    it("returns undefined when valid", function() {
      var namespace = "valid-namespace";
      expect(CustomValidators.namespace(namespace)).to.eql(undefined);
    });

    it("errors for other invalid cases", function() {
      var namespaces = [
        "invalid namespace",
        "invalid-namespacE",
        "namespace@"
      ];
      namespaces.forEach(namespace => {
        expect(CustomValidators.namespace(namespace), namespace).to.eql(error);
      });
    });
  });
});
