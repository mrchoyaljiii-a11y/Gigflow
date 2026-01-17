const express = require('express');
const job_router = express.Router();
const {Handle_Addjob,Handle_Getjob} = require('../../controllers/job_controller');
// add job route
job_router.post('/api/gigs',Handle_Addjob);
// get job route
job_router.get('/api/get/gigs',Handle_Getjob);

module.exports = job_router;