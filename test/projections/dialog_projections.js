"use strict";

require("../test_helper");
var Immutable = require("immutable");
var Projections = require("../../scripts/projections/dialog_projections");

describe("DialogProjections", () => {
  describe("#orderedButtons", () => {
    it("returns a reordered array in expected order", function() {
      var buttons = Immutable.fromJS([
        {type: "ok"},
        {type: "danger"},
        {type: "cancel"},
        {type: "info"},
        {type: "default"},
      ]);

      var expected = Immutable.fromJS([
        {type: "cancel"},
        {type: "default"},
        {type: "info"},
        {type: "ok"},
        {type: "danger"}
      ]);

      expect(Projections.orderedButtons(buttons)).to.eql(expected);
    });
  });
});
