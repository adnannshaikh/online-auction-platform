# 🛒 Online Auction Platform

A full-featured web-based auction platform built with the **MERN stack (MongoDB, Express, React, Node.js)**. Users can sign up, list items, place bids in real-time (simulated with countdowns), and get notified of auction wins — all in a clean and responsive UI.

## 🔧 Tech Stack

- **Frontend:** React + Bootstrap
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Authentication:** JWT

---

## 🔑 Features

### 👤 Authentication
- Secure user registration and login
- JWT token-based session storage

### 🛍 Item Listing
- List items with title, price, category, and **multiple image uploads**
- Image carousel on both item and dashboard views

### ⏳ Auctions
- 5-minute countdown timer for each auction
- Users can place bids higher than current highest
- Automatic status change to **Sold** after expiry

### 💰 Bidding System
- Real-time bid history (local + backend)
- Prevents bids lower than the current amount

### 🔔 Notifications
- Users get notified when they **win an auction**
- Notification icon with badge + dropdown
- Full notification center with auction results

### 🌐 Public Listings
- Home page shows all **active auctions**
- Guest users can browse, registered users can bid
