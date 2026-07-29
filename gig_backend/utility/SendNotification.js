const { getIO } = require("../Socket/socket");
const Notification = require("../model/notification/notification");

const sendNotification = async (
    { userId, senderId, type, message, link }) => {
    try {
        const notification = new Notification({
            userId,
            senderId,
            type,
            message,
            link,
        });

        await notification.save();

        const io = getIO();

        io.to(userId.toString()).emit("new_notification", notification);

    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

module.exports = sendNotification;
