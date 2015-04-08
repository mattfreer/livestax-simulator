"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.MENU_CHANGE;
var Immutable = require("immutable");

class MenuStore extends EventEmitter {
  constructor() {
    this.reset();
    this._registerInterests();
  }

  reset() {
    this.replaceState(Immutable.fromJS({
      items: Immutable.OrderedSet()
    }));
  }

  emitChange(data) {
    this.emit(CHANGE_EVENT, data);
  }

  setState(path, value) {
    this._state = this._state.setIn(path, value);
    this.emitChange();
  }

  replaceState(state) {
    if(!Immutable.is(state, Immutable.fromJS(state))) {
      console.warn("replaceState expects an Immutable data structure");
    }
    this._state = state;
    this.emitChange();
  }

  getItems() {
    return this._state.get("items");
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  _receivePostMessage(data) {
    if(data.type === "menu") {
      if (data.payload.type === "set") {
        this._state = this._state.update("items", (items) => items.add(Immutable.fromJS(data.payload.data)));
      }
    }
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;

        case ActionTypes.RECEIVE_APP_CONFIGURATION:
          this.reset();
        break;
      }

      this.emitChange();
    });
  }
}

module.exports = new MenuStore();
