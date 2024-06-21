const express = require('express');
const router = express.Router();
const { getAllDestination, getDestionationById, getPrice } = require('../features/destination/controller/handler');
const { createTransaction, webhook, getTransaction, getUserTransaction } = require('../features/transaction/controller/handler');
const {  getTicket } = require('../features/ticket/controller/handler');
const { register, login, Verify, getUser, updateUser } = require('../features/users/controller/handler');
const { getReview, createReview } = require('../features/review/controller/handler');
const { authenticateJWT } = require('../helper/jwt');

// Destination Route
router.get('/destinations', getAllDestination);
router.get('/destinations/:id', getDestionationById);

// Transaction Route
router.post('/transactions', authenticateJWT, createTransaction);
router.get('/transactions/:id', authenticateJWT, getTransaction);
router.get('/transactions', authenticateJWT, getUserTransaction);
router.get("/ticket", authenticateJWT, getTicket)

// Midtrans Route
router.post("/midtrans/notification", webhook)

// User Route
router.post("/register", register)
router.post("/login", login)
router.post("/verify", Verify)
router.get("/user", authenticateJWT, getUser)
router.put("/user", authenticateJWT, updateUser)

// Review Route
router.get("/review/:id", getReview)
router.post("/review", authenticateJWT, createReview)


// Price Route
router.get("/price/:id", getPrice)

module.exports = router;
