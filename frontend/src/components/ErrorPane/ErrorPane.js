import React from "react";

import Alert from "react-bootstrap/Alert";

const ErrorPane = props => {
  if (props.code === 404) {
    return (
      <Alert>
        <Alert.Heading>Not found</Alert.Heading>
      </Alert>
    );
  } else {
    return (
      <Alert>
        <Alert.Heading>Error</Alert.Heading>
      </Alert>
    );
  }
};

export default ErrorPane;
