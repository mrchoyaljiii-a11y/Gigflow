const express = require('express');
const Hired_router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {  Handle_GetHired ,Handle_GetHiredByFreelancer,Handle_GetAllHired} = require('../../controllers/Hired_controller');


//get hired freelancer details for a job
Hired_router.get('/api/hired/job/:jobId', authMiddleware, Handle_GetHired)
// get all hired records for a freelancer dashboard
Hired_router.get('/api/hired/freelancer/:freelancerId', authMiddleware, Handle_GetHiredByFreelancer)
// get all hired records for a client
Hired_router.get('/api/hired/client/', authMiddleware, Handle_GetAllHired)

module.exports = Hired_router