import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SelectRelationType from "./SelectRelationType";
import StageWork from "./StageWork/StageWork";
import StagingSummaryCard from "./StagingSummaryCard";

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
  submitRelation = async () => {
    const {
      currentWork,
      selectWork,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;
    const { annotation, type, workFrom, workTo } = stagedRelation;

    // Initialize Feathers services
    const worksService = client.service("works");
    const relationsService = client.service("relations");

    // Attempt to submit works and get IDs back
    let workFromResult;
    let workToResult;
    try {
      // If we already know the work is in the backend (it has an ID), skip the
      // API call and just re-use the ID; otherwise, create a new work and
      // obtain the result
      workFromResult = workFrom.id
        ? workFrom
        : await worksService.create(workFrom);
      workToResult = workTo.id ? workTo : await worksService.create(workTo);
    } catch (error) {
      console.log("There was an error:", error);
      return;
    }

    // Construct new relation object to submit
    const relationToSubmit = {
      type: type,
      workFromId: workFromResult.id,
      workToId: workToResult.id,
      annotation: annotation || null,
      annotationAuthor: null,
      userId: 1
    };

    // Determine whether we've modified an existing relation or not
    const updateExistingRelation = stagedRelation.id !== null ? true : false;

    try {
      if (updateExistingRelation) {
        await relationsService.update(stagedRelation.id, relationToSubmit);
      } else {
        await relationsService.create(relationToSubmit);
      }
    } catch (error) {
      return;
    }

    // Since our attempts were successful, we now refresh the graph view and
    // close the modal
    if (
      currentWork.id === workFromResult.id ||
      currentWork.id === workToResult.id
    ) {
      selectWork(currentWork.id);
    } else {
      selectWork(workFromResult.id);
    }
    toggleEditRelationModal();
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
        <Modal.Body>
          <StagingSummaryCard
            relataConfig={relataConfig}
            setStagedRelation={setStagedRelation}
            stagedRelation={stagedRelation}
          />
          <StageWork
            setStagedRelation={setStagedRelation}
            stagedRelation={stagedRelation}
            stagedWorkType="workFrom"
          />
          <SelectRelationType
            relataConfig={relataConfig}
            setStagedRelation={setStagedRelation}
            stagedRelation={stagedRelation}
          />
          <StageWork
            setStagedRelation={setStagedRelation}
            stagedRelation={stagedRelation}
            stagedWorkType="workTo"
          />
        </Modal.Body>
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
