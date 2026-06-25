const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//! its a bid model
const GigModel = new Schema({
    bid: { type: Number, required: true },

    timeline: { type: String, required: true },

    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    description: { type: String, required: true },

    status: {
        type: String,
        enum: ["pending", "hired", "rejected", "withdraw"],
        default: "pending"
    },

    viewd: {
        clientID: [String],
        freelancerID: [String],
        views: {
            type: Number,
            default: 0
        }
    },
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
        required: true
    },

}, { timestamps: true });
module.exports = mongoose.model('Bid', GigModel);