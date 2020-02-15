import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import parseISO from "date-fns/parseISO";

import EditRelationModal from "../EditRelationModal/EditRelationModal";
import PaginatedResults from "./PaginatedResults";

import { makeCitations } from "../EditRelationModal/StageWork/utilities/citations";

class ContributionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleEditExistingRelationModal = relation => {
    const {
      setStagedAnnotation,
      setStagedRelation,
      stagedRelation,
      toggleEditRelationModal,
      toggleContributionsModal
    } = this.props;
    const { workFrom, workTo } = relation;

    // Add citations to existing works
    const workFromWithCitations = { ...workFrom, ...makeCitations(workFrom) };
    const workToWithCitations = { ...workTo, ...makeCitations(workTo) };

    // We have to handle annotation separately to provide performant live
    // updating in SelectRelationType
    setStagedAnnotation(relation.annotation);
    setStagedRelation({
      ...stagedRelation,
      id: relation.id,
      type: relation.type,
      workFrom: workFromWithCitations,
      workTo: workToWithCitations
    });

    toggleContributionsModal();
    toggleEditRelationModal();
  };

  makeContributionRow = relation => {
    const { getRelationColor, selectWork } = this.props;

    const workFrom = {
      ...relation.workFrom,
      ...makeCitations(relation.workFrom)
    };
    const workTo = {
      ...relation.workTo,
      ...makeCitations(relation.workTo)
    };
    const color = getRelationColor(relation.type);
    const updatedDate = parseISO(relation.updatedAt);
    const updatedSummary =
      "Updated " + formatDistanceToNow(updatedDate, { addSuffix: true });
    const updatedTitle = format(updatedDate, "PPPPp");
    return (
      <ListGroup.Item
        key={relation.id}
        className="paginated-results-item"
        style={{
          borderLeft: `0.25rem solid ${color}`
        }}
        onClick={() => selectWork(relation.workFrom.id)}
        action
      >
        <span className="align-middle">
          <span className="mr-2">
            <span className="relation-lead">{relation.type}</span>{" "}
            {workFrom.citation} → {workTo.citation}
          </span>{" "}
          <span className="text-muted" title={updatedTitle}>
            {updatedSummary}
          </span>
        </span>
        <Button
          className="float-right"
          variant="success"
          size="sm"
          onClick={event => {
            event.stopPropagation();
            this.toggleEditExistingRelationModal(relation);
          }}
        >
          Edit
        </Button>
      </ListGroup.Item>
    );
  };

  render() {
    const {
      currentUser,
      getUserRelations,
      relataConfig,
      selectWork,
      setStagedAnnotation,
      setStagedRelation,
      showContributionsModal,
      showEditRelationModal,
      stagedAnnotation,
      stagedRelation,
      toggleEditRelationModal,
      toggleContributionsModal,
      userRelations
    } = this.props;

    return (
      <Modal
        show={showContributionsModal}
        onHide={toggleContributionsModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>My Contributions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaginatedResults
            message="You have contributed the following relations to Relata. Click on a relation to view it:"
            noResultsMessage="You have not yet contributed any relations to Relata."
            fetchResults={getUserRelations}
            transformResult={this.makeContributionRow}
            results={userRelations}
          />
          <EditRelationModal
            currentUser={currentUser}
            relataConfig={relataConfig}
            selectWork={selectWork}
            setStagedAnnotation={setStagedAnnotation}
            setStagedRelation={setStagedRelation}
            showEditRelationModal={showEditRelationModal}
            stagedAnnotation={stagedAnnotation}
            stagedRelation={stagedRelation}
            toggleEditRelationModal={toggleEditRelationModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={toggleContributionsModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ContributionsModal;
