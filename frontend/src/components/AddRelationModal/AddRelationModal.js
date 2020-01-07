import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import AddCrossRefPane from "./AddCrossRefPane";
import AddDOIPane from "./AddDOIPane";

const AddRelationTabs = props => {
  const { currentWorkCitation } = props;
  return (
    <Tab.Container defaultActiveKey="doi">
      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="doi">DOI</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="crossref-search">CrossRef Search</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="doi">
              <AddDOIPane currentWorkCitation={currentWorkCitation} />
            </Tab.Pane>
            <Tab.Pane eventKey="crossref-search">
              <AddCrossRefPane currentWorkCitation={currentWorkCitation} />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
};

class AddRelationModal extends Component {
  render() {
    const { currentWorkCitation, show, toggleAddRelationModal } = this.props;
    return (
      <Modal
        show={show}
        onHide={toggleAddRelationModal}
        animation={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Select a method to add a relation from <b>{currentWorkCitation}</b>:
          </p>
          <AddRelationTabs currentWorkCitation={currentWorkCitation} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleAddRelationModal}>
            Cancel
          </Button>
          <Button disabled variant="primary" onClick={toggleAddRelationModal}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddRelationModal;
