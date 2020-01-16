import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SelectRelationType from "./SelectRelationType";
import StagingSummaryCard from "./StagingSummaryCard";

class AddRelationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stagedWorkFrom: null,
      stagedWorkTo: {},
      stagedRelationType: null,
      stagedAnnotation: null,
      disableSubmit: true
    };
  }

  setInitialState = () => {
    this.setState({
      stagedWorkFrom: null,
      stagedWorkTo: {},
      stagedRelationType: null,
      stagedAnnotation: null,
      disableSubmit: true
    });
  };

  setStagedRelationType = type => {
    this.setState({ stagedRelationType: type });
  };

  setStagedAnnotation = annotation => {
    this.setState({ stagedAnnotation: annotation });
  };

  cancelModal = () => {
    const { toggleAddRelationModal } = this.props;

    // Close modal
    toggleAddRelationModal();

    // Wipe state
    this.setInitialState();

    // Clear inputs
    document.querySelector("#annotation-textarea").value = "";
  };

  render() {
    const {
      currentWork,
      relataConfig,
      show,
      toggleAddRelationModal
    } = this.props;
    const {
      stagedWorkFrom,
      stagedWorkTo,
      stagedRelationType,
      stagedAnnotation,
      disableSubmit
    } = this.state;

    const defaultStagedWorkFrom = stagedWorkFrom || currentWork;

    return (
      <Modal show={show} onHide={toggleAddRelationModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add or Edit Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StagingSummaryCard
            relataConfig={relataConfig}
            stagedWorkFrom={defaultStagedWorkFrom}
            stagedWorkTo={stagedWorkTo}
            stagedRelationType={stagedRelationType}
            stagedAnnotation={stagedAnnotation}
          />
          <SelectRelationType
            relataConfig={relataConfig}
            setStagedRelationType={this.setStagedRelationType}
            setStagedAnnotation={this.setStagedAnnotation}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.cancelModal}>
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
