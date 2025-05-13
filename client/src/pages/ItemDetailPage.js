import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  Form,
  Button,
  Badge,
  ListGroup,
  Carousel,
  Toast,
  ToastContainer
} from "react-bootstrap";
import dummyItems from "../data/dummyItems";

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("00:00");
  const [showToast, setShowToast] = useState(false);
  const userId = localStorage.getItem("userId") || "guest";
  const isLoggedIn = !!localStorage.getItem("token");
  const isDummy = id.startsWith("item");

  useEffect(() => {
    let countdownInterval;

    if (isDummy) {
      const dummy = dummyItems.find((d) => d._id === id);
      setItem(dummy);
      const localBids = JSON.parse(localStorage.getItem(`bids_${id}`)) || [];
      setBids(localBids);
      countdownInterval = setInterval(() => updateCountdown(dummy), 1000);
    } else {
      fetchItem();
      countdownInterval = setInterval(() => updateCountdown(), 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/item/${id}`);
      setItem(res.data.item);
      setBids(res.data.bids);
      updateCountdown(res.data.item, res.data.winnerId);
    } catch (err) {
      console.error("Error fetching item:", err);
    }
  };

  const updateCountdown = (itemData = item, winnerId = null) => {
    if (!itemData) return;
    const endTime = new Date(itemData.createdAt).getTime() + 5 * 60 * 1000;
    const now = Date.now();
    const diff = endTime - now;

    if (diff <= 0 && !itemData.isSold) {
      setItem({ ...itemData, isSold: true });
      const topBid = bids[0];
      const topBidderId = topBid?.bidderId || topBid?.bidder?._id;
      if (winnerId && topBidderId === userId) {
        const wonItems = JSON.parse(localStorage.getItem("wonItems")) || [];
        if (!wonItems.includes(itemData._id)) {
          wonItems.push(itemData._id);
          localStorage.setItem("wonItems", JSON.stringify(wonItems));
        }
      }
    }

    const mins = Math.max(0, Math.floor(diff / 60000));
    const secs = Math.max(0, Math.floor((diff % 60000) / 1000));
    setTimeLeft(`${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please login to place a bid.");
      return;
    }

    const amount = parseFloat(bidAmount);
    const highest = bids[0]?.amount || item.basePrice;
    if (amount <= highest) {
      alert(`Bid must be higher than ₹${highest}`);
      return;
    }

    if (isDummy) {
      const newBid = {
        amount,
        bidderId: userId,
        timestamp: new Date().toISOString(),
      };
      const updated = [newBid, ...bids];
      setBids(updated);
      localStorage.setItem(`bids_${id}`, JSON.stringify(updated));
      setShowToast(true);
      setBidAmount("");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/item/${id}/bid`, {
        amount,
        bidderId: userId,
      });
      setShowToast(true);
      setBidAmount("");
      fetchItem();
    } catch (err) {
      alert(err.response?.data?.message || "Bid failed");
    }
  };

  if (!item) return <p className="text-center mt-5">Item not found.</p>;

  return (
    <Container className="mt-4">
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() =>
          navigate(location.state?.from === "browse" ? "/browse" : "/dashboard")
        }
      >
        ← Back to {location.state?.from === "browse" ? "Browse" : "Dashboard"}
      </Button>

      <Card className="p-4 shadow">
        {item.images?.length > 0 ? (
          <Carousel className="mb-4">
            {item.images.map((img, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={`/images/${img}`}
                  alt={`Slide ${index + 1}`}
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <img
            src="/images/placeholder.jpg"
            alt="No image"
            className="mb-4 w-100"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}

        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Base Price:</strong> ₹{item.basePrice}</p>
        <p>
          <strong>Status:</strong>{" "}
          <Badge bg={item.isSold ? "success" : "warning"}>
            {item.isSold ? "Sold" : "Available"}
          </Badge>
        </p>
        <p><strong>Time Left:</strong> {timeLeft}</p>

        {!item.isSold && (
          <Form onSubmit={handleBidSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Place Your Bid</Form.Label>
              <Form.Control
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="success">Submit Bid</Button>
          </Form>
        )}

        <hr />
        <h5>Bid History</h5>
        <ListGroup>
          {bids.length === 0 ? (
            <p>No bids yet</p>
          ) : (
            bids.map((bid, index) => (
              <ListGroup.Item key={index}>
                ₹{bid.amount} by {bid.bidderId || bid.bidder?.username || "Unknown"} at{" "}
                {new Date(bid.timestamp || bid.createdAt).toLocaleTimeString()}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="success"
          delay={2500}
          autohide
        >
          <Toast.Body className="text-white">✅ Bid placed successfully!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ItemDetailPage;
