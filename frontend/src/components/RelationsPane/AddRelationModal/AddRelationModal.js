import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SelectRelationType from "./SelectRelationType";
import SelectWork from "./SelectWork/SelectWork";
import StagingSummaryCard from "./StagingSummaryCard";

import client from "../../../feathers";

class AddRelationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitialState: true,
      stagedRelationType: null,
      stagedAnnotation: null
    };
  }

  componentDidUpdate() {
    const { show } = this.props;
    const { isInitialState } = this.state;
    if (show && isInitialState) {
      this.setState({ isInitialState: false });
    }
  }

  setInitialState = () => {
    const { setStagedWork } = this.props;
    setStagedWork("workFrom", null);

    this.setState({
      isInitialState: true,
      stagedRelationType: null,
      stagedAnnotation: null
    });
  };

  setStagedRelationType = type => {
    this.setState({ stagedRelationType: type });
  };

  setStagedAnnotation = annotation => {
    this.setState({ stagedAnnotation: annotation });
  };

  // Enable submission when all required properties are populated
  readyToSubmit = () => {
    const { stagedWorkFrom, stagedWorkTo, stagedRelationType } = this.state;

    if (
      stagedWorkFrom !== null &&
      stagedWorkTo !== null &&
      stagedRelationType !== null
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Submit both staged works and the relation to Feathers backend
  submitRelation = async () => {
    const {
      currentWork,
      selectWork,
      stagedWorkFrom,
      stagedWorkTo
    } = this.props;
    const { stagedRelationType, stagedAnnotation } = this.state;

    const worksService = client.service("works");
    const relationsService = client.service("relations");

    // Attempt to submit works; get IDs back
    let workFromResult;
    let workFromId;
    let workToResult;
    let workToId;
    try {
      // If we already know the work is in the backend because it's a /graphs
      // element (i.e., no data property), skip the API call and just grab the
      // ID
      workFromResult = stagedWorkFrom.data
        ? await worksService.create(stagedWorkFrom)
        : stagedWorkFrom;
      workFromId = workFromResult.id;

      workToResult = stagedWorkTo.data
        ? await worksService.create(stagedWorkTo)
        : stagedWorkTo;
      workToId = workToResult.id;
    } catch (error) {
      return;
    }

    // Attempt to submit relation
    const stagedRelation = {
      type: stagedRelationType,
      workFromId: workFromId,
      workToId: workToId,
      annotation: stagedAnnotation || null,
      annotationAuthor: null,
      userId: 1
    };
    try {
      // eslint-disable-next-line
      const relationResult = await relationsService.create(stagedRelation);
    } catch (error) {
      return;
    }

    // Since our attempts were successful, we now refresh the graph view and
    // close the modal
    if (currentWork.id === workFromId || currentWork.id === workToId) {
      selectWork(currentWork.id);
    } else {
      selectWork(workFromId);
    }
    this.cancelModal();
  };

  cancelModal = () => {
    const { toggleAddRelationModal } = this.props;

    // Wipe state
    this.setInitialState();

    // Close modal
    toggleAddRelationModal();
  };

  render() {
    const {
      relataConfig,
      setStagedWork,
      show,
      stagedWorkFrom,
      stagedWorkTo,
      swapStagedWorks
    } = this.props;
    const { stagedRelationType, stagedAnnotation } = this.state;

    const disableSubmit = !this.readyToSubmit();

    return (
      <Modal show={show} onHide={this.cancelModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StagingSummaryCard
            relataConfig={relataConfig}
            stagedWorkFrom={stagedWorkFrom}
            stagedWorkTo={stagedWorkTo}
            stagedRelationType={stagedRelationType}
            stagedAnnotation={stagedAnnotation}
            swapStagedWorks={swapStagedWorks}
          />
          <SelectRelationType
            relataConfig={relataConfig}
            setStagedRelationType={this.setStagedRelationType}
            setStagedAnnotation={this.setStagedAnnotation}
          />
          <SelectWork
            stagedWork={stagedWorkFrom}
            stagedWorkType="workFrom"
            setStagedWork={setStagedWork}
          />
          <SelectWork
            stagedWork={stagedWorkTo}
            stagedWorkType="workTo"
            setStagedWork={setStagedWork}
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
