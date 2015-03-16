"use strict";

var React = require("react");

var StoreTable = React.createClass({
  render() {
    if (this.props.values && this.props.values.size === 0) {
      return null;
    }

    var rows = this.props.values
    .sortBy((val, key) => key)
    .map((val, key) => {
      var output = val;
      if (typeof val === "object") {
        output = JSON.stringify(val);
      }
      return (
        <tr>
          <td>{key}</td>
          <td>{output}</td>
        </tr>
      );
    }).toJS();

    return (
      <table className="table table-condensed store-table">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

module.exports = StoreTable;
