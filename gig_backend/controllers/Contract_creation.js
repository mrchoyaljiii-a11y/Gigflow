const contractModel = require("../model/Contract/contract");
const JObModel = require("../model/JobModel/Jobmodel");
const BidModel = require("../model/GigModel/GigModel");
const uploadToCloudinary = require("../utility/uploadToCloudinary");

async function generateContractNumber() {
    const count = await contractModel.countDocuments();
    const padded = String(count + 1).padStart(5, "0");
    return `CTR-${padded}`;
}

async function Handle_CreateContract(req, res) {
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

        if (!jobId || !bidId || !freelancerId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const existing = await contractModel.findOne({ jobId, freelancerId });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "A contract already exists for this job and freelancer",
                contractId: existing._id
            });
        }

        const contractNumber = await generateContractNumber();


        // !create a contract for the hired freelancer and save the contract data in database
        const newContract = new contractModel({
            contractNumber,
            jobId: jobId,
            bidId: bidId,
            freelancerId: freelancerId,
            clientId: req.user._id,
            contractType: contractType.trim().split(" ")[0],
            contractTitle: gigName,
            AgreedPrice: agreedPrice,
            startDate: new Date(),
            endDate: new Date(Date.now()), // Add timeline days to current date
            contractStatus: "active",
            createdAt: new Date(),
            payment: {
                totleBudget: agreedPrice,
                totalReleased: 0,
                remainingAmount: agreedPrice,
                inpendingAmount: 0
            }
        })

        const savedContract = await newContract.save();
        // console.log("Contract created successfully:", savedContract);

        // !update the freelancer contract details in database
        await BidModel.findByIdAndUpdate(bidId, { contractId: savedContract._id });

        // !update the job contract details in database
        await JObModel.findByIdAndUpdate(jobId, { contractId: savedContract._id });

        res.status(201).json({
            success: true,
            message: "Contract created successfully",
            contract: savedContract
        });
    }
    catch (error) {
        console.error("Error creating contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create contract",
            error: error.message
        });
    }
}

async function Handle_GetContractById(req, res) {
    try {
        const { contractId } = req.params;
        const contract = await contractModel.findById(contractId).populate('freelancerId', 'firstName  lastName  professionalTitle  country  state  email  experienceLevel freelanerSkills  languages linkedInLink  websitelink profileSummary  profileImage rate  hourlyRate workExperience  education professionalCategory  createdAt ') // Populate freelancer details;
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
            milestoneStatus: 'pending',
            attachments: uploadedFiles,
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


module.exports = {
    Handle_CreateContract, Handle_GetContractById, Handle_create_milestone, Handle_GetAllContracts
}