// these is notificarion model which is used to save the notification in database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    // Who receives the notification client or freelancer
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Who triggered it client or freelancer
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    type: {
        type: String,
        enum: [
            "BID_ACCEPTED", //?client action
            "BID_REJECTED", //?client action
            "BID_VIEWED", //?client action
            "JOB_POSTED", //?client action
            "PROFILE_VIEWED", //?client action
            "PROFILE_VIEWED", //?client action
            "BID_SENT", //!freelancer action
            "BID_RECEIVED", //!freelancer action
            "BID_WITHDRAW", //!freelancer action
            "MESSAGE_RECEIVED", //*client or freelancer action
           
        ],
        required: true
    },

    message: {
        type: String,
        required: true
    },

    link: {
        type: String // where to redirect in frontend
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);