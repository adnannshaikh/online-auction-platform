import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, [userId]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Listed Items</h2>
      <Row>
        {items.length === 0 ? (
          <p>No items listed yet.</p>
        ) : (
          items.map((item) => (
            <Col md={4} className="mb-3" key={item._id}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/item/${item._id}`} className="text-decoration-none text-primary">
                      {item.title}
                    </Link>
                  </Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>Price: ₹{item.basePrice}</Card.Text>
                  <Badge bg={item.isSold ? "success" : "warning"}>
                    {item.isSold ? "Sold" : "Available"}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default DashboardPage;
