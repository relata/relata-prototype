import React, { Component } from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { defaultFilterBy } from "react-bootstrap-typeahead/lib/utils";
import { compareTwoStrings } from "string-similarity";

import client from "../../../feathers";
import {
  filterCrossRefWorkByType,
  fixCrossRefWork,
  queryCrossRefApi
} from "./utilities/crossRefApi";
import { makeCitations } from "./utilities/citations";

class MetadataSearch extends Component {
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
    return (
      option.id ||
      defaultFilterBy(option, {
        ...props,
        filterBy: ["citation", "bibliography"]
      }) ||
      compareTwoStrings(text, option.bibliography) > 0.1
    );
  };

  // Query FlexSearch index using graphs endpoint with searchQuery param
  onSearch = async query => {
    this.setState({ isLoading: true });

    // Fetch works already in Relata
    const relataResults = await client.service("graphs").find({
      query: { searchQuery: query }
    });

    // Fetch works from CrossRef API
    const crossRefResults = await queryCrossRefApi(query);

    // Process and filter results from CrossRef
    const crossRefWorks = crossRefResults
      .map(fixCrossRefWork)
      .filter(filterCrossRefWorkByType)
      .map(work => {
        return { data: work, ...makeCitations({ data: work }) };
      })
      .filter((work, index) => {
        // Compare against results from Relata, remove any apparent duplicates
        for (let result of relataResults) {
          let score = compareTwoStrings(work.bibliography, result.bibliography);
          return score < 0.67;
        }
        return true;
      })
      .sort((a, b) => {
        // Improve default sort of CrossRef results through fuzzy matching
        // against query
        const aScore = compareTwoStrings(a.bibliography, query);
        const bScore = compareTwoStrings(b.bibliography, query);
        return aScore < bScore ? 1 : -1;
      });

    // Set state upon completion, placing Relata works first
    this.setState({
      isLoading: false,
      options: [...relataResults, ...crossRefWorks]
    });
  };

  // When a work is selected from results list, call selectWork to make that
  // work the currentWork
  onChange = selectedItems => {
    const { setTargetWork } = this.props;
    if (selectedItems.length > 0) {
      const selectedWork = selectedItems[0];
      setTargetWork(selectedWork);
    }
  };

  render() {
    const { highlightOnlyResult, isLoading, options } = this.state;

    return (
      <AsyncTypeahead
        id="metadata-search"
        isLoading={isLoading}
        delay={1000}
        labelKey="citation"
        filterBy={this.filterBy}
        renderMenuItemChildren={this._renderMenuItemChildren}
        highlightOnlyResult={highlightOnlyResult}
        options={options}
        onChange={this.onChange}
        onSearch={this.onSearch}
        maxHeight={"33vh"}
        placeholder="Type to search for works via CrossRef…"
        clearButton
      />
    );
  }
}

export default MetadataSearch;
