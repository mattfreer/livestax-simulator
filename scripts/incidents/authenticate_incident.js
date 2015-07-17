"use strict";

class AuthenticateIncident {
  constructor() {
    this.poll = undefined;
  }

  openWindow(url) {
    var popup = window.open(url);

    var ping = () => {
      this.poll = setInterval(
        this.sendPostMessage,
        1000,
        popup
      );
    };
    ping();
  }

  sendPostMessage(popup) {
    popup.postMessage({type: "livestax:ping"}, "*");
  }

  responded() {
    clearInterval(this.poll);
    this.poll = null;
  }
}

module.exports = new AuthenticateIncident();
