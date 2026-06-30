const express = require('express');
const user_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { Fetch_UserDetails } = require('../../controllers/FetchUser');

// Route to fetch user details
user_router.get('/user/details', authMiddleware, Fetch_UserDetails);




module.exports = user_router;