const BidModel = require('../model/GigModel/GigModel');
const mongoose = require('mongoose');

async function Handle_AddBid(req, res) {
    console.log("Received bid data:", req.body);
    try {
        const { bid, timeline, description, gigId } = req.body
       const freelancerId = new mongoose.Types.ObjectId();

        const newBid = new BidModel({
      bid,
      timeline,
      description,
      gigId,
      freelancerId
    });
        const savedBid = await newBid.save();
        return res.status(201).json({
            success: true,
            bid: savedBid,
            message: "Bid added successfully"
        });
    } catch (error) {
        console.log("Error in Handle_AddBid:", error);
        res.satatus(500).json({
            success: false,
            message: "Error while adding bid"
        });
    }
}

async function GetBidsByGig (req,res)
{

    try {
        // console.log("Received gigId:", req.params.gigId);
        const bids = await BidModel.find({gigId:req.params.gigId});
        // console.log("Fetched bids:", bids);
        return res.json({
            success:true,
            bids: bids || [],
            message: bids && bids.length ? "Bids fetched successfully" : "No bids found"
        });
        
    } 
    catch (error) {
        console.log("Error in Handle_AddBid:", error);
        res.satatus(500).json({
            success: false,
            message: "Error while Getting bid"
        });
    }
}

async function GetAllbids (req,res)
{
    try {
        
        const bids = await BidModel.find();
        // console.log("Fetched bids:", bids);
        return res.json({
            success:true,
            bids: bids || [],
            message: bids && bids.length ? "Bids fetched successfully" : "No bids found"
        });
        
    } 
    catch (error) {
        console.log("Error in Handle_AddBid:", error);
        res.satatus(500).json({
            success: false,
            message: "Error while Getting Bid"
        });
    }

}

module.exports = { Handle_AddBid,GetBidsByGig,GetAllbids };