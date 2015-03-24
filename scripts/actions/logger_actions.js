"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var LogActions = {
  clearLog() {
    AppDispatcher.dispatch({
      type: ActionTypes.CLEAR_LOG
    });
  }
};

module.exports = LogActions;
