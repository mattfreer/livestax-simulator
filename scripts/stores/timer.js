"use strict";

var EventEmitter = require("events").EventEmitter;

class Timer extends EventEmitter{
  constructor(completeEvent) {
    this._completeEvent = completeEvent || "complete";
  }

  start(duration) {
    this.timer = setTimeout(() => {
      this.emit(this._completeEvent);
    }, duration);
  }

  cancel() {
    clearInterval(this.timer);
  }
}

module.exports = Timer;
