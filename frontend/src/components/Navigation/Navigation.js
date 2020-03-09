import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import AccountModal from "./AccountModal";
import ContributionsModal from "./ContributionsModal";
import GlossaryModal from "./GlossaryModal";
import LoginModal from "./LoginModal";
import NavSearch from "./NavSearch";
import UsersModal from "./UsersModal";

import { client } from "../../feathers";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContributionsModal: false,
      showGlossaryModal: false,
      showAccountModal: false,
      showLoginModal: false,
      showUsersModal: false,
      stagedUserId: null,
      stagedUserPatch: {},
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
          $limit: 20,
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
          $limit: 20,
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

  setStagedUserId = userId => {
    console.log("Setting staged userId", userId);
    this.setState({ stagedUserId: userId });
    console.log("StagedUserId", this.state.stagedUserId);
  };

  setStagedUserPatch = patch => {
    this.setState({ stagedUserPatch: patch });
  };

  toggleAccountModal = () => {
    const { currentUser } = this.props;
    const { showAccountModal } = this.state;

    if (!showAccountModal) {
      this.setStagedUserPatch({
        displayName: currentUser.displayName,
        email: currentUser.email
      });
    }
    this.setState({
      showAccountModal: !showAccountModal
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

  toggleGlossaryModal = () => {
    const { showGlossaryModal } = this.state;
    this.setState({
      showGlossaryModal: !showGlossaryModal
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
      login,
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
      showGlossaryModal,
      showAccountModal,
      showLoginModal,
      showUsersModal,
      stagedUserPatch,
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
        <Nav.Link
          onClick={() => {
            this.setStagedUserId(currentUser.id);
            this.setStagedUserPatch({
              displayName: currentUser.displayName,
              email: currentUser.email
            });
            this.toggleAccountModal();
          }}
        >
          Account
        </Nav.Link>
        <Nav.Link onClick={this.toggleContributionsModal}>
          Contributions
        </Nav.Link>
        {currentUser.isAdmin === 1 ? (
          <Nav.Link onClick={this.toggleUsersModal}>Users</Nav.Link>
        ) : null}
        <Nav.Link onClick={logout}>Sign Out</Nav.Link>
      </>
    ) : (
      <>
        <Nav.Link onClick={this.toggleLoginModal}>Sign In</Nav.Link>
      </>
    );

    const glossaryModal = (
      <GlossaryModal
        getRelationColor={getRelationColor}
        relataConfig={relataConfig}
        showGlossaryModal={showGlossaryModal}
        toggleGlossaryModal={this.toggleGlossaryModal}
      />
    );

    // Include AccountModal only if user is logged in
    const accountModal = currentUser ? (
      <AccountModal
        currentUser={currentUser}
        login={login}
        relataConfig={relataConfig}
        selectWork={selectWork}
        setStagedUserPatch={this.setStagedUserPatch}
        showAccountModal={showAccountModal}
        stagedUserPatch={stagedUserPatch}
        targetUser={currentUser}
        toggleAccountModal={this.toggleAccountModal}
      />
    ) : null;

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
            <Nav.Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={this.toggleGlossaryModal}
            >
              Glossary
            </Nav.Link>
            {userLinks}
          </Nav>
        </Navbar.Collapse>
        <NavSearch selectWork={selectWork} />
        {glossaryModal}
        {accountModal}
        {contributionsModal}
        {loginModal}
        {contributionsModal}
        {usersModal}
      </Navbar>
    );
  }
}

export default Navigation;
