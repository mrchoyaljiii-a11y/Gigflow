// these is for sending notification to users
const { getIO } = require("../../Socket/socket");

const emitNotification = (notification) => {

    const io = getIO();

    io.to(
        notification.userId.toString()
    )
    .emit(
        "new_notification",
        notification
    );

};


module.exports = emitNotification;