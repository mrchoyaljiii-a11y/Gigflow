const Hired = require('../model/freelancer/Hired');
const bids = require('../model/BidModel/BidModel');
const Notification = require("../model/notification/notification");
const { getIO, getUsers } = require("../Socket/socket");
const contractModel = require('../model/Contract/contract');

// fetch the hired records hired by client from specific job 
async function Handle_GetHired(req, res) {
    try {

        const jobId = req.params.jobId;

        // console.log("jobId", jobId);

        const hiredRecords = await Hired.findOne({ jobId })
            .populate("clientId", "firstName lastName email profileImage")
            .populate("freelancerId", "firstName lastName email profileImage");


        if (!hiredRecords) {
            return res.status(404).json({
                success: false,
                message: "No hired records found for this job"
            });
        }

        return res.status(200).json({
            success: true,
            hired: hiredRecords,
            message: `Hired records fetched successfully for the ${hiredRecords?.gigName} job`
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

module.exports = { Handle_GetHired, Handle_GetHiredByFreelancer, Handle_GetAllHired };
