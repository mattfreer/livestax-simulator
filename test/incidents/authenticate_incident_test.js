"use strict";

require("../test_helper");

var AuthenticateIncident = require("../../scripts/incidents/authenticate_incident");

describe("AuthenticateIncident", () => {
  describe("#openWindow", () => {
    var _open = window.open;

    beforeEach(() => {
      window.open = sinon.stub();
    });

    afterEach(() => {
      window.open = _open;
    });

    it("opens the url in a new window", () => {
      AuthenticateIncident.openWindow("http://www.example.com");
      expect(window.open).to.have.been.calledWith("http://www.example.com");
    });
  });
});
