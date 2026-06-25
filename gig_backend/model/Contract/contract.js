const mongoose = require('mongoose');
const { create, removeAllListeners } = require('../freelancer/Hired');
const Schema = mongoose.Schema;

const MilestoneSchema = new Schema({

    milestoneTitle: {
        type: String,
        required: true
    },
    milestoneDescription: {
        type: String,
        required: true
    },
    milestoneAmount: {
        type: Number,
        required: true
    },
    milestoneDueDate: {
        type: Date,
        required: true
    },

    milestoneStatus: {
        type: String,
        enum: [
            "pending",      // created but work not started
            "in_progress",  // freelancer working
            "submitted",    // freelancer submitted work
            "approved",     // client approved
            "released",     // payment released milestone complete
            "cancelled",    // milestone cancelled
            "disputed"      // dispute raised
        ],
        default: "pending"
    },

    attachments: [Schema.Types.Mixed],

    createdAt: {
        type: Date,
        default: Date.now
    },
})


paymentSchema = new Schema({
    totleBudget: {
        type: Number,
        required: true
    },
    totalReleased: {
        type: Number,
        default: 0
    },
    remainingAmount: {
        type: Number,
        default: 0
    },
    inpendingAmount: {
        type: Number,
        default: 0
    },

})

const ContractSchema = new Schema({

    contractNumber: {
        type: String,
        unique: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    bidId: {
        type: Schema.Types.ObjectId,
        ref: "Bid",
        required: true
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    contractType: {
        type: String,
        enum: ["Fixed", "Hourly"],
        required: true
    },

    contractTitle: {
        type: String,
        required: true
    },

    AgreedPrice: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    contractStatus: {
        type: String,
        enum: ["pending", "active", "completed", "disputed", "cancelled"],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    completionDate: {
        type: Date
    },

    cancellationDate: {
        type: Date
    },

    milestones: [MilestoneSchema],

    payment: paymentSchema,

},
    {
        timestamps: true
    });

module.exports = mongoose.model("contract", ContractSchema);