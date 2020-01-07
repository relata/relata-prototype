import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import { Cite } from "@citation-js/core";
import "@citation-js/plugin-csl";
import "@citation-js/plugin-doi";

class AddCrossRefPane extends Component {
  state = {
    targetQueryString: "",
    targetWork: null,
    targetRelationType: null
  };

  queryCrossRef = async query => {
    const url = new URL("https://api.crossref.org/works");
    url.searchParams.set("rows", 10);
    url.searchParams.set("query.bibliographic", query);

    const response = await fetch(url.href, {
      // headers: {
      //   Accept: "application/vnd.citationstyles.csl+json"
      // }
    });
    const results = await response.json();
    return results.message.items.pop();
  };

  getCite = async () => {
    const work = await this.queryCrossRef(this.state.targetQueryString);
    const cite = new Cite(work, { forceType: "@csl/object" });
    this.setState({ targetWork: cite });
  };

  render() {
    const { targetQueryString, targetWork, targetRelationType } = this.state;
    var targetBibliography;
    var targetCitation;
    if (this.state.targetWork !== null) {
      targetBibliography = targetWork.format("bibliography");
      targetCitation = targetWork.format("citation");
    } else {
      targetBibliography = "No bibliography";
      targetCitation = "n/a";
    }
    return (
      <Container className="p-3">
        <label id="crossref-search-input-label" htmlFor="crossref-search-input">
          Search terms (title, author, year of publication)
        </label>
        <InputGroup className="mb-3">
          <FormControl
            id="crossref-search-input"
            placeholder="e.g., rachel carson sea around us"
            defaultValue={targetQueryString}
            aria-label="Search terms"
            aria-describedby="crossref-search-input-label"
            onChange={event =>
              this.setState({ targetQueryString: event.target.value })
            }
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.getCite}>
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Dropdown>
          <Dropdown.Toggle id="crossref-relation-type-dropdown">
            Relation Type
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              eventKey="extension"
              onSelect={(eventKey, event) =>
                this.setState({ targetRelationType: eventKey })
              }
            >
              extension
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="omission"
              onSelect={(eventKey, event) =>
                this.setState({ targetRelationType: eventKey })
              }
            >
              omission
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="absence"
              onSelect={(eventKey, event) =>
                this.setState({ targetRelationType: eventKey })
              }
            >
              absence
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Card border="success">
          <Card.Body>
            <p>{targetBibliography}</p>
            <p>
              <b>{this.props.currentWorkCitation}</b> represents an instance of{" "}
              <b>{targetRelationType}</b> in relation to {targetCitation}.
            </p>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default AddCrossRefPane;
