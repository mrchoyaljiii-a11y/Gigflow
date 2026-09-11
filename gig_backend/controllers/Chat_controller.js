const contractModel = require("../model/Contract/contract");
const messageModel = require("../model/MessageModel/Message");
const uploadToCloudinary = require("../utility/uploadToCloudinary");
const cloudinary = require('../connections/cloudinary');


const { getIO } = require("../Socket/socket");

async function Handle_Submit_Chat_message(req, res) {
    try {

        const contractId = req.params.contractId;

        // console.log("Received contractId:", contractId);

        const {
            text,
            messageType,
        } = req.body;

        const files = req.files || [];

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        // Logged-in user
        const senderId = req.user.id;

        // console.log("senderId", senderId);

        const contract = await contractModel.findById(contractId);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Contract not found"
            });
        }

        const isClient = contract.clientId.toString() === senderId.toString();

        const isFreelancer = contract.freelancerId.toString() === senderId.toString();

        if (!isClient && !isFreelancer) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access. Only the client or freelancer can send messages."
            });
        }

        let senderType;
        let receiverId;

        if (isClient) {
            senderType = "CLIENT";
            receiverId = contract.freelancerId;
        } else {
            senderType = "FREELANCER";
            receiverId = contract.clientId;
        }

        if (
            messageType === "text" &&
            (!text || !text.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Message text is required."
            });
        }

        if (
            messageType === "file" &&
            (!files || files.length === 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "File attachments are required for file messages."
            });
        }

        // Upload files to Cloudinary
        let uploadedFiles = [];

        if (files.length > 0) {
            try {
                uploadedFiles = await Promise.all(
                    files.map(async (file) => {
                        const result = await uploadToCloudinary(
                            file.buffer,
                            file.originalname,
                            file.mimetype,
                            "chat_attachments_files"
                        );

                        const originalName = file.originalname;

                        // Remove extension
                        const fileNameWithoutExtension = originalName.includes(".")
                            ? originalName.substring(0, originalName.lastIndexOf("."))
                            : originalName;

                        // Make filename Cloudinary-safe
                        const downloadFileName = fileNameWithoutExtension
                            .replace(/[^a-zA-Z0-9_-]/g, "_")
                            .replace(/_+/g, "_")
                            .replace(/^_+|_+$/g, "");

                        const uploadPath = `/${result.resource_type}/upload/`;
                        
                        const downloadUrl = result.secure_url.replace(
                            uploadPath,
                            `${uploadPath}fl_attachment:${downloadFileName}/`
                        );

                        return {
                            url: result.secure_url,
                            downloadUrl,
                            publicId: result.public_id,
                            originalName: file.originalname,
                            mimeType: file.mimetype,
                            size: file.size
                        };
                    })
                );
            } catch (error) {
                console.error("Error uploading files to Cloudinary:", error);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading files"
                });
            }
        }

        // Create message
        const newMessage = await messageModel.create({
            contractId,
            senderId,
            receiverId,
            senderType,
            messageType: messageType || "text",
            text: text?.trim() || "",
            attachments: uploadedFiles || [],
            status: "sent",
            deliveredAt: null,
            seenAt: null
        });

        const io = getIO();
        io.to(`contract:${contractId}`).emit("newMessage", newMessage);

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        console.log("Error in Handle_Submit_Chat_message:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

async function Handle_Get_Chat_messages(req, res) {

    try {

        const contractId = req.params.contractId;

        const senderId = req.user.id;

        const contract = await contractModel.findById(contractId);
        if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });

        const isParticipant =
            contract.clientId.toString() === senderId.toString() ||
            contract.freelancerId.toString() === senderId.toString();

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: "Unauthorized access." });
        }

        // Get messages belonging to this contract
        const messages = await messageModel
            .find({
                contractId: contractId
            })
            .sort({
                createdAt: 1
            });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        });

    } catch (error) {

        console.log(
            "Error in Handle_Get_Chat_messages:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { Handle_Submit_Chat_message, Handle_Get_Chat_messages };