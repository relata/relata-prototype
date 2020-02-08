import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class RelationCard extends Component {
  toggleEditExistingRelationModal = relation => {
    const {
      currentWork,
      setStagedRelation,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;

    setStagedRelation({
      ...stagedRelation,
      id: relation.id,
      type: relation.type,
      workFrom: currentWork,
      workTo: relation.workTo,
      annotation: relation.annotation
    });

    toggleEditRelationModal();
  };

  render() {
    const { currentUser, relation, selectWork } = this.props;

    // Construct annotation footer if this relation has an annotation
    const annotationFooter = relation.annotation ? (
      <Card.Footer>
        <Card.Text className="text-dark">
          <b className="relation-lead">
            {relation.annotationAuthor || relation.user.id}
          </b>{" "}
          {relation.annotation}
        </Card.Text>
      </Card.Footer>
    ) : null;

    // If this relation is owned by currentUser, add an Edit button
    const editButton =
      currentUser && relation.user.id === currentUser.id ? (
        <Button
          className="float-right ml-2 mb-2"
          variant="success"
          onClick={event => {
            event.stopPropagation();
            this.toggleEditExistingRelationModal(relation);
          }}
        >
          Edit
        </Button>
      ) : null;

    return (
      <Card
        className="relation-card mt-3"
        onClick={() => selectWork(relation.workTo.id)}
        onKeyPress={event => {
          if (event.key === "Enter") {
            selectWork(relation.workTo.id);
          }
        }}
        style={{ borderLeftColor: relation.color }}
        tabIndex={0}
      >
        <Card.Body>
          <Card.Text>
            {editButton}
            <b className="relation-lead">{relation.type}</b>{" "}
            {relation.workTo.bibliography}
          </Card.Text>
        </Card.Body>
        {annotationFooter}
      </Card>
    );
  }
}

export default RelationCard;
