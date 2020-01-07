import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import AddDOI from "./AddDOI";
import Card from "react-bootstrap/Card";

class AddRelationModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.toggleAddRelationModal}
        animation={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Select one of the following methods to add a relation from{" "}
            <b>{this.props.currentWorkCitation}</b>:
          </p>
          <Card>
            <Card.Header>
              <Tabs defaultActiveKey="doi" id="add-relation-tabs">
                <Tab eventKey="doi" title="DOI">
                  <AddDOI
                    currentWorkCitation={this.props.currentWorkCitation}
                  />
                </Tab>
                <Tab eventKey="crossref-search" title="CrossRef Search">
                  <p>hello</p>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={this.props.toggleAddRelationModal}
          >
            Cancel
          </Button>
          <Button
            disabled
            variant="primary"
            onClick={this.props.toggleAddRelationModal}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddRelationModal;
