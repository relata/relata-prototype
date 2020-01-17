import React from "react";
import indefinite from "indefinite";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const StagingSummaryCard = props => {
  const {
    relataConfig,
    stagedWorkFrom,
    stagedWorkTo,
    stagedRelationType,
    stagedAnnotation,
    swapStagedWorks
  } = props;

  const blankValue = "____________";

  const workFromSummary =
    stagedWorkFrom === null ? blankValue : stagedWorkFrom.citation;
  const workToSummary =
    stagedWorkTo === null ? blankValue : stagedWorkTo.citation;
  const relationType = stagedRelationType || blankValue;
  const relationConfig = relataConfig.types[stagedRelationType];
  const relationPreposition = relationConfig
    ? relationConfig.preposition
    : "in relation to";
  const relationSummary = `${indefinite(relationType)} ${relationPreposition}`;
  const annotationFooter = stagedAnnotation ? (
    <Card.Footer>
      <Card.Text className="text-dark">{stagedAnnotation}</Card.Text>
    </Card.Footer>
  ) : (
    ""
  );

  return (
    <Card border="dark">
      <Card.Body>
        {workFromSummary} represents {relationSummary} {workToSummary}.
        <Button
          className="float-right"
          variant="primary"
          size="sm"
          onClick={swapStagedWorks}
        >
          Reverse
        </Button>
      </Card.Body>
      {annotationFooter}
    </Card>
  );
};

export default StagingSummaryCard;
