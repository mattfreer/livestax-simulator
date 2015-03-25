"use strict";

require("../test_helper");
var Immutable = require("immutable");
var Projections = require("../../scripts/projections/app_projections");

describe("AppProjections", () => {
  describe("#generatorPayload", () => {
    it("returns a paylod expected by the app with simple values", function() {
      var state = Immutable.Map({
        namespace: "some-app",
        key: "some-key",
        value: 123
      });

      var expected = Immutable.fromJS({
        type: "trigger",
        payload: {
          type: "some-app.some-key",
          data: 123
        }
      });

      expect(Projections.generatorPayload(state)).to.eql(expected);
    });

    it("returns a paylod expected by the app with JSON values", function() {
      var state = Immutable.Map({
        namespace: "some-app",
        key: "some-key",
        value: "{\"deep\": {\"nested\": \"data\"}}"
      });

      var expected = Immutable.fromJS({
        type: "trigger",
        payload: {
          type: "some-app.some-key",
          data: {
            deep: {
              nested: "data"
            }
          }
        }
      });

      expect(Projections.generatorPayload(state)).to.eql(expected);
    });
  });

  describe("#storePayload", () => {
    it("returns a payload expected by the app", function() {
      var state = Immutable.Map({
        type: "set",
        data: {
          key: "foo",
          value: "bar"
        }
      });

      var expected = Immutable.fromJS({
        type: "store",
        payload: state
      });

      expect(Projections.storePayload(state)).to.eql(expected);
    });
  });
});
