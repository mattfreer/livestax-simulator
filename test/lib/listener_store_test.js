"use strict";

require("../test_helper");

var ListenerStore = require("../../scripts/lib/listener_store");

describe("ListenerStore", () => {
  var store, mockStore;
  beforeEach(() => {
    mockStore = {
      get: sinon.stub().returns(1337),
      set: sinon.stub(),
      unset: sinon.stub(),
      watch: sinon.stub(),
      unwatch: sinon.stub()
    };

    store = new ListenerStore(mockStore);

  });

  describe("#set", () => {
    it("calls set on the store object with the correct parameters", () => {
      store.set({
        namespace: "customers",
        key: "customer_id",
        value: 1337
      });
      expect(mockStore.set).to.have.been.calledWith("customers.customer_id", 1337);
    });
  });

  describe("#unset", () => {
    it("calls unset on the store object with the correct parameters", () => {
      store.unset({
        namespace: "customers",
        key: "customer_id"
      });
      expect(mockStore.unset).to.have.been.calledWith("customers.customer_id");
    });

    it("calls unset with no parameters when options is empty", () => {
      store.unset();
      expect(mockStore.unset).to.have.been.calledWith();
    });
  });

  describe("#get", () => {
    it("calls get on the store object with the correct parameters", () => {
      var callback = sinon.stub();
      store.get({
        key: "customers.customer_id",
        callback: callback
      });

      expect(callback).to.have.been.calledWith(1337);
    });

    it("prepends the key with the namespace if one isn't set", () => {
      var callback = sinon.stub();
      store.get({
        namespace: "customers",
        key: "customer_id",
        callback: callback
      });

      expect(callback).to.have.been.calledWith(1337);
    });
  });

  describe("#watch", () => {
    var callback;

    describe("with namespace", () => {
      beforeEach(() => {
        callback = sinon.stub();
        store.watch({
          key: "customers.customer_id",
          callback: callback
        });
      });

      it("calls watch on the store object with the correct parameters", () => {
        expect(mockStore.watch).to.have.been.calledWith("customers.customer_id", callback);
      });

      it("stores the callback to the watchCallback object", () => {
        expect(store.watchCallbacks).to.eql({
          "customers.customer_id": callback
        });
      });
    });

    describe("without a namespace", () => {
      it("prepends the key with the namespace", () => {
        callback = sinon.stub();
        store.watch({
          namespace: "customers",
          key: "customer_id",
          callback: callback
        });

        expect(mockStore.watch).to.have.been.calledWith("customers.customer_id", callback);
      });
    });
  });

  describe("unwatch", () => {
   var callback;

    describe("with a namespace", () => {
      beforeEach(() => {
        callback = sinon.stub();
        store.watchCallbacks = {
          "customers.customer_id": callback
        };

        store.unwatch({
          key: "customers.customer_id"
        });
      });

      it("calls unwatch on the store object with the correct parameters", () => {
        expect(mockStore.unwatch).to.have.been.calledWith("customers.customer_id", callback);
      });

      it("deletes the callback from the watchCallback object", () => {
        expect(store.watchCallbacks).to.eql({});
      });
    });

    describe("without a namespace", () => {
      it("prepends the key with the namespace", () => {
        callback = sinon.stub();
        store.watchCallbacks = {
          "customers.customer_id": callback
        };

        store.unwatch({
          namespace: "customers",
          key: "customer_id"
        });

        expect(mockStore.unwatch).to.have.been.calledWith("customers.customer_id", callback);
      });
    });
  });

  describe("#clear()", () => {

    var callback1, callback2;

    beforeEach(() => {
      callback1 = sinon.stub();
      callback2 = sinon.stub();
      store.watch({
        namespace: "x",
        key: "foo",
        callback: callback1
      });

      store.watch({
        namespace: "x",
        key: "bar",
        callback: callback2
      });
    });

    it("sets the watchCallbacks to an empty object", () => {
      expect(Object.keys(store.watchCallbacks)).to.eql(["x.foo", "x.bar"]);
      store.clear();
      expect(Object.keys(store.watchCallbacks)).to.eql([]);
    });

    it("clears the store", () => {
      store.clear();
      expect(mockStore.unwatch).to.have.been.calledWith("x.foo", callback1);
      expect(mockStore.unwatch).to.have.been.calledWith("x.bar", callback2);
    });
  });
});
