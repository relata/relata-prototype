import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

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
      const result = relationsService.remove(relationId);
      this.getUserRelations(1);
    } catch (error) {
      return;
    }
  };

  cancelModal = () => {
    const { toggleSearchModal } = this.props;

    // Close modal
    toggleSearchModal();
  };

  render() {
    const { relataConfig, show, selectWork } = this.props;
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
        let color;
        if (relataConfig.types) {
          const typeConfig = relataConfig.types[relation.type];
          if (typeConfig) {
            color = typeConfig.color;
          } else {
            color = "";
          }
        }
        return (
          <ListGroup.Item
            key={relation.id}
            onClick={() => selectWork(relation.workFrom.id)}
            style={{ borderLeft: `0.25rem solid ${color}` }}
            action
          >
            <Button
              variant="danger"
              className="float-right"
              size="sm"
              onClick={() => this.deleteRelation(relation.id)}
            >
              Delete
            </Button>
            <span className="align-middle">
              <span className="relation-lead">{relation.type}</span>{" "}
              {workFrom.citation} → {workTo.citation}
            </span>
          </ListGroup.Item>
        );
      });
    } else {
      relationListItems = "";
    }

    return (
      <Modal show={show} onHide={this.cancelModal} size="lg">
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
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={this.cancelModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default SearchModal;
