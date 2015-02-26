"use strict";

var AppActions = require("./actions/app_actions");

class WindowListeners {
  constructor() {
    window.addEventListener("message", (event) => {
      AppActions.receivePostMessage(event.data);
    });
  }
}

module.exports = new WindowListeners();
