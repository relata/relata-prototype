import React from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

const GlossaryModal = props => {
  const {
    getRelationColor,
    relataConfig,
    showGlossaryModal,
    toggleGlossaryModal
  } = props;

  // Populate definitions from relation types in config
  let relationTypes;
  if (relataConfig.types) {
    relationTypes = Object.keys(relataConfig.types)
      .filter(relationType => relationType !== "*")
      .sort();
  } else {
    relationTypes = [];
  }
  const definitions = relationTypes.map(relationType => {
    const definition = relataConfig.types[relationType].definition;
    const color = getRelationColor(relationType);
    return (
      <ListGroup.Item style={{ borderLeft: `0.25rem solid ${color}` }}>
        <b className="relation-lead">{relationType}</b> {definition}
      </ListGroup.Item>
    );
  });

  return (
    <Modal show={showGlossaryModal} onHide={toggleGlossaryModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Glossary</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <ListGroup variant="flush">{definitions}</ListGroup>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={toggleGlossaryModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GlossaryModal;
