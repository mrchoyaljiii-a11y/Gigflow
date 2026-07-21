const express = require("express");
const client_router = express.Router();
const { updateClientProfile } = require("../../controllers/client_releted_controller");
const authMiddleware = require("../../middlewares/authMiddleware");

const multer = require("multer");
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    // ALLOW ONLY IMAGES
    if (
        file.mimetype.startsWith(
            "image"
        )
    ) {
        cb(null, true);
    }
    else {

        cb(
            new Error(
                "Only image files are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});


//router to update the client profile information
client_router.put("/api/client/profile", authMiddleware, upload.single(
    "profileImage"
), updateClientProfile);

module.exports = client_router;