import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SelectRelationType from "../RelationsPane/AddRelationModal/SelectRelationType";
import SelectWork from "../RelationsPane/AddRelationModal/SelectWork/SelectWork";
import StagingSummaryCard from "../RelationsPane/AddRelationModal/StagingSummaryCard";

import client from "../../feathers";

class EditRelationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // Enable submission only when staged relation type and works have been set
  isReadyToSubmit = () => {
    const { stagedRelation } = this.props;

    return (
      stagedRelation.type !== null &&
      stagedRelation.workFrom !== null &&
      stagedRelation.workTo !== null
    );
  };

  // Submit staged works and relation to backend via Feathers client
  submitRelation = () => {
    return;
  };

  render() {
    const {
      relataConfig,
      setStagedRelation,
      showEditRelationModal,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;

    // Set modal title based on whether we are editing an existing relation or
    // adding a new one
    const modalTitle = stagedRelation.id ? "Edit Relation" : "Add Relation";

    // Disable submit button based on whether all required values are set
    const submitDisabled = !this.isReadyToSubmit();

    return (
      <Modal
        show={showEditRelationModal}
        onHide={toggleEditRelationModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Text goes here</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleEditRelationModal}>
            Cancel
          </Button>
          <Button
            disabled={submitDisabled}
            style={submitDisabled ? { cursor: "not-allowed" } : {}}
            variant="primary"
            onClick={this.submitRelation}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditRelationModal;
