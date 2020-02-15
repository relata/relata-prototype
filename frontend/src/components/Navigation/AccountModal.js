import React, { Component } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

import * as EmailValidator from "email-validator";

import { client } from "../../feathers";

class AccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
  }

  patchUser = () => {
    const {
      login,
      selectWork,
      stagedUserPatch,
      targetUser,
      toggleAccountModal
    } = this.props;

    this.setState({ isSubmitting: true });
    const usersService = client.service("users");
    usersService.patch(targetUser.id, stagedUserPatch).then(() => {
      // Refresh login to update currentUser with updated displayName/email
      login(true);
      selectWork();
      toggleAccountModal();
      this.setState({ isSubmitting: false });
    });
  };

  deleteUser = () => {
    const { targetUser, toggleAccountModal } = this.props;

    this.setState({ isSubmitting: true });
    const usersService = client.service("users");
    usersService.remove(targetUser.id).then(() => {
      toggleAccountModal();
      this.setState({ isSubmitting: false });
    });
  };

  handleChange = event => {
    const { setStagedUserPatch, stagedUserPatch } = this.props;
    const targetMappings = {
      "account-display-name-input": "displayName",
      "account-email-input": "email"
    };
    const value = event.target.value.trim();
    const attribute = targetMappings[event.target.id];
    const newValue = value ? value : null;
    const patch = {
      ...stagedUserPatch,
      [attribute]: newValue
    };
    setStagedUserPatch(patch);
  };

  isEmailValid = () => {
    const { stagedUserPatch } = this.props;
    return (
      EmailValidator.validate(stagedUserPatch.email) || !stagedUserPatch.email
    );
  };

  // Enable submission only when fields are populated and valid
  isReadyToSubmit = () => {
    const { currentUser, stagedUserPatch } = this.props;

    const patchIsIdenticalToCurrentUser =
      currentUser.displayName === stagedUserPatch.displayName &&
      currentUser.email === stagedUserPatch.email;

    return (
      stagedUserPatch.displayName &&
      this.isEmailValid() &&
      !patchIsIdenticalToCurrentUser
    );
  };

  render() {
    const {
      showAccountModal,
      relataConfig,
      stagedUserPatch,
      targetUser,
      toggleAccountModal
    } = this.props;
    const { isSubmitting } = this.state;

    // Summarize which OAuth providers are used for authentication. In almost
    // all cases this will be a single provider, but it's theoretically
    // possible that, e.g., an administrator might add multiple OAuth provider
    // IDs to a user record manually via the database and so allow multiple
    // providers for a single user
    const oauthProvidersUsed = relataConfig.oauthProviders
      ? relataConfig.oauthProviders
          .filter(provider => {
            return targetUser[`${provider.id}Id`] !== null;
          })
          .map(provider => provider.name)
          .join(" and ")
      : [];
    const oauthSummary =
      oauthProvidersUsed.length > 0 ? (
        <p>This account authenticates via {oauthProvidersUsed}.</p>
      ) : null;

    // Disable submit button based on whether all required values are set
    const submitDisabled = !this.isReadyToSubmit();

    return (
      <Modal show={showAccountModal} onHide={toggleAccountModal} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {oauthSummary}
          <label
            id="account-display-name-input-label"
            htmlFor="account-display-name-input"
          >
            Display Name
          </label>
          <InputGroup className="mb-3">
            <FormControl
              id="account-display-name-input"
              aria-describedby="account-display-name-input-label"
              defaultValue={stagedUserPatch.displayName}
              placeholder="Name to display on annotations"
              maxLength={100}
              onChange={this.handleChange}
            />
          </InputGroup>
          <label id="account-email-input-label" htmlFor="account-email-input">
            Email <i>(optional)</i>
          </label>
          <InputGroup className="mb-3">
            <FormControl
              id="account-email-input"
              aria-describedby="account-email-input-label"
              isInvalid={!this.isEmailValid()}
              defaultValue={stagedUserPatch.email}
              placeholder="Enter a valid email, e.g., first.last@domain.edu"
              maxLength={100}
              onChange={this.handleChange}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleAccountModal}>
            Cancel
          </Button>
          <Button
            disabled={submitDisabled || isSubmitting}
            style={
              submitDisabled || isSubmitting ? { cursor: "not-allowed" } : {}
            }
            variant="primary"
            onClick={this.patchUser}
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AccountModal;
