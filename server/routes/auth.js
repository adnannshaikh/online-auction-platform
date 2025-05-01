const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Item = require("../models/Item");
const Bid = require("../models/bid");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "secret123", { expiresIn: "1d" });
    res.json({ token, username: user.username, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Get items listed by a user
router.get("/profile/:userId", async (req, res) => {
  try {
    const items = await Item.find({ seller: req.params.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// List new item
router.post("/items", async (req, res) => {
  try {
    const { title, description, basePrice, category, image, seller } = req.body;
    const item = await Item.create({ title, description, basePrice, category, image, seller });
    res.status(201).json({ message: "Item listed successfully", item });
  } catch (err) {
    res.status(500).json({ message: "Failed to list item" });
  }
});

// Get item details with bid history
router.get("/item/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId).populate("seller");
    const bids = await Bid.find({ item: itemId }).populate("bidder").sort({ amount: -1 });

    const endTime = new Date(item.createdAt).getTime() + 5 * 60 * 1000;
    let winnerId = null;

    // ⏱ Mark item as sold if auction expired
    if (Date.now() >= endTime && !item.isSold) {
      item.isSold = true;
      await item.save();

      if (bids.length > 0) {
        winnerId = bids[0].bidder?._id?.toString(); // extract top bidder's ID
      }
    }

    res.json({ item, bids, winnerId });
  } catch (err) {
    console.error("❌ Error in /item/:itemId:", err);
    res.status(500).json({ message: "Failed to load item details" });
  }
});


// Submit a new bid
router.post("/item/:itemId/bid", async (req, res) => {
  try {
    const { amount, bidderId } = req.body;
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const existingBids = await Bid.find({ item: itemId }).sort({ amount: -1 });
    const highestBid = existingBids.length ? existingBids[0].amount : 0;
    const minBid = Math.max(item.basePrice, highestBid);

    if (amount <= minBid) {
      return res.status(400).json({ message: `Bid must be higher than ₹${minBid}` });
    }

    const bid = await Bid.create({ amount, bidder: bidderId, item: itemId });

    // No socket: just re-fetch on frontend after this
    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    console.error("❌ Bid failed:", err);
    res.status(500).json({ message: "Failed to place bid" });
  }
});
// Get all available items (not sold)
router.get("/items/available", async (req, res) => {
    try {
      const items = await Item.find({ isSold: false }).sort({ createdAt: -1 });
      res.json(items);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch available items" });
    }
  });
  

module.exports = router;
