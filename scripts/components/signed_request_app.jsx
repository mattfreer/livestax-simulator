"use strict";

var React = require("react");
var jwt = require("jwt-simple");

var SignedRequestApp = React.createClass({
  componentDidMount() {
    this.submitForm();
  },
  componentDidUpdate() {
    this.submitForm();
  },
  submitForm() {
    if (this.props.status === "loading") {
      this.getDOMNode().querySelector("form").submit();
    }
  },
  generateSignedRequest(postData) {
    var payload = postData.get("payload");
    if (payload.get("is_guest")) {
      payload = payload.set("user_id", null);
    }
    payload = payload.update("timestamp", (timestamp) => parseInt(timestamp, 10));
    return jwt.encode(payload.toJS(), postData.get("secret_key"));
  },
  shouldComponentUpdate(nextProps) {
    return nextProps.status !== this.props.status;
  },

  render() {
    var src = this.props.src;
    var signedRequest = this.generateSignedRequest(this.props.postData);
    var containerClass = this.props.status === "ready" ? "signed-request-app app-container" : "signed-request-app app-container hidden";

    var frameId = "frame-for-submit";
    return (
      <div className={containerClass}>
        <iframe name={frameId} className="app-iframe"></iframe>
        <form target={frameId} action={src} method="post">
          <input name="signed_request" value={signedRequest} type="hidden" />
        </form>
      </div>
    );
  }
});

module.exports = SignedRequestApp;
