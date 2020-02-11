import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import NavSearch from "./NavSearch";
import ContributionsModal from "./ContributionsModal";
import LoginModal from "./LoginModal";

import { client } from "../../feathers";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRelations: [],
      showContributionsModal: false,
      showLoginModal: false
    };
  }

  getUserRelations = userId => {
    const relationsService = client.service("relations");

    relationsService
      .find({
        query: {
          $limit: 10000,
          $sort: {
            type: 1
          },
          userId: userId,
          expand: true
        }
      })
      .then(results => {
        const relations = results.data;
        this.setState({ userRelations: relations });
      });
  };

  toggleContributionsModal = () => {
    const { currentUser } = this.props;
    const { showContributionsModal } = this.state;
    if (!showContributionsModal) {
      this.getUserRelations(currentUser.id);
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
      userRelations
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
      </Navbar>
    );
  }
}

export default Navigation;
