const express = require('express');
const Hired_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { Handle_SubmitHired, Handle_GetHired ,Handle_GetHiredByFreelancer} = require('../../controllers/Hired_controller');
// add route to hire a freelancer for a job
Hired_router.post('/api/hired', authMiddleware, Handle_SubmitHired)
//get hired freelancer details for a job
Hired_router.get('/api/hired/job/:jobId', authMiddleware, Handle_GetHired)
// get all hired records for a freelancer dashboard
Hired_router.get('/api/hired/freelancer/:freelancerId', authMiddleware, Handle_GetHiredByFreelancer)

module.exports = Hired_router