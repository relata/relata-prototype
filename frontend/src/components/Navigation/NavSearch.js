import React, { Component } from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { defaultFilterBy } from "react-bootstrap-typeahead/lib/utils/defaultFilterBy";
import { compareTwoStrings } from "string-similarity";

import { client } from "../../feathers";

class NavSearch extends Component {
  state = {
    highlightOnlyResult: true,
    isLoading: false,
    options: []
  };

  _renderMenuItemChildren = (option, props, index) => {
    return [
      option.citation,
      <div className="dropdown-item-bibliography" key="bibliography">
        {option.bibliography}
      </div>
    ];
  };

  filterBy = (option, props) => {
    const { text } = props;
    return Boolean(
      option.id ||
        defaultFilterBy(option, {
          ...props,
          filterBy: ["citation", "bibliography"]
        }) ||
        compareTwoStrings(text, option.bibliography) > 0.1
    );
  };

  // Query FlexSearch index using graphs endpoint with searchQuery param
  onSearch = query => {
    this.setState({ isLoading: true });
    client
      .service("graphs")
      .find({ query: { searchQuery: query } })
      .then(results => {
        this.setState({
          isLoading: false,
          options: results
        });
      });
  };

  // When a work is selected from results list, call selectWork to make that
  // work the currentWork
  onChange = selectedItems => {
    const { selectWork } = this.props;
    if (selectedItems.length > 0) {
      const selectedWork = selectedItems[0];
      selectWork(selectedWork.id);

      // Clear input
      this.typeahead.clear();
    }
  };

  render() {
    const { highlightOnlyResult, isLoading, options } = this.state;

    return (
      <AsyncTypeahead
        id="nav-search"
        ref={typeahead => (this.typeahead = typeahead)}
        className="col-md-4 col-sm-12 p-0"
        isLoading={isLoading}
        delay={670}
        labelKey="citation"
        filterBy={this.filterBy}
        renderMenuItemChildren={this._renderMenuItemChildren}
        highlightOnlyResult={highlightOnlyResult}
        options={options}
        onChange={this.onChange}
        onSearch={this.onSearch}
        maxHeight="67vh"
        placeholder="Type to search for works in Relata…"
        selectHintOnEnter
        clearButton
      />
    );
  }
}

export default NavSearch;
