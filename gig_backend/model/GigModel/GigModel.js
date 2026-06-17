const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// freelancer schema info releted to freelancer for job/gig (Freelancer proposals) for job || its a bid model
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
        enum: ["pending", "hired", "rejected","withdraw"],
        default: "pending"
    },

    viewd: {
        clientID: [String],
        freelancerID: [String],
        views: {
            type: Number,
            default: 0
        }
    }

}, { timestamps: true });
module.exports = mongoose.model('Bid', GigModel);