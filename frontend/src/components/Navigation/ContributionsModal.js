import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

import EditRelationModal from "../EditRelationModal/EditRelationModal";

import { client } from "../../feathers";

import { makeCitations } from "../EditRelationModal/StageWork/utilities/citations";

class ContributionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRelations: []
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.getUserRelations(currentUser.id);
  }

  getUserRelations = userId => {
    const relationsService = client.service("relations");

    relationsService
      .find({
        query: {
          $limit: 1000,
          $sort: {
            createdAt: -1
          },
          userId: userId,
          expand: true
        }
      })
      .then(results => {
        const relations = results.data;
        this.setState({ userRelations: relations });
      });
  };

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

  render() {
    const {
      currentUser,
      getRelationColor,
      relataConfig,
      selectWork,
      setStagedAnnotation,
      setStagedRelation,
      showContributionsModal,
      showEditRelationModal,
      stagedAnnotation,
      stagedRelation,
      toggleEditRelationModal,
      toggleContributionsModal
    } = this.props;
    const { userRelations } = this.state;

    let relationListItems;
    if (showContributionsModal && userRelations.length > 0) {
      relationListItems = userRelations.map(relation => {
        const workFrom = {
          ...relation.workFrom,
          ...makeCitations(relation.workFrom)
        };
        const workTo = {
          ...relation.workTo,
          ...makeCitations(relation.workTo)
        };
        const color = getRelationColor(relation.type);
        return (
          <ListGroup.Item
            key={relation.id}
            style={{ borderLeft: `0.25rem solid ${color}` }}
            onClick={() => selectWork(relation.workFrom.id)}
            action
          >
            <span className="align-middle">
              <span className="relation-lead">{relation.type}</span>{" "}
              {workFrom.citation} → {workTo.citation}
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
      });
    } else {
      relationListItems = "";
    }

    return (
      <Modal
        show={showContributionsModal}
        onHide={toggleContributionsModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contributions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You have contributed the following relations. Click to view:</p>
          <Card>
            <ListGroup
              variant="flush"
              style={{ overflow: "scroll", maxHeight: "24rem" }}
            >
              {relationListItems}
            </ListGroup>
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
          </Card>
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
