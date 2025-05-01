import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Badge,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { Bell } from "react-bootstrap-icons";

const Navigation = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const wonItems = JSON.parse(localStorage.getItem("wonItems")) || [];
    setNotifications(wonItems);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Auction Platform</Navbar.Brand>
        <Nav className="ml-auto d-flex align-items-center">
          {isLoggedIn ? (
            <>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/list-item">List Item</Nav.Link>

              {/* 🔔 Notifications Dropdown */}
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle as={Nav.Link} id="notification-dropdown">
                  <Bell />
                  {notifications.length > 0 && (
                    <Badge bg="danger" className="ms-1">
                      {notifications.length}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" style={{ minWidth: "250px" }}>
                  <Dropdown.Header>You Won</Dropdown.Header>
                  {notifications.length === 0 ? (
                    <Dropdown.ItemText className="text-muted">
                      No notifications
                    </Dropdown.ItemText>
                  ) : (
                    notifications.slice(0, 3).map((itemId, idx) => (
                      <Dropdown.Item
                        as={Link}
                        to={`/item/${itemId}`}
                        key={idx}
                        className="text-wrap"
                      >
                        🏆 Item #{itemId.substring(0, 6)}...
                      </Dropdown.Item>
                    ))
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/notifications">View All</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/auth">Login / Signup</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
