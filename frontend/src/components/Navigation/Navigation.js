import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import NavSearch from "./NavSearch";
import ContributionsModal from "./ContributionsModal";

import { client } from "../../feathers";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { showContributionsModal: false };
  }

  toggleContributionsModal = () => {
    const { showContributionsModal } = this.state;
    this.setState({
      showContributionsModal: !showContributionsModal
    });
  };

  render() {
    const {
      currentUser,
      getRelationColor,
      logout,
      relataConfig,
      selectWork,
      setStagedRelation,
      showEditRelationModal,
      stagedRelation,
      toggleEditRelationModal
    } = this.props;
    const { showContributionsModal } = this.state;

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
        <Nav.Link href="/oauth/github">Login via GitHub</Nav.Link>
        <Nav.Link href="/oauth/google">Login via Google</Nav.Link>
      </>
    );

    // Include ContributionsModal based on whether the user is logged in or not
    const contributionsModal = currentUser ? (
      <ContributionsModal
        currentUser={currentUser}
        getRelationColor={getRelationColor}
        relataConfig={relataConfig}
        selectWork={selectWork}
        setStagedRelation={setStagedRelation}
        showContributionsModal={showContributionsModal}
        showEditRelationModal={showEditRelationModal}
        stagedRelation={stagedRelation}
        toggleContributionsModal={this.toggleContributionsModal}
        toggleEditRelationModal={toggleEditRelationModal}
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
            <Nav.Link
              href="https://culanth.org/engagements/relata"
              target="_blank"
              rel="noopener noreferrer"
            >
              About
            </Nav.Link>
            {userLinks}
          </Nav>
        </Navbar.Collapse>
        <NavSearch selectWork={selectWork} />
        {contributionsModal}
      </Navbar>
    );
  }
}

export default Navigation;
