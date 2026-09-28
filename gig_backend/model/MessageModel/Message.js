const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        contractId: {
            type: Schema.Types.ObjectId,
            ref: "contract",
            required: true,
            index: true,
        },

        senderId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        receiverId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        senderType: {
            type: String,
            enum: ["CLIENT", "FREELANCER"],
            required: true,
        },

        messageType: {
            type: String,
            enum: ["text", "file"],
            default: "text",
        },

        text: {
            type: String,
            trim: true,
            default: "",
        },

        attachments: [
            Schema.Types.Mixed
        ],

        status: {
            type: String,
            enum: ["sent", "delivered", "seen", "failed"],
            default: "sent",
        },

        deliveredAt: {
            type: Date,
            default: null,
        },

        seenAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", MessageSchema);