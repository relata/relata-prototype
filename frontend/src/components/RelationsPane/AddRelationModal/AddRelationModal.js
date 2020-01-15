import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import StagingSummaryCard from "./StagingSummaryCard";

class AddRelationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stagedWorkFrom: null,
      stagedWorkTo: {},
      stagedRelation: {},
      disableSubmit: true
    };
  }

  render() {
    const { currentWork, show, toggleAddRelationModal } = this.props;
    const {
      stagedWorkFrom,
      stagedWorkTo,
      stagedRelation,
      disableSubmit
    } = this.state;

    const defaultStagedWorkFrom = stagedWorkFrom || currentWork;

    return (
      <Modal show={show} onHide={toggleAddRelationModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StagingSummaryCard
            stagedWorkFrom={defaultStagedWorkFrom}
            stagedWorkTo={stagedWorkTo}
            stagedRelation={stagedRelation}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleAddRelationModal}>
            Cancel
          </Button>
          <Button
            disabled={disableSubmit}
            style={disableSubmit ? { cursor: "not-allowed" } : {}}
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

export default AddRelationModal;
