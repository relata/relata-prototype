import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import Cite from "citation-js";

import LinkifyBibliography from "../../LinkifyBibliography";

import { makeCitations } from "./utilities/citations";

class AddDOIPane extends Component {
  state = {
    targetDoi: ""
  };

  getCite = () => {
    const { setTargetWork } = this.props;
    const { targetDoi } = this.state;

    if (!targetDoi) {
      return;
    }

    try {
      // Retrieve CSL JSON by DOI
      const cite = new Cite(targetDoi, { forceType: "@doi/id" });

      const workData = cite.format("data", { format: "object" }).pop();
      const citations = makeCitations({ data: workData });
      const work = { data: workData, ...citations };
      setTargetWork(work);
    } catch (error) {
      return;
    }
  };

  render() {
    const { setTargetWork, targetWork } = this.props;
    const { targetDoi } = this.state;

    const targetBibliography =
      targetWork === null ? "No work selected." : targetWork.bibliography;

    return (
      <>
        <Form.Label htmlFor="doi-search-input">
          Digital Object Identifier (DOI)
        </Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            id="doi-search-input"
            placeholder="e.g., 10.1093/ahr/rhz239"
            defaultValue={targetDoi}
            aria-label="Digital Object Identifier (DOI)"
            aria-describedby="doi-search-input-label"
            onKeyPress={event => {
              if (event.key === "Enter") {
                this.getCite();
              }
            }}
            onChange={event => {
              setTargetWork(null);
              this.setState({ targetDoi: event.target.value.trim() });
            }}
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={this.getCite}>
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Card>
          <Card.Body>
            <Card.Text>
              <small>
                <LinkifyBibliography>{targetBibliography}</LinkifyBibliography>
              </small>
            </Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default AddDOIPane;
