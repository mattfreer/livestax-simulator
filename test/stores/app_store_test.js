"use strict";

require("../test_helper");

var AppStore = require("../../scripts/stores/app_store");
var AppActions = require("../../scripts/actions/app_actions");

describe("AppStore", () => {
  beforeEach(() => {
    AppStore.reset();
  });

  describe("getApp()", () => {
    it("has a default status of loading", () => {
      expect(AppStore.getApp()).to.eql({ status: "loading" });
    });

    it("updates the status when it receives a ready message", function() {
      AppActions.receivePostMessage({ type: "ready" });
      expect(AppStore.getApp()).to.eql({ status: "ready" });
    });
  });
});
