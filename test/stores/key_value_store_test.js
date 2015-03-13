"use strict";

require("../test_helper");

var Immutable = require("immutable");
var KeyValueStore = require("../../scripts/stores/key_value_store");
var AppStore = require("../../scripts/stores/app_store");
var AppActions = require("../../scripts/actions/app_actions");

var triggerStorePostMessage = (type, key, value) => {
    AppActions.receivePostMessage({
      type: "store",
      payload: {
        type: type,
        data: {
          key: key,
          value: value
        }
      }
    });
};

describe("KeyValueStore", () => {
  var callback;
  beforeEach(() => {
    AppStore.setState(["app", "namespace"], "my-test-app");
    KeyValueStore.reset();
  });

  describe("setting up listener", () => {
    beforeEach(() => {
      triggerStorePostMessage("watch", "my-test-app.customer_id");
      callback = sinon.stub();
      KeyValueStore.addChangeListener(callback);
    });

    it("triggers a listener on a change event", function() {
      triggerStorePostMessage("set", "customer_id", 5);

      expect(callback).to.have.been.calledWith({
        type: "watch",
        data: {
          key: "my-test-app.customer_id",
          value: 5
        }
      });

      triggerStorePostMessage("set", "customer_id", 12);

      expect(callback).to.have.been.calledWith({
        type: "watch",
        data: {
          key: "my-test-app.customer_id",
          value: 12
        }
      });
    });

    it("resets the watchers when the app configuration changes", function() {
      AppActions.receiveAppConfiguration(Immutable.fromJS({
        namespace: "my-test-app"
      }));

      triggerStorePostMessage("set", "customer_id", 153);
      expect(callback).to.not.have.been.called;

      triggerStorePostMessage("watch", "my-test-app.customer_id");

      expect(callback).to.have.been.calledWith({
        type: "watch",
        data: {
          key: "my-test-app.customer_id",
          value: 153
        }
      });

    });
  });
});
