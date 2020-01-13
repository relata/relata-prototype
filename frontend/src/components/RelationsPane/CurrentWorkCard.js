import React from "react";
import Linkify from "react-linkify";

import Card from "react-bootstrap/Card";

// Workaround to enable Linkify to target _new within React-Bootstrap
// components
const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank">
    {text}
  </a>
);

const CurrentWorkCard = props => {
  const { currentWork } = props;
  return (
    <Card border="dark" className="mb-3">
      <Card.Body>
        <Card.Text>
          <Linkify componentDecorator={componentDecorator}>
            {currentWork.bibliography}
          </Linkify>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CurrentWorkCard;
