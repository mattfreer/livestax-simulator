"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var AuthenticateActions = {
  openWindow(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.OPEN_AUTHENTICATE_WINDOW,
      payload: {
        url: data
      }
    });
  },

  clearRequest() {
    AppDispatcher.dispatch({
      type: ActionTypes.CLEAR_AUTH_REQUEST
    });
  }
};

module.exports = AuthenticateActions;
