const express = require('express');
const Bid_router = express.Router();
const { Handle_AddBid, GetBidsByGig, GetAllbids, GetBidsByFreelancer,UpdateBidStatus,IncrementBidView ,withdrawBid} = require('../../controllers/Bid_controller');
const authMiddleware = require('../../middlewares/authMiddleware');

//post route for submitting a bid
Bid_router.post('/api/bids', authMiddleware, Handle_AddBid);

//get route for getting a bid
Bid_router.get('/api/bid/:gigId', GetBidsByGig);

// get all bids
Bid_router.get('/api/bids', GetAllbids);

// bid by freelancerId
Bid_router.get('/api/bids/freelancer/:freelancerId', GetBidsByFreelancer);

// update bid status
Bid_router.post('/api/bids/update', authMiddleware, UpdateBidStatus);

// update the bid view status
Bid_router.put('/api/bids/view', authMiddleware, IncrementBidView);

// withdraw the bid by freelancer 
Bid_router.post('/api/bids/withdraw', authMiddleware, withdrawBid);

module.exports = Bid_router;