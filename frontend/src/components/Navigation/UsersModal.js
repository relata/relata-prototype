import React, { Component } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

import PaginatedResults from "./PaginatedResults";

import { client } from "../../feathers";

class UsersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  deleteUser = userId => {
    const { getUsers } = this.props;

    const usersService = client.service("users");
    usersService.remove(userId).then(result => getUsers());
  };

  makeUserRow = user => {
    const {
      currentUser,
      setStagedUserId,
      setStagedUserPatch,
      toggleUsersModal,
      toggleAccountModal
    } = this.props;
    const adminSummary = user.isAdmin === 1 ? "administrator" : null;
    const userSummary = [user.displayName, user.email, adminSummary]
      .filter(value => value)
      .join(" | ");
    const currentUserNote =
      user.id === currentUser.id ? (
        <>
          {" "}
          <i>(current user)</i>
        </>
      ) : null;
    const deleteButton =
      user.id === currentUser.id ? null : (
        <Button
          className="float-right"
          variant="outline-danger"
          size="sm"
          onClick={() => this.deleteUser(user.id)}
        >
          Delete
        </Button>
      );
    return (
      <ListGroup.Item key={user.id}>
        <span className="align-middle">
          <span className="relation-lead">User {user.id}</span> {userSummary}
          {currentUserNote}
          {deleteButton}
        </span>
      </ListGroup.Item>
    );
  };

  render() {
    const { getUsers, showUsersModal, toggleUsersModal, users } = this.props;

    return (
      <Modal show={showUsersModal} onHide={toggleUsersModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <b>Please note:</b> Deleting a user will also permanently delete all
            relations created by that user. Be careful when deleting users!
          </Alert>
          <PaginatedResults
            message="As an administrator, you can use this interface to review and permanently delete Relata users. The database contains the following users:"
            noResultsMessage="Could not find any users in the Relata database."
            fetchResults={getUsers}
            transformResult={this.makeUserRow}
            results={users}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={toggleUsersModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UsersModal;
