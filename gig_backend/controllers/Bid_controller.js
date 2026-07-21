const BidModel = require('../model/BidModel/BidModel');
const JobModel = require('../model/JobModel/Jobmodel');
const mongoose = require('mongoose');
const Notification = require("../model/notification/notification");
const { getIO } = require("../Socket/socket");

// ! post route for submitting a bid by freelancer
async function Handle_AddBid(req, res) {
    // console.log("Received bid data:", req.body);
    try {
        const { bid, Delivery_date, description, gigId } = req.body
        console.log("Received bid data:", { bid, Delivery_date, description, gigId });
        // const freelancerId = new mongoose.Types.ObjectId();

        const newBid = new BidModel({
            bid,
            Delivery_date,
            description,
            gigId,
            freelancerId: req.user._id
        });

        // console.log("New bid to be saved:", newBid);

        const savedBid = await newBid.save();

        const populatedBid = await BidModel.findById(savedBid._id).populate("freelancerId", "firstName lastName profileImage email country state");

        const gig = await JobModel.findById(gigId);

        // console.log("Gig found for bid:", gig);

        const io = getIO();

        // send only to that client real time add bid in client side
        io.to(gig.clientId.toString()).emit("new_bid", populatedBid);

        
        const savedNotification = await Notification.create({
            userId: gig.clientId, // Who receives the notification
            senderId: req.user._id, // Who triggered the notification
            type: "BID_RECEIVED",
            message: `you recived a new bid from ${req.user.firstName} ${req.user.lastName} for your job post ${gig.jobtitle}`,
            link: gigId,
        });

        io.to(gig.clientId.toString()).emit("new_notification",savedNotification);

        return res.status(201).json({
            success: true,
            bid: populatedBid,
            message: "Bid added successfully"
        });

        console.log("Bid added successfully:", populatedBid);

    } catch (error) {
        console.log("Error in Handle_AddBid:", error);
        res.status(500).json({
            success: false,
            message: "Error while adding bid"
        });
    }
}

async function GetBidsByGig(req, res) {

    try {
        // console.log("Received gigId:", req.params.gigId);
        const bids = await BidModel.find({ gigId: req.params.gigId }).populate("freelancerId", "firstName lastName profileImage email country state");
        // console.log("Fetched bids:", bids);
        return res.json({
            success: true,
            bids: bids || [],
            message: bids && bids.length ? "Bids fetched successfully" : "No bids found"
        });

    }
    catch (error) {
        console.log("Error in Handle_AddBid:", error);
        res.status(500).json({
            success: false,
            message: "Error while Getting bid"
        });
    }
}

async function GetAllbids(req, res) {
    try {

        const bids = await BidModel.find().populate("freelancerId", "firstName lastName profileImage email country state");
        // console.log("Fetched bids:", bids);
        return res.json({
            success: true,
            bids: bids || [],
            message: bids && bids.length ? "Bids fetched successfully" : "No bids found"
        });

    }
    catch (error) {
        console.log("Error in Handle_AddBid:", error);
        res.status(500).json({
            success: false,
            message: "Error while Getting Bid"
        });
    }

}

// get the bids by freelancerId
async function GetBidsByFreelancer(req, res) {
    try {
        console.log("Received freelancerId:", req.params.freelancerId);
        
        const bids = await BidModel.find({ freelancerId: req.params.freelancerId }).populate({
            path: "gigId",
            select: "jobtitle projectCategory timeline jobDescription skills minBudget maxBudget clientId",
            populate: {
                path: "clientId",
                select: "firstName LastName country state company email profileImage" // adjust based on your User schema
            }
        });
        // const bidsCount = bids.length;
        // console.log("Fetched bids:", bids);
        return res.json({
            success: true,
            bids_by_freelancer: bids || [],
            message: bids && bids.length ? "Bids fetched successfully" : "No bids found"
        });

    } catch (error) {
        console.log("Error in GetBidsByFreelancer:", error);
        res.status(500).json({
            success: false,
            message: "Error while Getting Bid by freelancer"
        });
    }
}

// update the bid status to hired or rejected by client
async function UpdateBidStatus(req, res) {
    const { data } = req.body;
    const { bidId, gigId } = data;
    // console.log("Received data for updating bid status:", data);
    try {
        await BidModel.updateMany(
            { gigId },
            { $set: { status: "rejected" } }
        );

        const hiredBid = await BidModel.findByIdAndUpdate(
            bidId,
            { $set: { status: "hired" } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Bid status updated successfully",
            bid: hiredBid
        });


    } catch (error) {
        console.log("Error in UpdateBidStatus:", error);
        res.status(500).json({
            success: false,
            message: "Error while updating bid status"
        });
    }
}

// update the view bid by client
async function IncrementBidView(req, res) {
    const ViewdData = req.body;
    // console.log("Received views data:", ViewdData);
    const { freelancerId, clientID, bidId } = ViewdData;
    try {
        const bid = await BidModel.findById(bidId);

        // console.log("Bid found:", bid);

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: "Bid not found"
            });
        }

        const alreadyViewed = bid.viewd.clientID.some(
            (id) => id.toString() === clientID
        );


        if (!alreadyViewed) {
            bid.viewd.clientID.push(clientID);
            bid.viewd.views += 1;
            await bid.save();

            const io = getIO();
            io.to(freelancerId.toString()).emit("bid_viewed", bid);

            console.log("📡 Sent bid_viewed to freelancer:", freelancerId);
        }

        return res.status(200).json({
            success: true,
            message: "Bid view updated successfully",
            bid: bid
        });

    } catch (error) {
        console.log("Error in Bid View status:", error);
        res.status(500).json({
            success: false,
            message: "Error whileError in Bid View status"
        });
    }
}

// update the bid status to withdraw by the freelancer
async function withdrawBid(req, res) {
    try {
        const data = req.body;
        const { bidId, gigId } = data;
        // console.log("Received data for updating bid status:", data);

        const bid = await BidModel.findById(bidId);

        if (!bid) {
            return res.status(404).json({ message: "Bid not found" });
        }

        const Updatebid = await BidModel.findByIdAndUpdate(
            bidId,
            { $set: { status: "withdraw" } },
            { new: true }
        );

        const job = await JobModel.findById(gigId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const updatedJob = await JobModel.findByIdAndUpdate(
            gigId,
            { $set: { status: "active" } },
            { new: true }
        );


        return res.status(200).json({
            success: true,
            bidId: bidId,
            message: "Bid withdraw successfully",
            withdrawnBid: Updatebid
        });


    } catch (error) {
        console.log("Error in withdraw bid:", error);
        res.status(500).json({
            success: false,
            message: "Error while in withdraw bid"
        });
    }
}

module.exports = { Handle_AddBid, GetBidsByGig, GetAllbids, GetBidsByFreelancer, UpdateBidStatus, IncrementBidView, withdrawBid };