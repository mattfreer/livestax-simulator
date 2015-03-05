"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var HistoryActions = {
  deleteHistoryItem(key, index) {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_HISTORY_ITEM,
      payload: {
        key: key,
        index: index
      }
    });
  }
};

module.exports = HistoryActions;
