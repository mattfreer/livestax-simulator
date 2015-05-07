"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var DialogActions = {
  dialogInteraction(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.DIALOG_INTERACTION,
      payload: {
        interaction: data
      }
    });
  },
  clearDialog() {
    AppDispatcher.dispatch({
      type: ActionTypes.CLEAR_DIALOG,
    });
  },
};

module.exports = DialogActions;
