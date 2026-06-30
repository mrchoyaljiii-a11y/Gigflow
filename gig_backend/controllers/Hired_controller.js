const Hired = require('../model/freelancer/Hired');
const bids = require('../model/GigModel/GigModel');
const Notification = require("../model/notification/notification");
const { getIO, getUsers } = require("../Socket/socket");
const contractModel = require('../model/Contract/contract');

// add hire a freelancer for a job | when a client hire the freelancer the data is saved in database.
async function Handle_SubmitHired(req, res) {
    try {
        const {
            jobId,
            bidId,
            freelancerId,
            clientCompanyName,
            agreedPrice,
            timeline,
            gigName,
            contractType
        } = req.body;

        // console.log("contract type:", contractType.split(" ")[0]);

        if (!jobId || !bidId || !freelancerId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const alreadyHired = await Hired.findOne({ jobId });
        if (alreadyHired) {
            return res.status(400).json({
                success: false,
                message: "Freelancer already hired for this job"
            });
        }

        const newHired = new Hired({
            jobId,
            bidId,
            freelancerId,
            clientId: req.user._id,
            clientCompanyName,
            agreedPrice,
            // timeline,
            gigName,
            hiredStatus: "hired"
        });

        const io = getIO();

        //  update the bid status to hired when the client hire the freelancer and also update the status of other bids to rejected for that gig
        await bids.findByIdAndUpdate(bidId, {
            status: "hired"
        });

        //  Reject others
        await bids.updateMany(
            { gigId: jobId, _id: { $ne: bidId } },
            { status: "rejected" }
        );

        const savedHired = await newHired.save();

        io.to(freelancerId.toString()).emit("bid_status_updated", {
            bidId,
            status: "hired",
        });

        // console.log("users object:", users);
        // console.log("freelancerId:", freelancerId);

        // Create a notification for the freelancer
        const hiredNotification = await Notification({
            userId: freelancerId, // receiver
            senderId: req.user._id, // client
            type: "BID_ACCEPTED",
            message: `Congratulations! You have been hired for "${gigName}" 🎉`,
            link: "/my-proposals",
        });

        const savedNotification = await hiredNotification.save();

        // console.log("📡 Notification saved:", savedNotification);

        io.to(freelancerId.toString()).emit("new_notification", savedNotification);

        console.log("📡 Notification sent via room:", freelancerId);

        // ! send notification to the rejected freelancers

        const allbids = await bids.find({ gigId: jobId })

        const rejectedBids = allbids.filter((bid) => bid.freelancerId.toString() !== freelancerId.toString());

        for (let bid of rejectedBids) {

            io.to(bid.freelancerId.toString()).emit("bid_status_updated", {
                bidId: bid._id,
                status: "rejected",
            });

            const rejectedUsedId = bid.freelancerId.toString();

            const rejectionNotification = await Notification.create({
                userId: rejectedUsedId,
                senderId: req.user._id,
                type: "BID_REJECTED",
                message: `❌ Your bid for "${gigName}" was not selected.`,
                link: "/my-proposals",
            });

            io.to(rejectedUsedId).emit("new_notification", rejectionNotification);

            console.log("📡 Rejected notification sent:", rejectedUsedId);
        }


        return res.status(201).json({
            success: true,
            hired: savedHired,
            message: "Freelancer hired successfully "
        });


    } catch (error) {
        console.error("Error in Handle_SubmitHired:", error);
        return res.status(500).json({
            success: false,
            message: "Error while hiring freelancer"
        });
    }
}

// fetch the hired freelancer data hired by client from db
async function Handle_GetHired(req, res) {
    try {
        const jobId = req.params.jobId;
        const hiredRecords = await Hired.findOne({ jobId })
            .populate("clientId", "firstName lastName email profileImage")
            .populate("freelancerId", "firstName lastName email profileImage");


        if (!hiredRecords) {
            return res.status(404).json({
                success: false,
                message: "No hired records found for this job"
            });
        }

        // console.log("Hired Records:", hiredRecords);
        return res.status(200).json({
            success: true,
            hired: hiredRecords,
            message: "Hired records fetched successfully"
        });

    } catch (error) {
        console.log("Error in Handle_GetHired:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetch the hired freelancer data"
        });
    }

}

// fetch all hired records for a freelancer dashboard
async function Handle_GetHiredByFreelancer(req, res) {
    try {
        const freelancerId = req.params.freelancerId;
        const hiredRecords = await Hired.find({ freelancerId })

        // console.log("Hired Records for freelancer:", hiredRecords.length);

        return res.status(200).json({
            success: true,
            hiredRecords: hiredRecords,
            message: "Hired records fetched successfully"
        });

    } catch (error) {
        console.log("Error in Handle_GetHiredByFreelancer:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetch all hired records for a freelancer dashboard"
        });
    }
}

// fetch the All hired records by a client
async function Handle_GetAllHired(req, res) {
    try {
        const AuthenticatedClientID = req.user._id;
        const hiredRecords = await Hired.find({ clientId: AuthenticatedClientID }).sort({ createdAt: -1 }).populate("clientId", "firstName lastName email profileImage").populate("freelancerId", "firstName lastName email profileImage");

        
        return res.json({
            success: true,
            hired: hiredRecords,
            message: "Hired records fetched successfully"
        });

    } catch (error) {
        console.log("Error in Handle_GetAllHired:", error);
        res.status(500).send("Internal Server Error from Handle_GetAllHired");
    }
}
module.exports = { Handle_SubmitHired, Handle_GetHired, Handle_GetHiredByFreelancer,Handle_GetAllHired };
