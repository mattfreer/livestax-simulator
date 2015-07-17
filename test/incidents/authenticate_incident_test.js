"use strict";

require("../test_helper");

var AuthenticateIncident = require("../../scripts/incidents/authenticate_incident");

describe("AuthenticateIncident", () => {
  describe("#openWindow", () => {
    var _open = window.open;
    var clock;

    beforeEach(() => {
      window.open = sinon.stub();
      clock = sinon.useFakeTimers();
      sinon.stub(AuthenticateIncident, "sendPostMessage");
    });

    afterEach(() => {
      window.open = _open;
      clock.restore();
      AuthenticateIncident.sendPostMessage.restore();
    });

    it("opens the url in a new window", () => {
      AuthenticateIncident.openWindow("http://www.example.com");
      expect(window.open).to.have.been.calledWith("http://www.example.com");

    });

    it("calls sendPostMessage once per second", () => {
      AuthenticateIncident.openWindow("http://www.example.com");
      clock.tick(3000);
      expect(AuthenticateIncident.sendPostMessage).to.be.calledThrice;
    });
  });

  describe("#sendPostMessage", () => {
    it("sends a livestax:ping message to popoup", () => {
      var fakePopup = {
        postMessage: sinon.stub()
      };

      AuthenticateIncident.sendPostMessage(fakePopup);
      expect(fakePopup.postMessage).to.have.been.calledWith({type: "livestax:ping"}, "*");
    });
  });
});
