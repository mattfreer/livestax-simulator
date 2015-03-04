"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var MessageStore = require("../../scripts/stores/message_store");
var AppIframe = require("../../scripts/components/app_iframe");
var MessageActions = require("../../scripts/actions/message_actions");
var Immutable = require("immutable");

describe("AppIframe", () => {
  var appIframe, iframe, contentWindow;

  beforeEach(() => {
    MessageStore.reset();
    appIframe = TestUtils.renderIntoDocument(React.createElement(AppIframe));
    iframe = TestUtils.findRenderedDOMComponentWithTag(appIframe, "iframe");
    contentWindow = iframe.getDOMNode().contentWindow;

    if(contentWindow.hasOwnProperty("postMessage")) {
      sinon.spy(contentWindow, "postMessage");
    } else {
      contentWindow.postMessage = sinon.stub();
    }
  });

  describe("when a message is received", () => {
    beforeEach(() => {
      MessageActions.receiveGeneratedMessage(Immutable.Map({
        namespace: "another-app",
        key: "selected",
        value: 3
      }));
    });

    it("sends a trigger postMessage", () => {
      expect(contentWindow.postMessage).to.have.been.calledWith({
        type: "trigger",
        payload: {
          type: "another-app.selected",
          data: 3
        }
      });
    });
  });
});
