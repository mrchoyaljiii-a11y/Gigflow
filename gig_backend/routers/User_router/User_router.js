const express = require('express');
const user_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { Fetch_UserDetails,Fetch_FreelancerDetails,Fetch_Freelancer } = require('../../controllers/FetchUser');

// Route to fetch user details
user_router.get('/user/details', authMiddleware, Fetch_UserDetails);

// Route to fetch the freelancers list to show in the find freelancers page
user_router.get('/user/freelancers', authMiddleware, Fetch_FreelancerDetails);

// Route to fetch freelancer by freelancerId { specific freelancer details }
user_router.get('/user/freelancer/:freelancerId', authMiddleware, Fetch_Freelancer);


module.exports = user_router;