import React from "react";

import Card from "react-bootstrap/Card";

import LinkifyBibliography from "./LinkifyBibliography";

const CurrentWorkCard = props => {
  const { currentWork } = props;
  return (
    <Card border="dark" className="mb-3">
      <Card.Body>
        <Card.Text>
          <LinkifyBibliography>{currentWork.bibliography}</LinkifyBibliography>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CurrentWorkCard;
