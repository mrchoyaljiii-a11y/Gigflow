const express = require('express');
const Bid_router = express.Router();
const {Handle_AddBid,GetBidsByGig,GetAllbids} = require('../../controllers/Bid_controller');
//post route for submitting a bid
Bid_router.post('/api/bids',Handle_AddBid);

//get route for getting a bid
Bid_router.get('/api/bid/:gigId', GetBidsByGig);

// get all bids
Bid_router.get('/api/bids',GetAllbids);

module.exports = Bid_router;