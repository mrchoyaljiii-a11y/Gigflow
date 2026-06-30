const express = require('express');
const Freelancer_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {Fetch_FreelancerDetails ,Fetch_Freelancer} = require('../../controllers/Freelancer_controller');

// Route to fetch the freelancers list to show in the find freelancers page
Freelancer_router.get('/user/freelancers', authMiddleware, Fetch_FreelancerDetails);

// Route to fetch freelancer by freelancerId { specific freelancer details }
Freelancer_router.get('/user/freelancer/:freelancerId', authMiddleware, Fetch_Freelancer);

module.exports = Freelancer_router;