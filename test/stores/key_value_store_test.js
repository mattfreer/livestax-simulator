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

    it("triggers a listener on a change event", () => {
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

    it("triggers a listener when changed from the store configuration event", () => {
      AppActions.receiveStoreConfiguration(Immutable.Map({
        key: "my-test-app.customer_id",
        value: 125
      }));

      expect(callback).to.have.been.calledWith({
        type: "watch",
        data: {
          key: "my-test-app.customer_id",
          value: 125
        }
      });

    });

    it("triggers a listener when changed with JSON from the store configuration event", () => {
      AppActions.receiveStoreConfiguration(Immutable.Map({
        key: "my-test-app.customer_id",
        value: "{\"id\": 125, \"name\": \"test customer\"}"
      }));

      expect(callback).to.have.been.calledWith({
        type: "watch",
        data: {
          key: "my-test-app.customer_id",
          value: {
            id: 125,
            name: "test customer"
          }
        }
      });
    });

    it("resets the watchers when the app configuration changes", () => {
      AppActions.receiveAppConfiguration(Immutable.fromJS({
        namespace: "my-test-app"
      }));

      triggerStorePostMessage("set", "customer_id", 153);
      expect(callback).to.not.have.been.calledWith({
        type: "watch",
        data: {
          key: "my-test-app.customer_id",
          value: 153
        }
      });

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

  describe("#getAll()", () => {
    it("gets all the set values in the store", () => {
      expect(KeyValueStore.getValues()).to.eql({});
      AppActions.receiveStoreConfiguration(Immutable.Map({
        key: "our-customers.customer",
        value: "{ \"id\": 1 }"
      }));

      AppActions.receiveStoreConfiguration(Immutable.Map({
        key: "test-app.simple_value",
        value: "foobar"
      }));

      expect(KeyValueStore.getValues()).to.eql({
        "our-customers.customer": {
          id: 1
        },
        "test-app.simple_value": "foobar"
      });
    });
  });
});
