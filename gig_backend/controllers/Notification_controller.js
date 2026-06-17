const Notification = require("../model/notification/notification");
const User_model = require("../model/UserModel/User_model");
const jobModel = require("../model/JobModel/Jobmodel");
const bidModel = require("../model/GigModel/GigModel");
const { getIO } = require("../Socket/socket");

// get All notifications for logged-in user
async function getNotifications(req, res) {
    try {
        const notifications = await Notification.find({
            userId: req.user._id
        }).sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            isRead: false
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching notifications"
        });
    }
}

// send notification when client view freelancer profile and when client view freelancer bid
async function HandleView(req, res) {
    try {

        // console.log("HandleView called with query:", req.query);

        const { freelancer_id, action, bid_id } = req.query;

        console.log("HandleView called with:", { freelancer_id, action, bid_id });


        if (!freelancer_id || !action) {
            return res.status(400).json({
                success: false,
                message: "freelancer_id and action are required"
            });
        }

        const freelancer = await User_model.findById(freelancer_id);

        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: "Freelancer not found"
            });
        }

        let gig = null;

        if (bid_id) {
            gig = await bidModel.findById(bid_id).populate("gigId", "jobtitle");

            // console.log("Gig found for bid_id:", gig?.gigId?.jobtitle);

            if (!gig) {
                return res.status(404).json({
                    success: false,
                    message: "Gig not found"
                });
            }
        }
        // console.log("Gig found:", gig.jobtitle);

        //  ACTION CONFIG based on action type
        const ACTION_CONFIG = {
            view: {
                type: "PROFILE_VIEWED",
                message: (user) =>
                    `👀 ${user.firstName} ${user.lastName} viewed your profile!`,
                link: "/freelancer-profile"
            },
            bid_view: {
                type: "BID_VIEWED",
                message: (user) =>
                    `📄 ${user.firstName} ${user.lastName} viewed your bid! for ${gig?.gigId?.jobtitle || "your gig"}`,
                link: bid_id,
            }
        };

        const config = ACTION_CONFIG[action];

        if (!config) {
            return res.status(400).json({
                success: false,
                message: "Invalid action type"
            });
        }

        const io = getIO();

        //  Prevent spam (last 10 min)
        const existing = await Notification.findOne({
            userId: freelancer_id,
            senderId: req.user._id,
            type: config.type,
            createdAt: {
                $gte: new Date(Date.now() - 10 * 60 * 1000)
            }
        });

        if (existing) {
            return res.status(200).json({
                success: true,
                message: "Notification skipped (recently sent)",
                notification: existing
            });
        }

        //  Create notification
        const savedNotification = await Notification.create({
            userId: freelancer_id,
            senderId: req.user._id,
            type: config.type,
            message: config.message(req.user),
            link: config.link,
        });

        //  Socket Emit
        io.to(freelancer_id.toString()).emit("new_notification", savedNotification);

        console.log("📡 Notification sent via room:", freelancer_id);

        return res.status(200).json({
            success: true,
            message: "Notification sent successfully",
            notification: savedNotification
        });

    } catch (error) {
        console.log("❌ Error in view_profile:", error);

        res.status(500).json({
            success: false,
            message: "Error while sending notification"
        });
    }
}


async function Read_notification(req, res) {
    try {
        const { id } = req.params;
        // console.log("id", id)
        const updatedNotification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // console.log("Notification marked as read:", updatedNotification);

        return res.status(200).json({
            success: true,
            notification: updatedNotification,
            message: "Notification marked as read successfully"
        });
        
    } catch (error) {
        console.log("❌ Error in read notification:", error);

        res.status(500).json({
            success: false,
            message: "Error while reading notification"
        });
    }
}

module.exports = {
    getNotifications, HandleView, Read_notification
};