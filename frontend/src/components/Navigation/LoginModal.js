import React from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const LoginModal = props => {
  const { relataConfig, showLoginModal, toggleLoginModal } = props;

  const loginButtons = relataConfig.oauthProviders
    ? relataConfig.oauthProviders.map(provider => {
        const { id, name, iconClass } = provider;
        // If iconClass is specified in config, use that; if not, default to
        // standard FontAwesome class name pattern. This allows us to include
        // custom icons from Academicons for, e.g., Zotero
        const icon = <i className={iconClass || `fab fa-${id}`}></i>;
        return (
          <Button
            key={id}
            variant="outline-primary"
            href={`/oauth/${id}`}
            block
          >
            {icon} Connect via {name}
          </Button>
        );
      })
    : null;

  return (
    <Modal show={showLoginModal} onHide={toggleLoginModal}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Use one of the following services to sign into Relata:</p>
        {loginButtons}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={toggleLoginModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
