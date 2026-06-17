// these is for freelancer hired by client
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HiredSchema = new Schema({
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
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    freelancerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clientCompanyName: {
        type: String,
        required: true
    },
    agreedPrice: {
        type: Number,
        required: true
    },
    // timeline: {
    //     type: String,
    //     required: true
    // },
    gigName:{
        type: String,
        required: true
    },
    hiredStatus: {
        type: String,
        enum: ["hired", "pending", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Hired", HiredSchema);
