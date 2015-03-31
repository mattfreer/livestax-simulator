"use strict";

var React = require("react");

var allFilter = { data: undefined, label: "All" };

var cloneArray = (a) => {
  return a.slice(0);
};

var toggleListMember = (items, item) => {
  var list = cloneArray(items);
  var index = list.indexOf(item);
  if(index === -1) {
    list.push(item);
  } else {
    list.splice(index, 1);
  }
  return list;
};

var isFilterActive = (filters, filter) => {
  if(filters.length > 0) {
    return (filters.indexOf(filter.data) !== -1);
  } else {
    return (filter.data === allFilter.data);
  }
  return false;
};

var FilterList = React.createClass({
  propTypes: {
    filters: React.PropTypes.array.isRequired,
    onFilterChange: React.PropTypes.func.isRequired,
    active: React.PropTypes.array.isRequired
  },

  applyFilter(filter) {
    var nextFilters;
    if(filter !== allFilter.data) {
      nextFilters = toggleListMember(this.props.active, filter);
    } else {
      nextFilters = [];
    }
    this.props.onFilterChange(nextFilters);
  },

  renderFilterList() {
    var filters = this.props.filters;

    if(filters.length > 0) {
      filters = [allFilter].concat(filters);
    }

    return filters
      .map((item, index) => {
        var itemCssClass = "label label-default";

        if(isFilterActive(this.props.active, item)) {
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
