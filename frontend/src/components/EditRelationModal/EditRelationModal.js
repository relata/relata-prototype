import React, { Component } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SelectRelationType from "./SelectRelationType";
import StageWork from "./StageWork/StageWork";
import StagingSummaryCard from "./StagingSummaryCard";

import { client } from "../../feathers";

class EditRelationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false
    };
  }

  componentDidMount() {
    this.setState({ isSubmitting: false });
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

  // Permanently delete existing relation
  deleteRelation = async () => {
    const { selectWork, stagedRelation, toggleEditRelationModal } = this.props;

    // If this is being called without an existing relation, for some reason,
    // just return
    if (!stagedRelation.id) {
      return;
    }

    // Remove relation, close modal, and refresh graph by reselecting
    // currentWork
    const relationsService = client.service("relations");
    try {
      // eslint-disable-next-line
      await relationsService.remove(stagedRelation.id);
      toggleEditRelationModal();
      selectWork();
    } catch (error) {
      return;
    }
  };

  // Submit staged works and relation to backend via Feathers client
  submitRelation = async () => {
    const {
      currentUser,
      currentWork,
      selectWork,
      stagedAnnotation,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;
    const { type, workFrom, workTo } = stagedRelation;

    // Set isSubmitting to disable Submit button (prevents accidental multiple
    // submissions)
    this.setState({ isSubmitting: true });

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
      this.setState({ isSubmitting: false });
      return;
    }

    // Construct new relation object to submit
    const relationToSubmit = {
      type: type,
      workFromId: workFromResult.id,
      workToId: workToResult.id,
      annotation: stagedAnnotation,
      annotationAuthor: null,
      userId: currentUser.id
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
      console.log("There was an error:", error);
      this.setState({ isSubmitting: false });
      return;
    }

    // Since our attempts were successful, we now refresh the graph view and
    // close the modal
    if (
      currentWork.id === workFromResult.id ||
      currentWork.id === workToResult.id
    ) {
      selectWork();
    } else {
      selectWork(workToResult.id);
    }
    toggleEditRelationModal();
    this.setState({ isSubmitting: false });
  };

  render() {
    const {
      currentUser,
      relataConfig,
      setStagedAnnotation,
      setStagedRelation,
      showEditRelationModal,
      stagedAnnotation,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;
    const { isSubmitting } = this.state;

    // Set modal title based on whether we are editing an existing relation or
    // adding a new one
    const modalTitle = stagedRelation.id ? "Edit Relation" : "Add Relation";

    // Add alert when editing an existing relation
    const editingExistingAlert = stagedRelation.id ? (
      <Alert variant="warning" className="align-middle">
        <Button
          className="float-right align-middle ml-1 mb-1"
          variant="outline-danger"
          onClick={this.deleteRelation}
        >
          Delete
        </Button>
        <b>Please note:</b> You are editing an existing relation. To permanently
        delete this relation from Relata, click the Delete button at right.
      </Alert>
    ) : null;

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
          {editingExistingAlert}
          <StagingSummaryCard
            currentUser={currentUser}
            relataConfig={relataConfig}
            setStagedAnnotation={setStagedAnnotation}
            setStagedRelation={setStagedRelation}
            stagedAnnotation={stagedAnnotation}
            stagedRelation={stagedRelation}
          />
          <StageWork
            setStagedRelation={setStagedRelation}
            stagedRelation={stagedRelation}
            stagedWorkType="workFrom"
          />
          <SelectRelationType
            relataConfig={relataConfig}
            setStagedAnnotation={setStagedAnnotation}
            setStagedRelation={setStagedRelation}
            stagedAnnotation={stagedAnnotation}
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
            disabled={submitDisabled || isSubmitting}
            style={
              submitDisabled || isSubmitting ? { cursor: "not-allowed" } : {}
            }
            variant="primary"
            onClick={this.submitRelation}
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditRelationModal;
