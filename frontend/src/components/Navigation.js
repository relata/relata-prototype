import React from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fluid="true">
      <Navbar.Brand href="/">Relata</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse>
        <Nav>
          <Nav.Link
            href="https://culanth.org/engagements/relata"
            target="_blank"
          >
            About
          </Nav.Link>
          <Nav.Link
            href="https://culanth.org/engagements/relata"
            target="_blank"
          >
            My Contributions
          </Nav.Link>
          <Nav.Link
            href="https://culanth.org/engagements/relata"
            target="_blank"
          >
            Sign Up
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
