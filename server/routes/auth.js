const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log("📥 Signup request received:", { username, email });
  
      const existing = await User.findOne({ email });
      if (existing) {
        console.log("⚠️ Email already registered");
        return res.status(400).json({ message: "Email already registered" });
      }
  
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashed });
  
      console.log("✅ New user created:", user._id);
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

module.exports = router;
