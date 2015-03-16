"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var HistoryActions = {
  deleteHistoryItem(key, item) {
    AppDispatcher.dispatch({
      type: ActionTypes.DELETE_HISTORY_ITEM,
      payload: {
        key: key,
        item: item
      }
    });
  }
};

module.exports = HistoryActions;
