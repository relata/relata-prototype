import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
      workFrom: relation.workFrom,
      workTo: currentWork
    });

    toggleEditRelationModal();
  };

  render() {
    const { currentUser, relataConfig, relation, selectWork } = this.props;

    // Construct relation lead with tooltip
    let relationLead;
    if (
      relataConfig &&
      relataConfig.types &&
      relataConfig.types[relation.type] &&
      relataConfig.types[relation.type].definition
    ) {
      const definitionTooltip = (
        <Tooltip>{relataConfig.types[relation.type].definition}</Tooltip>
      );
      relationLead = (
        <OverlayTrigger placement="top" overlay={definitionTooltip}>
          <b className="relation-lead">{relation.type}</b>
        </OverlayTrigger>
      );
    } else {
      relationLead = <b className="relation-lead">{relation.type}</b>;
    }

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
        onClick={() => selectWork(relation.workFrom.id)}
        onKeyPress={event => {
          if (event.key === "Enter") {
            selectWork(relation.workFrom.id);
          }
        }}
        style={{ borderLeftColor: relation.color }}
        tabIndex={0}
      >
        <Card.Body>
          <Card.Text>
            {editButton}
            {relationLead}{" "}
            <LinkifyBibliography>
              {relation.workFrom.bibliography}
            </LinkifyBibliography>
          </Card.Text>
        </Card.Body>
        {annotationFooter}
      </Card>
    );
  }
}

export default RelationCard;
