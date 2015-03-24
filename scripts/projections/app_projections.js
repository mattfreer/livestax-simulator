"use strict";

var Immutable = require("immutable");
var safeJSONParse = require("../lib/safe_json_parse");

class AppProjections {
  generatorPayload(state) {
    var payload = Immutable.fromJS({
      type:(state.get("namespace") + "." + state.get("key")),
      data: safeJSONParse(state.get("value"))
    });

    return Immutable.Map({
      type: "trigger",
      payload: payload
    });
  }

  storePayload(state) {
    return Immutable.Map({
      type: "store",
      payload: state
    });
  }
}

module.exports = new AppProjections();
