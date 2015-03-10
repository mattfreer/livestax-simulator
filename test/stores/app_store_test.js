"use strict";

require("../test_helper");

var Immutable = require("immutable");
var AppStore = require("../../scripts/stores/app_store");
var AppActions = require("../../scripts/actions/app_actions");
var Constants = require("../../scripts/constants/app_constants");

describe("AppStore", () => {
  var clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    AppStore.reset();
  });

  afterEach(() => {
    clock.restore();
  });

  describe("getApp()", () => {
    it("has a default status of loading", () => {
      expect(AppStore.getApp().getIn(["status"])).to.equal("loading");
    });

    describe("when a ready mesage is received", () => {
      it("updates the status to ready", () => {
        AppActions.receivePostMessage({ type: "ready" });
        expect(AppStore.getApp().getIn(["status"])).to.equal("ready");
      });
    });

    describe("when a ready mesage is not received", () => {
      it("updates the status to timeout", () => {
        clock.tick(Constants.Timer.DURATION);
        expect(AppStore.getApp().getIn(["status"])).to.equal("timeout");
      });
    });
  });

  describe("when app configuration is recieved", () => {
    beforeEach(() => {
      AppActions.receiveAppConfiguration(Immutable.fromJS({
        name: "App name",
        namespace: "app-name",
        url: "http://appname.com"
      }));
    });

    it("updates the app state", () => {
      expect(AppStore.getApp().getIn(["app", "name"])).to.equal("App name");
      expect(AppStore.getApp().getIn(["app", "namespace"])).to.equal("app-name");
      expect(AppStore.getApp().getIn(["app", "url"])).to.equal("http://appname.com");
    });

    it("updates the status to loading", () => {
      expect(AppStore.getApp().getIn(["status"])).to.equal("loading");
    });
  });

  describe("when signed request is recieved", () => {
    beforeEach(() => {
      AppActions.receiveSignedRequest(Immutable.fromJS({
        use_post: true,
        secret_key: "new_secret",
        payload: {
          instance_id: "abcdef",
          timestamp: "1234",
          is_admin: false,
          is_guest: true,
          user_id: "aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa"
        }
      }));
    });

    it("updates the post_data state", () => {
      expect(AppStore.getApp().getIn(["post_data", "use_post"])).to.equal(true);
      expect(AppStore.getApp().getIn(["post_data", "secret_key"])).to.equal("new_secret");
      expect(AppStore.getApp().getIn(["post_data", "payload", "timestamp"])).to.equal("1234");
    });

    it("updates the status to loading", () => {
      expect(AppStore.getApp().getIn(["status"])).to.equal("loading");
    });
  });
});
