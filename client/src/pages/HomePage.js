import React from "react";
import { Container, Card, Row, Col, Button, Badge, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import dummyItems from "../data/dummyItems";

const HomePage = () => {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">🛒 Available Auctions</h2>
      <Row>
        {dummyItems.map((item) => (
          <Col md={4} className="mb-4" key={item._id}>
            <Card className="h-100 shadow-sm">

              {/* Carousel Preview */}
              {item.images?.length > 0 && (
                <Carousel interval={null} indicators={false}>
                  {item.images.map((img, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={`/images/${img}`}
                        alt={`Slide ${index + 1}`}
                        className="d-block w-100"
                        style={{ height: "200px", objectFit: "cover" }}
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
                  View & Bid (demo)
                </Button>
              </Card.Footer>

            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;
