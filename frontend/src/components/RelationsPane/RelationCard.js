import React from "react";
import Card from "react-bootstrap/Card";

const RelationCard = props => {
  const { relation, selectWork, onClick } = props;

  let annotation;
  if (relation.annotation) {
    let annotationAuthor = relation.annotationAuthor ? (
      <b className="relation-lead">{relation.annotationAuthor}</b>
    ) : (
      ""
    );
    annotation = (
      <Card.Footer>
        <Card.Text className="text-dark">
          {annotationAuthor} {relation.annotation}
        </Card.Text>
      </Card.Footer>
    );
  } else {
    annotation = "";
  }

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
          <b className="relation-lead">{relation.type}</b>{" "}
          {relation.workTo.bibliography}
        </Card.Text>
      </Card.Body>
      {annotation}
    </Card>
  );
};

export default RelationCard;
