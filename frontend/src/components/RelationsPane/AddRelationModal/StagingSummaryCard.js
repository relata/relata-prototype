import React from "react";
import indefinite from "indefinite";

import Card from "react-bootstrap/Card";

const StagingSummaryCard = props => {
  const {
    relataConfig,
    stagedWorkFrom,
    stagedWorkTo,
    stagedRelationType,
    stagedAnnotation
  } = props;

  const blankValue = "____________";

  const workFromSummary = stagedWorkFrom.citation || blankValue;
  const workToSummary = stagedWorkTo.citation || blankValue;
  const relationType = stagedRelationType || blankValue;
  const relationConfig = relataConfig.types[stagedRelationType];
  const relationPreposition = relationConfig
    ? relationConfig.preposition
    : "in relation to";
  const relationSummary = `${indefinite(relationType)} ${relationPreposition}`;
  const annotationFooter = stagedAnnotation ? (
    <Card.Footer>
      <Card.Text className="text-dark">
        <b className="relation-lead">Username</b> {stagedAnnotation}
      </Card.Text>
    </Card.Footer>
  ) : (
    ""
  );

  return (
    <Card border="dark">
      <Card.Body>
        {workFromSummary} represents {relationSummary} {workToSummary}.
      </Card.Body>
      {annotationFooter}
    </Card>
  );
};

export default StagingSummaryCard;
