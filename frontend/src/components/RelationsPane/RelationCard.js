import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import LinkifyBibliography from "./LinkifyBibliography";

class RelationCard extends Component {
  toggleEditExistingRelationModal = relation => {
    const {
      currentWork,
      setStagedAnnotation,
      setStagedRelation,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;

    // We have to handle annotation separately to provide performant live
    // updating in SelectRelationType
    setStagedAnnotation(relation.annotation);
    setStagedRelation({
      ...stagedRelation,
      id: relation.id,
      type: relation.type,
      workFrom: currentWork,
      workTo: relation.workTo
    });

    toggleEditRelationModal();
  };

  render() {
    const { currentUser, relation, selectWork } = this.props;

    // Construct annotation footer if this relation has an annotation
    const annotationAuthor =
      relation.annotationAuthor ||
      relation.user.displayName ||
      "Anonymous User";
    const annotationFooter = relation.annotation ? (
      <Card.Footer>
        <Card.Text className="text-dark">
          <b className="relation-lead">{annotationAuthor}</b>{" "}
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
            <LinkifyBibliography>
              {relation.workTo.bibliography}
            </LinkifyBibliography>
          </Card.Text>
        </Card.Body>
        {annotationFooter}
      </Card>
    );
  }
}

export default RelationCard;
