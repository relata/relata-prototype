import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import CurrentWorkCard from "./CurrentWorkCard";

class AddRelationModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.toggleAddRelationModal}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are adding a relation to the following work:</p>
          <CurrentWorkCard currentWork={this.props.currentWork} />
          <p></p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={this.props.toggleAddRelationModal}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={this.props.toggleAddRelationModal}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddRelationModal;
