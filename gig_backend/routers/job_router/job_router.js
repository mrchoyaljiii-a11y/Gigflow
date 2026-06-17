const express = require('express');
const job_router = express.Router();
const { Handle_Addjob, Handle_Getjob, Handle_update_gob, Handle_delete_job, Handle_GetClientsJobs } = require('../../controllers/job_controller');
const upload = require('../../middlewares/upload_uploadFiles');
const authMiddleware = require('../../middlewares/authMiddleware');
// add job route
job_router.post('/api/gigs', authMiddleware, upload.single("attachment"), Handle_Addjob);

// get job route get the job to show in ob section based on search and filter and pagination
job_router.get('/api/get/gigs', Handle_Getjob);

// get jobs all the jobs posted by the  client
job_router.get('/api/get/client-jobs', authMiddleware, Handle_GetClientsJobs);

// update job status route
job_router.patch('/api/gigs/:gig_id', Handle_update_gob)

// delete the job
job_router.delete('/api/gigs/:gig_id', authMiddleware, Handle_delete_job)

module.exports = job_router;