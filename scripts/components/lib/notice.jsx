"use strict";

var React = require("react");

var Notice = React.createClass({
  propTypes:{
    type: React.PropTypes.oneOf(["info", "default", "warning", "danger", "success", "primary"]),
    icon: React.PropTypes.string
  },

  getDefaultProps() {
    return { type: "default",
      icon: "fa fa-flag"
    };
  },

  render() {
    var noticeClasses = `media-badge media-badge-lg media-badge-${this.props.type}-inverse img-circle`;

    return (
      <div className="notice">
        <div className={noticeClasses}>
          <span className="media-badge-container">
            <i className={this.props.icon}></i>
          </span>
        </div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Notice;
