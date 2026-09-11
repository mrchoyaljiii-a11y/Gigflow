// these is for creating the notification and save in db for user not to send the notification
const Notification = require("../../model/notification/notification");

const createNotification = async (
    {
        userId,
        senderId,
        type,
        message,
        link
    },
    session = null
) => {

    const notification = new Notification({
        userId,
        senderId,
        type,
        message,
        link,
    });

    await notification.save({
        session
    });


    return notification;
};


module.exports = createNotification;