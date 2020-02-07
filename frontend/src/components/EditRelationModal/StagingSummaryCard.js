import React, { Component } from "react";
import indefinite from "indefinite";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class StagingSummaryCard extends Component {
  // Shortcut method to swap workFrom for workTo and vice versa
  swapStagedWorks = () => {
    const { setStagedRelation, stagedRelation } = this.props;
    const { workFrom, workTo } = stagedRelation;
    const newWorks = { workFrom: workTo, workTo: workFrom };
    setStagedRelation({
      ...stagedRelation,
      ...newWorks
    });
  };

  render() {
    const { relataConfig, stagedAnnotation, stagedRelation } = this.props;
    const { type, workFrom, workTo } = stagedRelation;

    // Insert citation if work has been staged, or a blank value if not
    const blankValue = "____________";
    const workFromSummary = workFrom === null ? blankValue : workFrom.citation;
    const workToSummary = workTo === null ? blankValue : workTo.citation;

    // Produce an appropriate string for relation type, using the preposition
    // specified in the Relata config
    const typeValue = type || blankValue;
    const relationConfig = relataConfig.types[type];
    const relationPreposition = relationConfig
      ? relationConfig.preposition
      : "in relation to";
    const relationSummary = `${indefinite(typeValue)} ${relationPreposition}`;

    // If relation has an annotation, include it as a footer
    const annotationFooter = stagedAnnotation ? (
      <Card.Footer>
        <Card.Text className="text-dark">{stagedAnnotation}</Card.Text>
      </Card.Footer>
    ) : null;

    return (
      <Card border="dark">
        <Card.Body>
          <Button
            className="float-right"
            variant="primary"
            size="sm"
            onClick={this.swapStagedWorks}
          >
            Reverse
          </Button>
          {workFromSummary} represents {relationSummary} {workToSummary}.
        </Card.Body>
        {annotationFooter}
      </Card>
    );
  }
}

export default StagingSummaryCard;
