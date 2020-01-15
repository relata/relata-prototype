import React from "react";
import indefinite from "indefinite";

import Card from "react-bootstrap/Card";

const StagingSummaryCard = props => {
  const {
    relataConfig,
    stagedWorkFrom,
    stagedWorkTo,
    stagedRelationType
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

  return (
    <Card>
      <Card.Body>
        {workFromSummary} represents {relationSummary} {workToSummary}.
      </Card.Body>
    </Card>
  );
};

export default StagingSummaryCard;
