const mongoose = require("mongoose");
const contractModel = require("../model/Contract/contract");
const JObModel = require("../model/JobModel/Jobmodel");
const BidModel = require("../model/BidModel/BidModel");
const HiredModel = require('../model/freelancer/Hired');
const uploadToCloudinary = require("../utility/uploadToCloudinary");
const Notification = require("../model/notification/notification");
const { getIO, getUsers } = require("../Socket/socket");

async function generateContractNumber() {
    const count = await contractModel.countDocuments();
    const padded = String(count + 1).padStart(5, "0");
    return `CTR-${padded}`;
}

// handle the hire and create contract process and update the bid status and job status 

async function Handle_HireFreelancer_CreateContract(req, res) {
    const session = await mongoose.startSession();

    // console.log("Starting transaction for hiring freelancer and creating contract");

    try {
        session.startTransaction();

        const {
            jobId,
            bidId,
            freelancerId,
            clientCompanyName,
            agreedPrice,
            DeleveryDate,
            gigName,
            contractType
        } = req.body;

        if (!jobId || !bidId || !freelancerId) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Prevent duplicate hire
        const alreadyHired = await HiredModel.findOne({
            jobId
        }).session(session);

        if (alreadyHired) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: `Freelancer already hired for the ${alreadyHired.jobId} `
            });
        }

        // Prevent duplicate contract
        const existingContract = await contractModel.findOne({
            jobId,
            freelancerId
        }).session(session);

        if (existingContract) {
            await session.abortTransaction();

            return res.status(409).json({
                success: false,
                message: "Contract already exists"
            });
        }

        /* CREATE HIRED DOCUMENT */

        // console.log("1. Transaction started");

        const hired = await HiredModel.create(
            [
                {
                    jobId,
                    bidId,
                    freelancerId,
                    clientId: req.user._id,
                    clientCompanyName,
                    agreedPrice,
                    gigName,
                    hiredStatus: "hired"
                }
            ],
            { session }
        );

        // console.log("2. Hired created");

        /*CALCULATE DEADLINE*/

        const startDate = new Date();
        const deadline = new Date(startDate);

        switch (DeleveryDate.deliveryUnit) {
            case "days":
                deadline.setDate(
                    deadline.getDate() +
                    DeleveryDate.deliveryTime
                );
                break;

            case "weeks":
                deadline.setDate(
                    deadline.getDate() +
                    DeleveryDate.deliveryTime * 7
                );
                break;

            case "months":
                deadline.setMonth(
                    deadline.getMonth() +
                    DeleveryDate.deliveryTime
                );
                break;
        }

        /*CREATE CONTRACT*/


        //    console.log({
        //        contractNumber,
        //        jobId,
        //        bidId,
        //        freelancerId,
        //        clientId: req.user._id,
        //        contractType,
        //        gigName,
        //        agreedPrice,
        //        startDate,
        //        deadline
        //     });

        const contractNumber = await generateContractNumber();
        // console.log("3. About to create contract");

        const contract = await contractModel.create(
            [
                {
                    contractNumber,
                    jobId,
                    bidId,
                    freelancerId,
                    clientId: req.user._id,
                    contractType:
                        contractType.trim().split(" ")[0],
                    contractTitle: gigName,
                    AgreedPrice: agreedPrice,
                    startDate,
                    endDate: deadline,
                    contractStatus: "active",
                    payment: {
                        totleBudget: agreedPrice,
                        totalReleased: 0,
                        remainingAmount: agreedPrice,
                        inpendingAmount: 0
                    }
                }
            ],
            { session }
        );
        // console.log("4. Contract created");

        const contractId = contract[0]._id;

        /*UPDATE BID STATUS*/

        //    console.log("5. Updating bid");

        await BidModel.findByIdAndUpdate(
            bidId,
            {
                status: "hired",
                contractId
            },
            { session }
        );
        // console.log("6. Updating other bids");

        // rejects all other bids for the same job
        await BidModel.updateMany(
            {
                gigId: jobId,
                _id: { $ne: bidId }
            },
            {
                status: "rejected"
            },
            { session }
        );

        /* UPDATE JOB */
        //    console.log("7. Updating job");

        await JObModel.findByIdAndUpdate(
            jobId,
            {
                contractId,
                status: "assigned"
            },
            { session }
        );

        /*COMMIT transaction*/

        //    console.log("8. Committing");

        await session.commitTransaction();

        session.endSession();

        // console.log("9. Committed");

        /*SOCKETS & NOTIFICATIONS*/

        const io = getIO();

        io.to(freelancerId.toString()).emit(
            "bid_status_updated",
            {
                bidId,
                status: "hired"
            }
        );

        const notification =
            await Notification.create({
                userId: freelancerId,
                senderId: req.user._id,
                type: "BID_ACCEPTED",
                message: `Congratulations! You have been hired for "${gigName}" 🎉`,
                link: "/my-proposals"
            });

        io.to(freelancerId.toString()).emit(
            "new_notification",
            notification
        );

        return res.status(201).json({
            success: true,
            message:
                "Freelancer hired and contract created successfully 🎉",
            hired: hired[0],
            contract: contract[0]
        });
    } catch (error) {
        try {
            await session.abortTransaction();
        } catch { }

        await session.endSession();

        console.error("Transaction Error:", error);
        console.error("Error Message:", error.message);
        console.error("Stack:", error.stack);

        return res.status(500).json({
            success: false,
            message: "Failed to hire freelancer and create contract ! Server error occurred.",
            error: error.message
        });
    }
}


async function Handle_GetContractById(req, res) {
    try {
        const { contractId } = req.params;
        const contract = await contractModel.findById(contractId)
            .populate('freelancerId', 'firstName  lastName  professionalTitle  country  state  email  experienceLevel freelanerSkills  languages linkedInLink  websitelink profileSummary  profileImage rate  hourlyRate workExperience  education professionalCategory  createdAt ')
            .populate('clientId', 'firstName  lastName country  state  email createdAt languages clientType clientRole clientSummary company Links profileImage phoneNo');

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Contract not found"
            });
        }
        res.status(200).json({
            success: true,
            contract
        });
    }
    catch (error) {
        console.error("Error fetching contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch contract",
            error: error.message
        });
    }
}

async function Handle_GetAllContracts(req, res) {
    try {

        console.log("inside all contracts handler");

        const userId = req.user._id;

        const contracts = await contractModel.find({ clientId: userId }).populate('freelancerId', 'firstName  lastName  professionalTitle  country  state  email  experienceLevel freelanerSkills  languages linkedInLink  websitelink profileSummary  profileImage rate  hourlyRate workExperience  education professionalCategory  createdAt ') // Populate freelancer details;
        if (!contracts) {
            return res.status(404).json({
                success: false,
                message: "No contracts found for these clients"
            });
        }

        // console.log("All contract", contracts);

        res.status(200).json({
            success: true,
            contracts
        });
    }
    catch (error) {
        console.error("Error fetching on all contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch all contract",
            error: error.message
        });
    }
}

async function Handle_create_milestone(req, res) {
    try {
        // console.log(req.body)
        // console.log(req.files)   
        const { title, description, amount, dueDate, contractId } = req.body;

        const files = req.files || [];

        if (!title || !description || !amount || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const contract = await contractModel.findById(contractId);
        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        if (contract.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create milestones for this contract',
            });
        }

        let uploadedFiles = [];

        if (files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(file.buffer, file.originalname)
                );

                const cloudinaryResults = await Promise.all(uploadPromises);

                // console.log('Cloudinary results:', cloudinaryResults);

                uploadedFiles = cloudinaryResults.map((result) => ({
                    url: result.secure_url,
                    // downloadUrl: result.url,
                    publicId: result.public_id,
                    fileName: result.display_name,
                    fileSize: result.bytes,
                    fileType: result.format,
                }));
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'File upload failed',
                    error: uploadError.message,
                });
            }
        }

        const newMilestone = {
            milestoneTitle: title,
            milestoneDescription: description,
            milestoneAmount: Number(amount),
            milestoneDueDate: new Date(dueDate),
            milestoneStatus: 'PENDING_ACCEPTANCE',
            ClientAttachments: uploadedFiles,
            createdAt: new Date(),
        };

        // Add milestone to contract
        contract.milestones.push(newMilestone);


        contract.payment.inpendingAmount += Number(amount);

        // Save contract with new milestone
        const updatedContract = await contract.save();

        res.status(201).json({
            success: true,
            message: 'Milestone created successfully',
            data: {
                milestone: newMilestone,
                contract: updatedContract,
            },
        });


    } catch (error) {
        console.error("Error creating milestone:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create milestone",
            error: error.message
        });

    }

}

// Freelancer milestone actions
// Actions:
// accept
// submit_work
// (future) resubmit_work
// Handle Milestone Actions (Client + Freelancer)

async function Handle_milestone_Actions(req, res) {
    try {

        const { milestoneId, contractId, action } = req.body;

        const userId = req.user.id; // Logged-in user from auth middleware


        if (!milestoneId || !contractId || !action) {
            return res.status(400).json({
                success: false,
                message: "Milestone ID, Contract ID and Action are required."
            });
        }


        // Find contract
        const contract = await contractModel.findById(contractId);


        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Contract not found."
            });
        }

        // Check User Role

        const isClient =
            contract.clientId.toString() === userId;


        const isFreelancer =
            contract.freelancerId.toString() === userId;


        console.log("is client", isClient, "is Freelancer", isFreelancer);


        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this contract."
            });
        }

        // Find milestone

        const milestone = contract.milestones.find(
            (milestone) =>
                milestone._id.toString() === milestoneId
        );


        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found."
            });
        }

        // Milestone Actions

        switch (action) {

            // Freelancer Accept Milestone

            case "accept":

                if (!isFreelancer) {
                    return res.status(403).json({
                        success: false,
                        message: "Only freelancer can accept milestone."
                    });
                }

                if (
                    milestone.milestoneStatus !==
                    "PENDING_ACCEPTANCE"
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "This milestone cannot be accepted."
                    });
                }

                milestone.milestoneStatus = "IN_PROGRESS";

                milestone.milestoneStartDate =
                    new Date();

                break;

            // Freelancer Submit Work

            case "submit_work":

                if (!isFreelancer) {
                    return res.status(403).json({
                        success: false,
                        message: "Only freelancer can submit work."
                    });

                }

                if (
                    milestone.milestoneStatus !== "IN_PROGRESS" &&
                    milestone.milestoneStatus !== "REVISION_REQUESTED"
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only active milestones can be submitted."
                    });

                }

                milestone.milestoneStatus = "SUBMITTED";

                milestone.milestoneSubmittedDate =
                    new Date();
                break;

            // Client Approve Milestone

            case "approved":

                if (!isClient) {
                    return res.status(403).json({
                        success: false,
                        message: "Only client can approve milestone."
                    });

                }

                if (
                    milestone.milestoneStatus !== "SUBMITTED"
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only submitted milestones can be approved."
                    });

                }

                milestone.milestoneStatus ="APPROVED";

                milestone.milestoneApprovedDate =
                    new Date();

                break;

            // Client Request Revision

            case "request_revision":

                if (!isClient) {
                    return res.status(403).json({
                        success: false,
                        message:
                            "Only client can request revision."
                    });

                }

                if (
                    milestone.milestoneStatus !== "SUBMITTED"
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only submitted work can be revised."
                    });

                }

                milestone.milestoneStatus = "REVISION_REQUESTED";

                break;

            // Invalid Action

            default:

                return res.status(400).json({
                    success: false,
                    message: "Invalid milestone action."
                });

        }

        // Save only once

        await contract.save();

        return res.status(200).json({
            success: true,
            message:`"Milestone ${action} successfully."`,
            data: {
                action,
                milestone
            }

        });

    }
    catch (error) {

        console.error(
            "Milestone Action Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:`"Failed to update milestone."`,

            error: error.message

        });

    }
}


async function Handle_UploadWork(req, res) {
    try {
        const { milestoneId, contractId } = req.body;

        const files = req.files || [];

        if (!milestoneId || !contractId || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Contract , milestone and files are required',
            });
        }
        const contract = await contractModel.findById(contractId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        const milestone = contract.milestones.find((milestone) => milestone._id.toString() === milestoneId);

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: 'Milestone not found',
            });
        }

        let uploadedFiles = [];

        if (files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(file.buffer, file.originalname)
                );

                const cloudinaryResults = await Promise.all(uploadPromises);

                // console.log('Cloudinary results:', cloudinaryResults);

                uploadedFiles = cloudinaryResults.map((result) => ({
                    url: result.secure_url,
                    // downloadUrl: result.url,
                    publicId: result.public_id,
                    fileName: result.display_name,
                    fileSize: result.bytes,
                    fileType: result.format,
                }));

                console.log("Uploaded files:", uploadedFiles);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'File upload failed ! work not uploaded',
                    error: uploadError.message,
                });
            }
        }


        milestone.FreelancerAttachments.push(...uploadedFiles);


        await contract.save();

        res.status(201).json({
            success: true,
            message: "Work uploaded successfully",
            data: {
                milestone,
            },
        });

    } catch (error) {
        console.log("Error in Handle_UploadWork:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload work!",
            error: error.message
        });
    }
}


module.exports = {
    Handle_HireFreelancer_CreateContract, Handle_GetContractById, Handle_create_milestone,
    Handle_GetAllContracts, Handle_milestone_Actions, Handle_UploadWork
}