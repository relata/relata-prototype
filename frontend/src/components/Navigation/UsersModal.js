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
    const { currentUser } = this.props;
    const userSummary = [user.displayName, user.email]
      .filter(value => value)
      .join(" | ");
    return (
      <ListGroup.Item key={user.id}>
        <span className="align-middle">
          <span className="relation-lead">User {user.id}</span> {userSummary}
        </span>
        <Button
          className="float-right"
          variant="outline-danger"
          size="sm"
          onClick={() => {
            this.deleteUser(user.id);
          }}
          disabled={user.id === currentUser.id}
          style={user.id === currentUser.id ? { cursor: "not-allowed" } : null}
        >
          Delete
        </Button>
      </ListGroup.Item>
    );
  };

  render() {
    const { getUsers, showUsersModal, toggleUsersModal, users } = this.props;

    return (
      <Modal show={showUsersModal} onHide={toggleUsersModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <b>Warning:</b> Deleting a user will result in the removal not only
            of the user's account but all their relations as well. Be careful
            when deleting!
          </Alert>
          <PaginatedResults
            message="As an administrator, you can use this interface to review and delete Relata users. The database contains the following users:"
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
