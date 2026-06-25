const express = require('express');
const router = express.Router();
const { Handle_CreateContract, Handle_GetContractById, Handle_create_milestone } = require("../../controllers/Contract_creation");
const authMiddleware = require('../../middlewares/authMiddleware');

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

router.post('/api/contract/create', authMiddleware, Handle_CreateContract);

router.get('/api/contracts/:contractId',
    authMiddleware,
    Handle_GetContractById
);

// create the miltestones for the contract
router.post(
    '/api/milestone/create',
    authMiddleware,
    upload.array('attachments', 5),
    (req, res, next) => {

        const totalSize = req.files.reduce(
            (sum, file) => sum + file.size,
            0
        );

        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB

        if (totalSize > MAX_TOTAL_SIZE) {
            return res.status(400).json({
                success: false,
                message: "Total file size cannot exceed 50 MB"
            });
        }

        next();

    },
    Handle_create_milestone
);

module.exports = router;