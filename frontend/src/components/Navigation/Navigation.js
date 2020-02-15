import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import ContributionsModal from "./ContributionsModal";
import LoginModal from "./LoginModal";
import NavSearch from "./NavSearch";
import UsersModal from "./UsersModal";

import { client } from "../../feathers";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContributionsModal: false,
      showLoginModal: false,
      showUsersModal: false,
      userRelations: {},
      users: {}
    };
  }

  getUserRelations = index => {
    const { currentUser } = this.props;

    const relationsService = client.service("relations");
    relationsService
      .find({
        query: {
          $limit: 50,
          $skip: index,
          $sort: {
            updatedAt: -1
          },
          userId: currentUser.id,
          expand: true
        }
      })
      .then(results => {
        this.setState({ userRelations: results });
      });
  };

  getUsers = index => {
    const { currentUser } = this.props;

    // Check that currentUser is an admin
    if (!(currentUser.isAdmin === 1)) {
      return;
    }

    // Get users
    const usersService = client.service("users");
    usersService
      .find({
        query: {
          $limit: 50,
          $skip: index,
          $sort: {
            id: 1
          }
        }
      })
      .then(results => {
        this.setState({ users: results });
      });
  };

  toggleContributionsModal = () => {
    const { showContributionsModal } = this.state;
    if (!showContributionsModal) {
      this.getUserRelations(0);
    }
    this.setState({
      showContributionsModal: !showContributionsModal
    });
  };

  toggleLoginModal = () => {
    const { showLoginModal } = this.state;
    this.setState({
      showLoginModal: !showLoginModal
    });
  };

  toggleUsersModal = () => {
    const { showUsersModal } = this.state;
    if (!showUsersModal) {
      this.getUsers(0);
    }
    this.setState({
      showUsersModal: !showUsersModal
    });
  };

  render() {
    const {
      currentUser,
      getRelationColor,
      logout,
      relataConfig,
      selectWork,
      setStagedAnnotation,
      setStagedRelation,
      showEditRelationModal,
      stagedAnnotation,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;
    const {
      showContributionsModal,
      showLoginModal,
      showUsersModal,
      userRelations,
      users
    } = this.state;

    const aboutUrl = relataConfig
      ? relataConfig.aboutUrl
      : "https://culanth.org/engagements/relata";

    // Include appropriate navbar links based on whether the user is logged in
    // or not
    const userLinks = currentUser ? (
      <>
        <Nav.Link onClick={this.toggleContributionsModal}>
          My Contributions
        </Nav.Link>
        {currentUser.isAdmin === 1 ? (
          <Nav.Link onClick={this.toggleUsersModal}>Manage Users</Nav.Link>
        ) : null}
        <Nav.Link onClick={logout}>Log Out</Nav.Link>
      </>
    ) : (
      <>
        <Nav.Link onClick={this.toggleLoginModal}>Sign In</Nav.Link>
      </>
    );

    // Include ContributionsModal only if user is logged in
    const contributionsModal = currentUser ? (
      <ContributionsModal
        currentUser={currentUser}
        getRelationColor={getRelationColor}
        getUserRelations={this.getUserRelations}
        relataConfig={relataConfig}
        selectWork={selectWork}
        setStagedAnnotation={setStagedAnnotation}
        setStagedRelation={setStagedRelation}
        showContributionsModal={showContributionsModal}
        showEditRelationModal={showEditRelationModal}
        stagedAnnotation={stagedAnnotation}
        stagedRelation={stagedRelation}
        toggleContributionsModal={this.toggleContributionsModal}
        toggleEditRelationModal={toggleEditRelationModal}
        userRelations={userRelations}
      />
    ) : null;

    // Include LoginModal only if user is not logged in
    const loginModal = currentUser ? null : (
      <LoginModal
        relataConfig={relataConfig}
        showLoginModal={showLoginModal}
        toggleLoginModal={this.toggleLoginModal}
      />
    );

    // Include UsersModal only if user is an administrator
    const usersModal =
      currentUser && currentUser.isAdmin === 1 ? (
        <UsersModal
          currentUser={currentUser}
          getUsers={this.getUsers}
          showUsersModal={showUsersModal}
          toggleUsersModal={this.toggleUsersModal}
          users={users}
        />
      ) : null;

    return (
      <Navbar id="navbar" bg="dark" variant="dark" expand="lg" fluid="true">
        <Button
          className="sr-only sr-only-focusable p-2 pl-3 pr-3"
          variant="light"
          href="#content"
          style={{ position: "absolute" }}
        >
          Skip to main content
        </Button>
        <Navbar.Brand href="/">Relata</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav>
            <Nav.Link href={aboutUrl} target="_blank" rel="noopener noreferrer">
              About
            </Nav.Link>
            {userLinks}
          </Nav>
        </Navbar.Collapse>
        <NavSearch selectWork={selectWork} />
        {contributionsModal}
        {loginModal}
        {usersModal}
      </Navbar>
    );
  }
}

export default Navigation;
