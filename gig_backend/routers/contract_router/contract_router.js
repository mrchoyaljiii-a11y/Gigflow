const express = require('express');
const router = express.Router();
const { Handle_HireFreelancer_CreateContract, Handle_GetContractById, Handle_create_milestone, Handle_GetAllContracts,
    Handle_milestone_Actions,Handle_UploadWork
} = require("../../controllers/Contract_creation");
const authMiddleware = require('../../middlewares/authMiddleware');

const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

router.post('/api/contract/create', authMiddleware, Handle_HireFreelancer_CreateContract);

// get sepecific contract
router.get('/api/contracts/:contractId',
    authMiddleware,
    Handle_GetContractById
);

//get all contracts
router.get(
    "/api/contracts",
    authMiddleware,
    Handle_GetAllContracts
);

// create the miltestones for the contract
router.post(
    '/api/milestone/create',
    authMiddleware,
    upload.array('ClientAttachments', 5),
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

// accept the milestone
router.put('/api/milestone/actions', authMiddleware, Handle_milestone_Actions);

//upload work by freelancer 
router.post('/api/milestone/upload_Freelancer_Work', authMiddleware, upload.array('FreelancerAttachments'), Handle_UploadWork);

module.exports = router;