import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import SearchModal from "./SearchModal";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { searchModalIsOpen: false };
  }

  toggleSearchModal = () => {
    const { searchModalIsOpen } = this.state;
    this.setState({
      searchModalIsOpen: !searchModalIsOpen
    });
  };

  render() {
    const { searchModalIsOpen } = this.state;
    const { getRelationColor, selectWork } = this.props;

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
            <Nav.Link onClick={this.toggleSearchModal}>
              My Contributions
            </Nav.Link>
            <Nav.Link target="_blank">Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <SearchModal
          show={searchModalIsOpen}
          getRelationColor={getRelationColor}
          selectWork={selectWork}
          toggleSearchModal={this.toggleSearchModal}
        />
      </Navbar>
    );
  }
}

export default Navigation;
