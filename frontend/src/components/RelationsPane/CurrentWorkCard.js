import React from "react";

import Card from "react-bootstrap/Card";

const CurrentWorkCard = props => {
  const { currentWork } = props;
  return (
    <Card border="dark" className="mb-3">
      <Card.Body>
        <Card.Text>{currentWork.bibliography}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CurrentWorkCard;
