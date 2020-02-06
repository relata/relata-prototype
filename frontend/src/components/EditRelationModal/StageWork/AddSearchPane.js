import React, { Component } from "react";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import MetadataSearch from "./MetadataSearch";

class AddSearchPane extends Component {
  render() {
    const { setTargetWork, targetWork } = this.props;

    const targetBibliography =
      targetWork === null ? "No work selected." : targetWork.bibliography;

    return (
      <>
        <Form.Label htmlFor="metadata-search">
          Bibliographic search terms (title, author, year)
        </Form.Label>
        <InputGroup className="mb-3">
          <MetadataSearch setTargetWork={setTargetWork} />
        </InputGroup>
        <Card>
          <Card.Body>
            <Card.Text>{targetBibliography}</Card.Text>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default AddSearchPane;
