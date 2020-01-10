import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

import AddDOIPane from "./AddDOIPane";

import feathers from "@feathersjs/client";

const app = feathers();
const restClient = feathers.rest();
app.configure(restClient.fetch(window.fetch));
const worksService = app.service("works");

const AddRelationTabs = props => {
  const { currentWorkCitation, setTargetWork, targetWork } = props;
  return (
    <Tab.Container defaultActiveKey="doi">
      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="doi">DOI</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="doi">
              <AddDOIPane
                currentWorkCitation={currentWorkCitation}
                setTargetWork={setTargetWork}
                targetWork={targetWork}
              />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
};

class AddRelationModal extends Component {
  state = { targetWork: null };

  setTargetWork = work => {
    this.setState({ targetWork: work });
  };

  submitRelation = async work => {
    const { toggleAddRelationModal } = this.props;
    const { targetWork } = this.state;

    const payload = { data: targetWork };
    console.log(payload);
    const result = worksService.create(payload);
    toggleAddRelationModal();
  };

  render() {
    const { targetWork } = this.state;
    const { currentWorkCitation, show, toggleAddRelationModal } = this.props;
    return (
      <Modal
        show={show}
        onHide={toggleAddRelationModal}
        animation={true}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are adding a relation to <b>{currentWorkCitation}</b>:
          </p>
          <AddRelationTabs
            currentWorkCitation={currentWorkCitation}
            setTargetWork={this.setTargetWork}
            targetWork={targetWork}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleAddRelationModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.submitRelation}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddRelationModal;
