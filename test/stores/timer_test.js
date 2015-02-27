"use strict";

require("../test_helper");
var Timer = require("../../scripts/stores/timer");

describe("timer", () => {
  var timer, clock;

  describe("when timer completes", () => {
    beforeEach(() => {
      clock = sinon.useFakeTimers();
      timer = new Timer();
    });

    afterEach(() => {
      clock.restore();
    });

    it("emits complete event", () => {
      var spy = sinon.spy();
      timer.on("complete", spy);
      timer.start(3000);
      clock.tick(3000);
      expect(spy).to.have.been.called;
    });
  });

  describe("when timer is cancelled before it completes", () => {
    beforeEach(() => {
      clock = sinon.useFakeTimers();
      timer = new Timer();
    });

    afterEach(() => {
      clock.restore();
    });

    it("doesn't emit a complete event", () => {
      var spy = sinon.spy();
      timer.on("complete", spy);
      timer.start(3000);
      timer.cancel();
      clock.tick(3000);
      expect(spy).to.not.have.been.called;
    });
  });
});

