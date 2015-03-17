"use strict";

require("../test_helper");

var Immutable = require("immutable");
var AppStore = require("../../scripts/stores/app_store");
var State = require("../../scripts/stores/state");
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
    describe("when use_post is false", () => {
      beforeEach(() => {
        AppActions.receiveAppConfiguration(Immutable.fromJS({
          app: {
            name: "App name",
            namespace: "app-name",
            url: "http://appname.com",
            use_post: false
          }
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

      it("populates post_data with default values", () => {
        expect(AppStore.getApp().get("post_data")).to.eql(State.initial().get("post_data"));
      });
    });

    describe("when use_post is true", () => {
      beforeEach(() => {
        AppActions.receiveAppConfiguration(Immutable.fromJS({
          app: {
            name: "App name",
            namespace: "app-name",
            url: "http://appname.com",
            use_post: true
          },
          post_data: {
            secret_key: "a_secret_key",
            payload: {
              instance_id: "an_instance_id",
              timestamp: 0,
              user_id: "a_user_id",
              is_admin: false,
              is_guest: true,
            }
          }
        }));
      });

      it("doesn't populates post_data with default values", () => {
        expect(AppStore.getApp().get("post_data")).to.eql(Immutable.fromJS({
          secret_key: "a_secret_key",
          payload: {
            instance_id: "an_instance_id",
            timestamp: 0,
            user_id: "a_user_id",
            is_admin: false,
            is_guest: true,
          }
        }));
      });
    });
  });
});
