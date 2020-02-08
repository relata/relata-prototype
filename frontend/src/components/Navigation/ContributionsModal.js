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

  deleteRelation = async relationId => {
    const relationsService = client.service("relations");
    try {
      // eslint-disable-next-line
      const result = relationsService.remove(relationId);
      this.getUserRelations(1);
    } catch (error) {
      return;
    }
  };

  toggleEditExistingRelationModal = relation => {
    const {
      setStagedRelation,
      stagedRelation,
      toggleEditRelationModal,
      toggleContributionsModal
    } = this.props;
    const { workFrom, workTo } = relation;

    // Add citations to existing works
    const workFromWithCitations = { ...workFrom, ...makeCitations(workFrom) };
    const workToWithCitations = { ...workTo, ...makeCitations(workTo) };

    setStagedRelation({
      ...stagedRelation,
      id: relation.id,
      type: relation.type,
      workFrom: workFromWithCitations,
      workTo: workToWithCitations,
      annotation: relation.annotation
    });

    toggleContributionsModal();
    toggleEditRelationModal();
  };

  render() {
    const {
      getRelationColor,
      relataConfig,
      selectWork,
      setStagedRelation,
      showContributionsModal,
      showEditRelationModal,
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
            action
          >
            <span
              className="align-middle"
              onClick={() => selectWork(relation.workFrom.id)}
            >
              <span className="relation-lead">{relation.type}</span>{" "}
              {workFrom.citation} → {workTo.citation}
            </span>

            <Button
              variant="danger"
              size="sm"
              onClick={() => this.deleteRelation(relation.id)}
            >
              Delete
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => this.toggleEditExistingRelationModal(relation)}
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
              relataConfig={relataConfig}
              selectWork={selectWork}
              setStagedRelation={setStagedRelation}
              showEditRelationModal={showEditRelationModal}
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
