// src/pages/BrowseItemsPage.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const BrowseItemsPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
  const fetchAvailableItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/items/available");
      setItems(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch available items", err);
    }
  };

  fetchAvailableItems();
}, []);


  return (
    <Container className="mt-4">
      <h2 className="mb-4">🔍 Browse Ongoing Auctions</h2>
      <Row>
        {items.map((item) => (
          <Col md={4} className="mb-4" key={item._id}>
            <Card className="h-100 shadow-sm">
              {item.images?.length > 0 && (
                <Carousel interval={null} indicators={false} className="border-bottom">
                  {item.images.map((img, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        src={`/images/${img}`}
                        alt={`Slide ${idx + 1}`}
                        className="d-block w-100"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}

              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Base Price:</strong> ₹{item.basePrice}</p>
                <Badge bg="warning">Available</Badge>
              </Card.Body>

              <Card.Footer>
                <Button as={Link} to={`/item/${item._id}`} variant="primary" className="w-100">
                  View & Bid
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BrowseItemsPage;
