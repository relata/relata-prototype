import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

import EditRelationModal from "../EditRelationModal/EditRelationModal";

import client from "../../feathers";

import { makeCitations } from "../RelationsPane/AddRelationModal/SelectWork/utilities/citations";

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRelations: []
    };
  }

  componentDidMount() {
    this.getUserRelations(1);
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
      toggleSearchModal
    } = this.props;

    toggleSearchModal();

    setStagedRelation({
      ...stagedRelation,
      id: relation.id,
      workFrom: relation.workFrom,
      workTo: relation.workTo,
      annotation: relation.annotation
    });
    toggleEditRelationModal();
  };

  render() {
    const {
      getRelationColor,
      show,
      selectWork,
      setStagedRelation,
      showEditRelationModal,
      stagedRelation,
      toggleEditRelationModal,
      toggleSearchModal
    } = this.props;
    const { userRelations } = this.state;

    let relationListItems;
    if (userRelations.length > 0) {
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
      <Modal show={show} onHide={toggleSearchModal} size="lg">
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
              showEditRelationModal={showEditRelationModal}
              setStagedRelation={setStagedRelation}
              stagedRelation={stagedRelation}
              toggleEditRelationModal={toggleEditRelationModal}
            />
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleSearchModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SearchModal;
