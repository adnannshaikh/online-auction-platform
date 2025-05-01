import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Auction Platform</Navbar.Brand>
        <Nav className="ml-auto d-flex align-items-center">
          <Nav.Link as={Link} to="/auth">Login / Signup</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
