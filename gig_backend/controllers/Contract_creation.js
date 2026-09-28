const mongoose = require("mongoose");
const contractModel = require("../model/Contract/contract");
const JObModel = require("../model/JobModel/Jobmodel");
const BidModel = require("../model/BidModel/BidModel");
const HiredModel = require('../model/freelancer/Hired');
const uploadToCloudinary = require("../utility/uploadToCloudinary");
const Notification = require("../model/notification/notification");
const { getIO } = require("../Socket/socket");

const createNotification = require("../utility/Notifications/createNotification");

const emitNotification = require("../utility/Notifications/emitNotification");

async function generateContractNumber() {
    const count = await contractModel.countDocuments();
    const padded = String(count + 1).padStart(5, "0");
    return `CTR-${padded}`;
}


function emitContractUpdate(contract, eventName, payload) {
    const io = getIO();
    const clientId = contract?.clientId?.toString();
    const freelancerId = contract?.freelancerId?.toString();

    [clientId, freelancerId].forEach((userId) => {
        if (userId) {
            io.to(userId).emit(eventName, payload);
        }
    });
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
                    deadline.getDate() + DeleveryDate.deliveryTime
                );
                break;

            case "weeks":
                deadline.setDate(
                    deadline.getDate() + DeleveryDate.deliveryTime * 7
                );
                break;

            case "months":
                deadline.setMonth(
                    deadline.getMonth() + DeleveryDate.deliveryTime
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
                    },

                    activities: [
                        {
                            actor: "SYSTEM",
                            action: "CONTRACT_CREATED",
                            message: `Congratulations! Contract created for ${gigName}`,
                            createdAt: new Date()
                        }
                    ]

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

        const notification = await createNotification({
            userId: freelancerId,
            senderId: req.user._id,
            type: "BID_ACCEPTED",
            message: `Congratulations! You have been hired for "${gigName}" 🎉`,
            link: "/my-proposals"
        },
            session
        );

        await session.commitTransaction();

        session.endSession();

        emitNotification(notification);

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

// Get contract by id || get contract of logged-in user 
async function Handle_GetContractById(req, res) {
    try {
        // console.log("Controller PID:", process.pid);

        const { contractId } = req.params;

        const contract = await contractModel.findById(contractId)
            .populate('freelancerId', 'firstName  lastName  professionalTitle  country  state  email  experienceLevel freelanerSkills  languages linkedInLink  websitelink profileSummary  profileImage rate  hourlyRate workExperience  education professionalCategory  createdAt lastSeen')
            .populate('clientId', 'firstName  lastName country  state  email createdAt languages clientType clientRole clientSummary company Links profileImage phoneNo lastSeen');

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Contract not found"
            });
        }
        const userId = req.user.id; // Logged-in user

        const isClient = contract.clientId._id.toString() === userId;

        const isFreelancer = contract.freelancerId._id.toString() === userId;

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        }

        res.status(200).json({
            success: true,
            contract,
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

        // console.log("inside all contracts handler");

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

// client create milestone with files(optional)
async function Handle_create_milestone(req, res) {

    const session = await mongoose.startSession();

    try {
        console.log(req.body)
        console.log(req.files)
        const { title, description, amount, dueDate, contractId } = req.body;

        const files = req.files || [];

        if (!title || !description || !amount || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const milestoneAmount = Number(amount);

        if (!Number.isFinite(milestoneAmount)) {
            return res.status(400).json({
                success: false,
                message: "Milestone amount must be a valid number",
            });
        }

        if (milestoneAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Milestone amount must be greater than 0",
            });
        }

        let uploadedFiles = [];

        if (files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(
                        file.buffer,
                        file.originalname,
                        file.mimetype,
                        "milestones_attachments"
                    )
                );

                const cloudinaryResults = await Promise.all(uploadPromises);

                console.log('Cloudinary results:', cloudinaryResults);

                uploadedFiles = cloudinaryResults.map((result) => ({
                    url: result.secure_url,
                    publicId: result.public_id,
                    fileName: result.display_name,
                    fileSize: result.bytes,
                    fileType: result.format,
                    created_at: result.created_at,
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

        // start transection
        await session.startTransaction();

        const contract = await contractModel
            .findById(contractId)
            .session(session);

        if (!contract) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        if (contract.clientId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();

            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create milestones for this contract',
            });
        }

        const remainingAmount =
            Number(contract.payment?.remainingAmount || 0);

        // No remaining amount
        if (remainingAmount <= 0) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                title: "NO REMAINING AMOUNT",
                message:
                    "There is no remaining amount available in this contract. You cannot add another milestone.",
                data: {
                    remainingAmount: 0,
                },
            });
        }

        // Milestone amount exceeds remaining amount
        if (milestoneAmount > remainingAmount) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                title: "AMOUNT EXCEEDS REMAINING AMOUNT",
                message:
                    `The milestone amount exceeds the remaining contract balance. You have ₹${remainingAmount} remaining, but this milestone requires ₹${milestoneAmount}.`,
                data: {
                    remainingAmount,
                    requestedAmount: milestoneAmount,
                },
            });
        }

        //Create milestone
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

        contract.payment.inpendingAmount = Number(contract.payment.inpendingAmount || 0) + milestoneAmount;

        // Update remaining amount
        contract.payment.remainingAmount = remainingAmount - milestoneAmount;

        const createdMilestone = contract.milestones[contract.milestones.length - 1];

        // Add activity for milestone creation
        contract.activities.push({
            actor: "CLIENT",
            action: "MILESTONE_CREATED",
            milestoneId: createdMilestone._id,
            message: `A new milestone "${title}" has been created for you.`,
            createdAt: new Date(),
        })

        // save contract with new milestone and activity
        const updatedContract = await contract.save({ session });


        const notification = await createNotification({
            userId: contract.freelancerId,
            senderId: req.user._id,
            type: "MILESTONE_CREATED",
            message: `A new milestone "${title}" has been created for you.`,
            link: `/contracts/${contractId}`,
        }, session);


        await session.commitTransaction();

        emitNotification(notification); /// send notification


        emitContractUpdate(contract, "milestone_created", {
            contractId: contract._id.toString(),
            milestone: newMilestone,
            message: "New milestone created",
        });

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

        if (session.inTransaction()) {
            console.log("Aborting transaction... in Handle_create_milestone");
            await session.abortTransaction();
        }

        res.status(500).json({
            success: false,
            message: "Failed to create milestone",
            error: error.message
        });
    }
    finally {
        session.endSession();
    }
}

// Freelancer milestone actions
// Actions:
// accept
// submit_work
// (future) resubmit_work
// Handle Milestone Actions (Client + Freelancer)

async function Handle_milestone_Actions(req, res) {

    const session = await mongoose.startSession();

    try {

        const { milestoneId, contractId, action, reason } = req.body;

        const userId = req.user.id; // Logged-in user from auth middleware


        let notificationTargetId = null;
        let notificationType = "MILESTONE_UPDATED";
        let notificationMessage = "";
        let notificationLink = `/contracts/${contractId}`;

        // for activity

        let actor = null;
        let message = null;
        let Activityaction = null;


        if (!milestoneId || !contractId || !action) {
            return res.status(400).json({
                success: false,
                message: "Milestone ID, Contract ID and Action are required."
            });
        }

        // start transection
        await session.startTransaction();

        // Find contract
        const contract = await contractModel
            .findById(contractId)
            .session(session);


        if (!contract) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Contract not found."
            });
        }

        // Check User Role

        const isClient = contract.clientId.toString() === userId;


        const isFreelancer = contract.freelancerId.toString() === userId;


        // console.log("is client", isClient, "is Freelancer", isFreelancer);


        if (!isClient && !isFreelancer) {

            await session.abortTransaction();

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
            await session.abortTransaction();
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
                    await session.abortTransaction();
                    return res.status(403).json({
                        success: false,
                        message: "Only freelancer can accept milestone."
                    });
                }

                if (
                    milestone.milestoneStatus !== "PENDING_ACCEPTANCE"
                ) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        success: false,
                        message: "This milestone cannot be accepted."
                    });
                }

                milestone.milestoneStatus = "IN_PROGRESS";

                milestone.milestoneStartDate = new Date();

                notificationTargetId = contract.clientId;
                notificationType = "MILESTONE_ACCEPTED";
                notificationMessage = `Freelancer accepted milestone "${milestone.milestoneTitle}".`;

                actor = "FREELANCER";
                message = `Freelancer accepted milestone "${milestone.milestoneTitle}".`;
                Activityaction = "MILESTONE_ACCEPTED";

                break;

            // Freelancer Submit Work

            case "submit_work":

                if (!isFreelancer) {
                    await session.abortTransaction();
                    return res.status(403).json({
                        success: false,
                        message: "Only freelancer can submit work."
                    });

                }

                if (
                    milestone.milestoneStatus !== "IN_PROGRESS" &&
                    milestone.milestoneStatus !== "REVISION_REQUESTED"
                ) {

                    await session.abortTransaction();
                    return res.status(400).json({
                        success: false,
                        message:
                            "Only active milestones can be submitted."
                    });

                }

                milestone.milestoneStatus = "SUBMITTED";

                milestone.milestoneSubmittedDate = new Date();
                notificationTargetId = contract.clientId;
                notificationType = "WORK_SUBMITTED";
                notificationMessage = `Freelancer submitted work for milestone "${milestone.milestoneTitle}".`;

                actor = "FREELANCER";
                message = `Freelancer submitted work for milestone "${milestone.milestoneTitle}".`;
                Activityaction = "WORK_SUBMITTED";
                break;

            // Client Approve Milestone

            case "approved":

                if (!isClient) {
                    await session.abortTransaction();
                    return res.status(403).json({
                        success: false,
                        message: "Only client can approve milestone."
                    });

                }

                if (
                    milestone.milestoneStatus !== "SUBMITTED"
                ) {

                    await session.abortTransaction();

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only submitted milestones can be approved."
                    });

                }

                milestone.milestoneStatus = "APPROVED";

                milestone.milestoneApprovedDate = new Date();
                notificationTargetId = contract.freelancerId;
                notificationType = "MILESTONE_APPROVED";
                notificationMessage = `Client approved milestone "${milestone.milestoneTitle}".`;

                actor = "CLIENT";
                message = `Client approved milestone "${milestone.milestoneTitle}".`;
                Activityaction = "MILESTONE_APPROVED";
                break;

            // Client Request Revision

            case "REVISION_REQUESTED":

                if (!isClient) {
                    await session.abortTransaction();
                    return res.status(403).json({
                        success: false,
                        message:
                            "Only client can request revision."
                    });

                }

                if (
                    milestone.milestoneStatus !== "SUBMITTED"
                ) {

                    await session.abortTransaction();

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only submitted work can be revised."
                    });

                }

                milestone.milestoneStatus = "REVISION_REQUESTED";

                milestone.revisionRequest = {
                    reason: reason.trim(),
                    RevisionRequestDate: new Date(),
                };

                notificationTargetId = contract.freelancerId;
                notificationType = "REVISION_REQUESTED";
                notificationMessage = `Client requested revision for milestone "${milestone.milestoneTitle} review the work and update the milestone accordingly.".`;

                actor = "CLIENT";
                message = `Client requested revision for milestone "${milestone.milestoneTitle} review the work and update the milestone accordingly.".`;
                Activityaction = "REVISION_REQUESTED";

                break;

            case "CHANGES_REQUESTED":

                if (!isFreelancer) {
                    await session.abortTransaction();
                    return res.status(403).json({
                        success: false,
                        message:
                            "Only Freelancer can changes request ."
                    });
                }


                if (
                    milestone.milestoneStatus !== "PENDING_ACCEPTANCE"

                ) {
                    await session.abortTransaction();

                    return res.status(400).json({
                        success: false,
                        message:
                            "Only pending milestones can be changes requested."
                    });

                }

                if (!reason || !reason.trim()) {
                    await session.abortTransaction();
                    return res.status(400).json({
                        success: false,
                        message: "Please provide a reason for requesting changes."
                    });
                }

                milestone.milestoneStatus = "CHANGES_REQUESTED";

                milestone.changeRequest = {
                    reason: reason.trim(),
                    ChangeRequestDate: new Date(),
                };

                notificationTargetId = contract.clientId;
                notificationType = "CHANGES_REQUESTED";
                notificationMessage = `Freelancer Changes requested for milestone "${milestone.milestoneTitle}" Please review and update the milestone.`;

                actor = "FREELANCER";
                message = `Freelancer Changes requested for milestone "${milestone.milestoneTitle}" Please review and update the milestone.`;
                Activityaction = "CHANGES_REQUESTED";
                break;

            // Invalid Action

            default:

                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: "Invalid milestone action."
                });

        }

        contract.activities.push({
            contractId,
            actor,
            action: Activityaction,
            milestoneId: milestone._id,
            message,
            createdAt: new Date()
        });

        await contract.save({
            session
        });

        if (notificationTargetId) {
            const notification = await createNotification({
                userId: notificationTargetId,
                senderId: req.user._id,
                type: notificationType,
                message: notificationMessage,
                link: notificationLink,
            }, session);

            emitNotification(notification);
        }

        //! Commit the transaction
        await session.commitTransaction();


        emitContractUpdate(contract, "milestone_updated", {
            contractId: contract._id.toString(),
            milestoneId: milestone._id.toString(),
            action,
            milestoneStatus: milestone.milestoneStatus,
            milestone,
            message: `Milestone ${action} successfully.`,
        });


        return res.status(200).json({
            success: true,
            message: `"Milestone ${action} successfully."`,
            data: {
                action,
                milestone
            }

        });

    }
    catch (error) {

        if (session.inTransaction()) {

            console.log("Aborting transaction in HandleMilestoneAction");
            await session.abortTransaction();
        }

        console.error(
            "Milestone Action Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: `"Failed to update milestone."`,

            error: error.message

        });

    }
    finally {

        session.endSession();
    }
}

//files upload by freelancer to client as a work
async function Handle_UploadWork(req, res) {

    const session = await mongoose.startSession();

    try {
        const { milestoneId, contractId } = req.body;
        console.log("work upload data:", req.body);

        const files = req.files || [];

        if (!milestoneId || !contractId || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Contract , milestone and files are required',
            });
        }


        let uploadedFiles = [];

        if (files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(
                        file.buffer,
                        file.originalname,
                        file.mimetype,
                        "milestones_attachments")
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
                    created_at: result.created_at,
                }));

                // console.log("Uploaded files:", uploadedFiles);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(400).json({
                    success: false,
                    message: 'File upload failed ! work not uploaded',
                    error: uploadError.message,
                });
            }
        }

        //! start transaction
        await session.startTransaction();

        const contract = await contractModel
            .findById(contractId)
            .session(session);


        if (!contract) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        const milestone = contract.milestones.find((milestone) => milestone._id.toString() === milestoneId);

        if (!milestone) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Milestone not found',
            });
        }

        milestone.FreelancerAttachments.push(...uploadedFiles);

        contract.activities.push({
            actor: "FREELANCER",
            action: "FILES_UPLOADED",
            milestoneId: milestone._id,
            message: `Freelancer uploaded work files for milestone "${milestone.milestoneTitle}".`,
            createdAt: new Date(),
        });

        await contract.save({
            session
        });

        const notification = await createNotification({
            userId: contract.clientId,
            senderId: req.user._id,
            type: "WORK_UPLOADED",
            message: `Freelancer uploaded work for milestone "${milestone.milestoneTitle}".`,
            link: `/contracts/${contractId}`,
        }, session);


        await session.commitTransaction();

        emitNotification(notification);

        emitContractUpdate(contract, "milestone_work_uploaded", {
            contractId: contract._id.toString(),
            milestoneId: milestone._id.toString(),
            milestone,
            uploadedFiles,
            message: "Work uploaded successfully",
        });


        res.status(201).json({
            success: true,
            message: "Work uploaded successfully",
            data: {
                milestone,
            },
        });

    } catch (error) {
        console.log("Error in Handle_UploadWork:", error);
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        res.status(500).json({
            success: false,
            message: "Failed to upload work!",
            error: error.message
        });
    } finally {

        await session.endSession();

    }
}

// update milestone for freelancer request changes , request 
async function Handle_update_milestone(req, res) {

    const session = await mongoose.startSession();

    try {
        const { title, description, amount, dueDate, milestoneId } = req.body;
        const contractId = req.params.contractId;
        const files = req.files || [];

        if (!title || !description || !amount || !dueDate || !milestoneId || !contractId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }


        let uploadedFiles = [];

        if (files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(
                        file.buffer,
                        file.originalname,
                        file.mimetype,
                        "milestones_attachments")
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


        //! start transaction
        await session.startTransaction();

        const contract = await contractModel
            .findById(contractId)
            .session(session);

        if (!contract) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        if (contract.clientId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create milestones for this contract',
            });
        }

        const milestone = contract.milestones.find((milestone) => milestone._id.toString() === milestoneId);

        if (!milestone) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Milestone not found',
            });
        }

        milestone.milestoneTitle = title;
        milestone.milestoneDescription = description;
        milestone.milestoneAmount = amount;
        milestone.milestoneDueDate = dueDate;
        milestone.ClientAttachments.push(...uploadedFiles);
        milestone.milestoneStatus = "PENDING_ACCEPTANCE";

        contract.activities.push({
            actor: "CLIENT",
            action: "MILESTONE_UPDATED",
            milestoneId: milestone._id,
            message: `Client updated milestone "${milestone.milestoneTitle}" after requested changes.`,
            createdAt: new Date(),
        });

        await contract.save({ session });

        const notification = await createNotification({
            userId: contract.freelancerId,
            senderId: req.user._id,
            type: "CHANGES_IN_MILESTONE",
            message: `Client updated milestone : "${milestone.milestoneTitle}" for your request changes. Now you can Accept it.`,
            link: `/contracts/${contractId}`,
        }, session);


        await session.commitTransaction();


        emitNotification(notification);

        emitContractUpdate(contract, "milestone_updated", {
            contractId: contract._id.toString(),
            milestoneId: milestone._id.toString(),
            milestone,
            uploadedFiles,
            message: "Milestone updated successfully for request changes !",
        });

        // console.log("Updated milestone:", milestone);

        res.status(201).json({
            success: true,
            message: "Milestone updated successfully for request changes !",
            data: {
                milestone,
            },
        });


    } catch (error) {
        console.log("error in update milestone", error)
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        res.status(500).json({
            success: false,
            message: "Failed to update milestone for request changes !",
            error: error.message
        });
    } finally {

        await session.endSession();

    }

}

module.exports = {
    Handle_HireFreelancer_CreateContract, Handle_GetContractById, Handle_create_milestone,
    Handle_GetAllContracts, Handle_milestone_Actions, Handle_UploadWork, Handle_update_milestone
}