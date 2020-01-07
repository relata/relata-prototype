import React from "react";

import Card from "react-bootstrap/Card";

const CurrentWorkCard = props => {
  const { currentWorkBibliography } = props;
  return (
    <Card border="dark" className="mb-3">
      <Card.Body>
        <Card.Text>{currentWorkBibliography}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CurrentWorkCard;
