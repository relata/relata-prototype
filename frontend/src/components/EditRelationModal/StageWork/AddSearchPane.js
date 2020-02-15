import React, { Component } from "react";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import LinkifyBibliography from "../../RelationsPane/LinkifyBibliography";
import MetadataSearch from "./MetadataSearch";

class AddSearchPane extends Component {
  render() {
    const { setTargetWork, targetWork } = this.props;

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
        <Form.Label htmlFor="metadata-search">
          Bibliographic search terms (title, author, year)
        </Form.Label>
        <InputGroup className="mb-3">
          <MetadataSearch setTargetWork={setTargetWork} />
        </InputGroup>
        {targetBibliography}
      </>
    );
  }
}

export default AddSearchPane;
