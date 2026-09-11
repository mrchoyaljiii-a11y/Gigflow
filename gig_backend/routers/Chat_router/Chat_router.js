const express = require("express");
const chat_router = express.Router();
const {Handle_Submit_Chat_message,Handle_Get_Chat_messages} = require('../../controllers/Chat_controller');
const authMiddleware =  require('../../middlewares/authMiddleware');

const multer = require("multer");
const storage = multer.memoryStorage();


const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});


chat_router.post(`/api/chat/message/:contractId`, authMiddleware, upload.array('attachments'),Handle_Submit_Chat_message);

chat_router.get(
    "/api/chat/:contractId",
    authMiddleware,
    Handle_Get_Chat_messages
);

module.exports = chat_router;