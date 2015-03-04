"use strict";

require("../test_helper");
var safeJSONParse = require("../../scripts/lib/safe_json_parse");

describe("safeJSONParse", () => {
  it("returns JSON when passed a valid JSON string", function() {
    var data = `
      {
        "foo": [1, 2, 3, "bar"]
      }
    `;
    var expected = {
      foo: [1,2,3, "bar"]
    };
    expect(safeJSONParse(data)).to.eql(expected);
  });

  it("returns the raw value when passed non-JSON", function() {
    expect(safeJSONParse("foobar")).to.eql("foobar");
  });
});
