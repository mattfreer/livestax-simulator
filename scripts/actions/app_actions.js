"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var AppActions = {
  receivePostMessage(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_POST_MESSAGE,
      payload: data
    });
  },
  receiveSignedRequest(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_SIGNED_REQUEST,
      payload: data
    });
  },
  receiveAppConfiguration(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_APP_CONFIGURATION,
      payload: data
    });
  },
  receiveStoreConfiguration(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_STORE_CONFIGURATION,
      payload: data
    });
  },
  deleteStoreItem(key) {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_STORE_ITEM,
      payload: key
    });
  },
  startAppTimeout(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.START_APP_TIMEOUT,
      payload: data
    });
  },
  receiveGeneratedMessage(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_GENERATED_MESSAGE,
      payload: data
    });
  },
};

module.exports = AppActions;
