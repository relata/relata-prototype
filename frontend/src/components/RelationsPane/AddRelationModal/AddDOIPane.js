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

class AddDOIPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      targetDoi: "",
      targetCite: null,
      targetRelationType: null
    };
  }

  getCite = () => {
    const { setTargetWork } = this.props;
    try {
      const cite = new Cite(this.state.targetDoi, { forceType: "@doi/id" });
      this.setState({ targetCite: cite });

      const works = cite.format("data", { format: "object" });
      setTargetWork(works.pop());
    } catch (error) {
      return;
    }
  };

  render() {
    const { currentWork } = this.props;
    const { targetCite, targetDoi, targetRelationType } = this.state;

    var targetBibliography;
    var targetCitation;
    if (targetCite != null) {
      targetBibliography = targetCite.format("bibliography");
      targetCitation = targetCite.format("citation");
    } else {
      targetBibliography = "No bibliography";
      targetCitation = "n/a";
    }
    return (
      <Container className="p-3">
        <label id="doi-search-input-label" htmlFor="doi-search-input">
          Digital Object Identifier (DOI)
        </label>
        <InputGroup className="mb-3">
          <FormControl
            id="doi-search-input"
            placeholder="e.g., 10.1093/ahr/rhz239"
            defaultValue={targetDoi}
            aria-label="DOI"
            aria-describedby="doi-search-input-label"
            onChange={event => this.setState({ targetDoi: event.target.value })}
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.getCite}>
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Dropdown>
          <Dropdown.Toggle id="doi-relation-type-dropdown">
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
          </Dropdown.Menu>
        </Dropdown>
        <Card border="success">
          <Card.Body>
            <p>{targetBibliography}</p>
            <p>
              <b>{currentWork.citation}</b> represents an instance of{" "}
              <b>{targetRelationType}</b> in relation to {targetCitation}.
            </p>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default AddDOIPane;
