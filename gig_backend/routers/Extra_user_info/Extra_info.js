const express = require('express');
const Extra_info_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { Handle_Add_portfolio, Handle_Add_Extra_info, Handle_Add_Extra_profileImg } = require('../../controllers/Add_extra_user_info');
// MULTER
const multer = require("multer");
const storage = multer.diskStorage({});

// FILE FILTER
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

// MULTER INSTANCE
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

Extra_info_router.post('/api/freelancer_extra_info/post', authMiddleware,
    // MULTIPLE IMAGE UPLOAD
    upload.array(
        "Portfolio_images",
        5
    ),
    Handle_Add_portfolio);


Extra_info_router.patch('/api/freelancer_extra_info/extra_info', authMiddleware, Handle_Add_Extra_info);

//for profile image
Extra_info_router.patch('/api/freelancer_extra_info/profileImg', authMiddleware,
    upload.single(
        "profileImage"
    ),
    Handle_Add_Extra_profileImg);

module.exports = Extra_info_router;