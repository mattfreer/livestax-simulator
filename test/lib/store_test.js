"use strict";

var Store = require("../../scripts/lib/store");

describe("Key value store", () => {
  var store, callback1, callback2, callback3, callback4;

  beforeEach(() => {
    store = new Store();
    callback1 = sinon.stub();
    callback2 = sinon.stub();
    callback3 = sinon.stub();
    callback4 = sinon.stub();
  });

  describe("#set()", () => {
    it("sets the value on the data object", () => {
      store.set("name", "Olivander");
      expect(store._data.name).to.equal("Olivander");
    });

    it("overwrites the value on the data object", () => {
      store.set("name", "Olivander");
      store.set("name", "The Swift");
      expect(store._data.name).to.equal("The Swift");
    });

    it("supports multiple keys and values", () => {
      store.set("first name", "Olivander");
      store.set("last name", "The Swift");
      expect(store._data["first name"]).to.equal("Olivander");
      expect(store._data["last name"]).to.equal("The Swift");
    });
  });

  describe("#unset()", () =>  {
    it("removes the value from the data object", () =>  {
      store.set("name", "Olivander");
      expect(store.has("name")).to.eql(true);

      store.unset("name");
      expect(store.has("name")).to.eql(false);
    });

    describe("unsetting multiple values", () => {
      beforeEach(() => {
        store.set("skateboard", {
          speed: 5
        });

        store.set("bike", {
          speed: 15
        });

        store.set("car", {
          speed: 30
        });

        store.set("jet", {
          speed: 100
        });
      });

      it("unsets all values", () =>  {
        store.unset();

        expect(store.has("skateboard")).to.eql(false);
        expect(store.has("bike")).to.eql(false);
        expect(store.has("car")).to.eql(false);
        expect(store.has("jet")).to.eql(false);
      });

      it("unsets values that pass a truth test (iterator)", () =>  {
        store.unset((value) => {
          return value.speed > 20;
        });

        expect(store.has("skateboard")).to.eql(true);
        expect(store.has("bike")).to.eql(true);
        expect(store.has("car")).to.eql(false);
        expect(store.has("jet")).to.eql(false);
      });
    });
  });

  describe("#get()", () => {
    it("gets the value on the data object", () => {
      store.set("name", "Olivander");
      store.set("age", 50);
      store.set("additional", {
        comments: 25,
        tagline: "The Swift"
      });
      expect(store.getAll()).to.eql({
        name: "Olivander",
        age: 50,
        additional: {
          comments: 25,
          tagline: "The Swift"
        }
      });
    });
  });

  describe("#getAll()", () => {
    it("returns all of the keys and values in the store", () => {
      store.set("name", "Olivander");
      expect(store.get("name")).to.equal("Olivander");
    });

    it("can able to get falsy values", () => {
      store.set("age", 0);
      expect(store.get("age")).to.equal(0);
    });

    it("returns null if the value is not set", () => {
      expect(store.get("name")).to.eql(null);
    });
  });

  describe("#has()", () => {
    it("returns true if a value has been set", () => {
      store.set("name", "Olivander");
      expect(store.has("name")).to.eql(true);
    });

    it("returns false if a value has not been set", () => {
      expect(store.has("name")).to.eql(false);
    });

    it("returns true even if the value has been set to null", () => {
      store.set("name", null);
      expect(store.has("name")).to.eql(true);
    });

    it("returns true even if the value has been set to undefined", () => {
      store.set("name", undefined);
      expect(store.has("name")).to.eql(true);
    });
  });

  describe("#keys()", () =>  {
    it("returns an array of the current keys", () =>  {
      store.set("first", "Olivander");
      store.set("middle", "The");
      store.set("last", "Swift");

      store.unset("middle");

      expect(store.keys()).to.eql(["first", "last"]);
    });

    it("returns an empty array if no values have been set", () =>  {
      expect(store.keys()).to.eql([]);
    });
  });

  describe("#watch()", () =>  {
    it("adds the callback to the listeners object", () =>  {
      store.watch("name", callback1, this);
      expect(store._listeners.name[0].callback).to.equal(callback1);
    });

    it("adds multiple callbacks to the listeners object", () =>  {
      store.watch("name", callback1);
      store.watch("name", callback2);

      expect(store._listeners.name[0].callback).to.equal(callback1);
      expect(store._listeners.name[1].callback).to.equal(callback2);
    });

    it("triggers its callback when the value changes", () =>  {
      store.watch("name", callback1);
      store.set("name", "Olivander");
      expect(callback1).to.have.been.calledWith("Olivander");
    });

    it("ONLY trigger sits callback when the value actually changes", () =>  {
      store.watch("name", callback1);
      store.set("name", "Olivander");
      store.set("name", "Olivander");
      expect(callback1).to.have.been.calledOnce;
    });

    it("triggers multiple callbacks if set", () =>  {
      store.watch("name", callback1);
      store.watch("name", callback2);
      store.set("name", "Olivander");

      expect(callback1).to.have.been.calledWith("Olivander");
      expect(callback2).to.have.been.calledWith("Olivander");
    });

    describe("duplicate callbacks and contexts", () =>  {
      it("does not add duplicate callbacks", () =>  {
        store.watch("name", callback1);
        store.watch("name", callback1);

        expect(store._listeners.name.length).to.eql(1);
      });

      it("allows duplicate callbacks if the contexts differ", () =>  {
        store.watch("name", callback1, {});
        store.watch("name", callback1, {});

        expect(store._listeners.name.length).to.eql(2);
      });

    });

    it("triggers the callback if the value has already been set", () =>  {
      store.set("name", "Olivander");
      store.watch("name", callback1);
      expect(callback1).to.have.been.calledWith("Olivander");
    });

    it("does not trigger the callback if the value has not been set", () =>  {
      store.watch("name", callback1);
      expect(callback1).to.not.have.been.called;
    });

    it("does not trigger the callback if the value has been unset before being watched", () =>  {
      store.set("name", "Olivander");
      store.unset("name");
      store.watch("name", callback1);
      expect(callback1).to.not.have.been.called;
    });

    it("takes an optional callback context", () =>  {
      var context = {};

      store.watch("name", callback1, context);
      store.set("name", "Olivander");

      expect(callback1).to.have.been.calledOn(context);
    });

    it("triggers when the value is unset", () =>  {
      store.set("name", "Olivander");
      store.watch("name", callback1);

      expect(callback1).to.have.been.calledWith("Olivander");

      store.unset("name");

      expect(callback1).to.have.been.calledWith(null);
    });
  });

  describe("#unwatch()", () =>  {
    it("removes the callback from the listeners", () =>  {
      store.watch("name", callback1);
      store.unwatch("name", callback1);

      store.watch("name", callback2);

      store.set("name", "Olivander");

      expect(callback1).to.not.have.been.called;
      expect(callback2).to.have.been.called;
    });

    it("removes all callbacks from the listeners if no callback is set", () =>  {
      store.watch("name", callback1);
      store.watch("name", callback2);
      store.unwatch("name");

      store.set("name", "Olivander");

      expect(callback1).to.not.have.been.called;
      expect(callback2).to.not.have.been.called;
    });

    it("removes all callbacks from the listeners if no callback or key is set", () =>  {
      store.watch("name", callback1);
      store.watch("another", callback2);

      store.unwatch();

      store.set("name", "Olivander");
      store.set("another", "Olivander");

      expect(callback1).to.not.have.been.called;
      expect(callback2).to.not.have.been.called;
    });

    describe("unwatch truth test iterator", () =>  {
      var context1, context2, context3;

      beforeEach(() => {
        context1 = {};
        context2 = {};
        context3 = {};

        store.watch("food:steak", callback1, context1);
        store.watch("drink:water", callback2, context2);
        store.watch("drink:milk", callback3, context3);

        store.set("food:steak", "yummy");
        store.set("drink:water", "boring");
        store.set("drink:milk", "healthy");
      });

      it("unwatches listeners that pass a truth test based on the value", () =>  {
        store.unwatch((value) => {
          return value.length > 6;
        });

        store.set("food:steak", "something");
        store.set("drink:water", "something");
        store.set("drink:milk", "something");

        expect(callback1).to.have.been.calledTwice;
        expect(callback2).to.have.been.calledTwice;
        expect(callback3).to.have.been.calledOnce;
      });

      it("unwatches listeners that pass a truth test based on the key", () =>  {
        store.unwatch((value, key) => {
          return key.indexOf("food") === 0;
        });

        store.set("food:steak", "something");
        store.set("drink:water", "something");
        store.set("drink:milk", "something");

        expect(callback1).to.have.been.calledOnce;
        expect(callback2).to.have.been.calledTwice;
        expect(callback3).to.have.been.calledTwince;
      });

      it("unwatches listeners that pass a truth test based on the callback", () =>  {
        store.unwatch((value, key, callback) => {
          return callback === callback2;
        });

        store.set("food:steak", "something");
        store.set("drink:water", "something");
        store.set("drink:milk", "something");

        expect(callback1).to.have.been.calledTwice;
        expect(callback2).to.have.been.calledOnce;
        expect(callback3).to.have.been.calledTwince;
      });

      it("unwatches listeners that pass a truth test based on the context", () =>  {
        store.unwatch((value, key, callback, context) => {
          return context === context3;
        });

        store.set("food:steak", "something");
        store.set("drink:water", "something");
        store.set("drink:milk", "something");

        expect(callback1).to.have.been.calledTwice;
        expect(callback2).to.have.been.calledTwice;
        expect(callback3).to.have.been.calledOnce;
      });
    });
  });
});
