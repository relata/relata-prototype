import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

import LinkifyBibliography from "../../LinkifyBibliography";

import { makeCitations } from "./utilities/citations";
import { queryCrossRefApi } from "./utilities/crossRefApi";

// Transform invalid CSL JSON types from CrossRef API to make them compliant;
// because CrossRef API won't serve requests on works endpoint when we specify
// a content type of CSL JSON, we have to fix work types ourselves as
// described here: https://github.com/CrossRef/rest-api-doc/issues/222
const fixCrossRefWork = work => {
  const typeMappings = {
    "journal-article": "article-journal",
    "book-chapter": "chapter",
    "posted-content": "manuscript",
    "proceedings-article": "paper-conference"
  };
  work.type = typeMappings[work.type] || work.type;
  return work;
};

class AddSearchPane extends Component {
  state = {
    targetSearchQuery: "",
    targetQueryResults: []
  };

  // Retrieve CSL JSON from the CrossRef API
  getQueryResults = async () => {
    const { targetSearchQuery } = this.state;
    const { setTargetWork } = this.props;

    setTargetWork(null);

    if (!targetSearchQuery) {
      return;
    }

    try {
      // Construct URL
      const queryResults = await queryCrossRefApi(targetSearchQuery);

      // Process results, generate citations
      const works = queryResults.map(fixCrossRefWork).map(result => {
        const citations = makeCitations({ data: result });
        const work = { data: result, ...citations };
        return work;
      });

      this.setState({ targetQueryResults: works });
    } catch (error) {
      return;
    }
  };

  render() {
    const { setTargetWork, targetWork } = this.props;
    const { targetSearchQuery, targetQueryResults } = this.state;

    const targetBibliography =
      targetWork === null ? "No work selected." : targetWork.bibliography;
    const targetBibliographyCardBody = (
      <Card.Body>
        <Card.Text>
          <small>
            <LinkifyBibliography>{targetBibliography}</LinkifyBibliography>
          </small>
        </Card.Text>
      </Card.Body>
    );
    const queryResults = targetQueryResults.map((work, index) => (
      <ListGroupItem
        key={index}
        className="search-result-list-item"
        title={work.bibliography}
        action
        onClick={() => setTargetWork(work)}
      >
        <small>{work.bibliography}</small>
      </ListGroupItem>
    ));
    const queryResultsList = (
      <ListGroup
        variant="flush"
        style={{
          overflow: "scroll",
          height: "24rem"
        }}
      >
        {queryResults}
      </ListGroup>
    );

    // Order of operations: if targetWork is set, show that; if targetWork is
    // not set but targetQueryResults are set, show those; if none of the above
    // are set, show empty card
    let targetOutput;
    if (targetWork) {
      targetOutput = targetBibliographyCardBody;
    } else if (!targetWork && targetQueryResults.length > 0) {
      targetOutput = queryResultsList;
    } else {
      targetOutput = targetBibliographyCardBody;
    }

    return (
      <>
        <Form.Label htmlFor="search-query-input">
          Bibliographic search terms (title, author, year)
        </Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            id="search-query-input"
            placeholder="e.g., ontological turn"
            defaultValue={targetSearchQuery}
            aria-label="Bibliographic search terms (title, author, year)"
            aria-describedby="search-query-input-label"
            onKeyPress={async event => {
              if (event.key === "Enter") {
                await this.getQueryResults();
              }
            }}
            onChange={event => {
              setTargetWork(null);
              this.setState({ targetQueryResults: [] });
              this.setState({ targetSearchQuery: event.target.value.trim() });
            }}
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.getQueryResults}>
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Card>{targetOutput}</Card>
      </>
    );
  }
}

export default AddSearchPane;
