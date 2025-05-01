import React, { useEffect, useState } from "react";
import { Container, Card, ListGroup, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const wonItemIds = JSON.parse(localStorage.getItem("wonItems")) || [];

    const fetchWonItems = async () => {
      try {
        const promises = wonItemIds.map((id) =>
          axios.get(`/api/auth/item/${id}`)
        );
        const results = await Promise.all(promises);
        const wonItems = results.map((res) => res.data.item);
        setItems(wonItems);
      } catch (err) {
        console.error("Error fetching won items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWonItems();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">🔔 Your Auction Wins</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : items.length === 0 ? (
        <p>You have no notifications yet.</p>
      ) : (
        <ListGroup>
          {items.map((item, idx) => (
            <ListGroup.Item key={`${item._id}-${idx}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>
                    🏆 You won{" "}
                    <Link to={`/item/${item._id}`} className="text-decoration-underline">
                      {item.title}
                    </Link>
                  </h5>
                  <p className="mb-0">Base Price: ₹{item.basePrice}</p>
                  <p className="mb-0 text-muted">
                    Auction Ended: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge bg="success" pill>
                  Sold
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default NotificationPage;
