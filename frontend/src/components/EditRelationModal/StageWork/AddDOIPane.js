import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import Cite from "citation-js";

import { makeCitations } from "./utilities/citations";

import LinkifyBibliography from "../../RelationsPane/LinkifyBibliography";

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
      targetWork === null ? null : (
        <Card>
          <Card.Body>
            <Card.Text>
              <LinkifyBibliography>
                {targetWork.bibliography}
              </LinkifyBibliography>
            </Card.Text>
          </Card.Body>
        </Card>
      );

    return (
      <>
        <Form.Label htmlFor="doi-search-input">
          Digital Object Identifier (DOI)
        </Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            id="doi-search-input"
            placeholder="Enter a DOI, such as 10.1093/ahr/rhz239"
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
        {targetBibliography}
      </>
    );
  }
}

export default AddDOIPane;
