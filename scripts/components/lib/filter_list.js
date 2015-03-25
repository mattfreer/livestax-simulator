"use strict";

var React = require("react");

var allFilter = { data: undefined, label: "All" };

var FilterList = React.createClass({
  propTypes: {
    filters: React.PropTypes.array.isRequired,
    onFilterChange: React.PropTypes.func.isRequired,
    filter: React.PropTypes.string
  },

  applyFilter(filter) {
    this.props.onFilterChange(filter);
  },

  renderFilterList() {
    var filters = this.props.filters;

    if(filters.length > 0) {
      filters = [allFilter].concat(filters);
    }

    return filters
      .map((item, index) => {
        var itemCssClass = "label label-default";

        if(item.data === this.props.active) {
          itemCssClass = "label label-primary";
        }

        return (
          <span
            onClick={this.applyFilter.bind(this, item.data)}
            key={index}
            className={itemCssClass}>
            {item.label}
          </span>
        )
      }
    );
  },

  render() {
    return (
      <div className="filters">
        {this.renderFilterList()}
      </div>
    );
  }
});

module.exports = FilterList;
