const express = require('express');
const job_router = express.Router();
const {Handle_Addjob,Handle_Getjob} = require('../../controllers/job_controller');
job_router.post('/api/gigs',Handle_Addjob);
job_router.get('/api/get/gigs',Handle_Getjob);

module.exports = job_router;