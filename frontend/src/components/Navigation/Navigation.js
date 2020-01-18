import React, { Component } from "react";

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
    const { relataConfig, selectWork } = this.props;

    return (
      <Navbar bg="dark" variant="dark" expand="lg" fluid="true">
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
          relataConfig={relataConfig}
          selectWork={selectWork}
          toggleSearchModal={this.toggleSearchModal}
        />
      </Navbar>
    );
  }
}

export default Navigation;
