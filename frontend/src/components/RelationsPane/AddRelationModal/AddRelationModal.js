import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SelectRelationType from "./SelectRelationType";
import StagingSummaryCard from "./StagingSummaryCard";

class AddRelationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitialState: true,
      stagedWorkFrom: null,
      stagedWorkTo: null,
      stagedRelationType: null,
      stagedAnnotation: null,
      disableSubmit: true
    };
  }

  componentDidUpdate() {
    const { currentWork } = this.props;
    const { isInitialState, stagedWorkTo } = this.state;
    if (isInitialState & (stagedWorkTo != currentWork)) {
      this.setState({ stagedWorkTo: currentWork, isInitialState: false });
    }
  }

  setInitialState = () => {
    this.setState({
      isInitialState: true,
      stagedWorkFrom: null,
      stagedWorkTo: null,
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

  swapStagedWorks = () => {
    const { stagedWorkFrom, stagedWorkTo } = this.state;
    this.setState({
      stagedWorkFrom: stagedWorkTo,
      stagedWorkTo: stagedWorkFrom
    });
  };

  cancelModal = () => {
    const { toggleAddRelationModal } = this.props;

    // Close modal
    toggleAddRelationModal();

    // Wipe state
    this.setInitialState();
  };

  render() {
    const { relataConfig, show } = this.props;
    const {
      stagedWorkFrom,
      stagedWorkTo,
      stagedRelationType,
      stagedAnnotation,
      disableSubmit
    } = this.state;

    return (
      <Modal show={show} onHide={this.cancelModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit Relation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StagingSummaryCard
            relataConfig={relataConfig}
            stagedWorkFrom={stagedWorkFrom}
            stagedWorkTo={stagedWorkTo}
            stagedRelationType={stagedRelationType}
            stagedAnnotation={stagedAnnotation}
            swapStagedWorks={this.swapStagedWorks}
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
