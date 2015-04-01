"use strict";

require("../test_helper");
var CustomValidators = require("../../scripts/lib/custom_validators");

describe("CustomValidators", () => {
  describe("namespace", () => {
    var error = "Must only contain lowercase letters, numbers and dashes";

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

  describe("namespaceKey", () => {
    var error = "Must contain a namespace and key which only contain lowercase letters, numbers and dashes";

    it("returns undefined when valid", function() {
      var namespace = "valid-namespace.valid-key";
      expect(CustomValidators.namespaceKey(namespace)).to.eql(undefined);
    });

    it("errors for other invalid cases", function() {
      var namespaces = [
        "invalid namespace",
        "invalid-namespacE",
        "namespace@",
        "valid-namespace.valid-Key",
        "valid-namespace.valid key",
        "valid-namespace.ke!"
      ];
      namespaces.forEach(namespace => {
        expect(CustomValidators.namespaceKey(namespace), namespace).to.eql(error);
      });
    });
  });
});
