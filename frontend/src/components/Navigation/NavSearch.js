import React, { Component } from "react";

import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";

import client from "../../feathers";

class NavSearch extends Component {
  state = {
    highlightOnlyResult: true,
    isLoading: false,
    options: []
  };

  _renderMenuItemChildren = (option, props, index) => {
    return [
      <Highlighter key="citation" search={props.text}>
        {option.citation}
      </Highlighter>,
      <div className="dropdown-item-bibliography" key="bibliography">
        <Highlighter key="bibliography" search={props.text}>
          {option.bibliography}
        </Highlighter>
      </div>
    ];
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
    }
  };

  render() {
    const { highlightOnlyResult, isLoading, options } = this.state;

    return (
      <AsyncTypeahead
        id="nav-search"
        className="col-md-4 col-sm-12 p-0"
        isLoading={isLoading}
        delay={360}
        labelKey="citation"
        filterBy={["citation", "bibliography"]}
        renderMenuItemChildren={this._renderMenuItemChildren}
        highlightOnlyResult={highlightOnlyResult}
        options={options}
        onChange={this.onChange}
        onSearch={this.onSearch}
        maxHeight={"67vh"}
        placeholder="Search for bibliographic works…"
        clearButton
      />
    );
  }
}

export default NavSearch;
