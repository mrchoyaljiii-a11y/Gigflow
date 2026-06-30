const jobModel = require('../model/JobModel/Jobmodel');
const cloudinary = require('../connections/cloudinary');

// post the job
async function Handle_Addjob(req, res) {
    try {
        let job_attachment = null;
        if (req.file) {
            const uploadedResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "job_attachments",
                        resource_type: "raw",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(req.file.buffer);
            });

            job_attachment = uploadedResult.secure_url;
        }

        const jobData = req.body;
        const file = req.file;
        console.log("Received file:", file);
        console.log("Received job data:", jobData);

        const { jobtitle, projectCategory, BudgetType, experiance, Budget, timeline, skills, jobDescription, status } = jobData;

        console.log("Received job data:", jobData);

        const newJob = new jobModel({
            jobtitle,
            projectCategory,
            BudgetType,
            experiance,
            timeline,
            jobDescription,
            Budget,
            skills: JSON.parse(skills),
            status,
            job_attachment,
            clientId: req.user._id
        });

        const savedJOB = await newJob.save();

        return res.status(201).json({
            success: true,
            job: savedJOB,
            message: "Job added successfully"
        });
    }
    catch (error) {
        console.log("Error in Handle_Addjob:", error);
        res.status(500).send("Internal Server Error from Handle_Addjob");
    }
}

// get the job to show in ob section based on search and filter and pagination
async function Handle_Getjob(req, res) {
    try {
        const {
            pageNo = 1,
            limit = 6,
            search = "",
        } = req.query;

        // console.log("pageNo",pageNo,"limit",limit,"search",search);

        const page = parseInt(pageNo);
        const perPage = parseInt(limit);

        const skip = (page - 1) * perPage;


        let filter = {};

        if (search) {
            filter = {
                $or: [
                    { jobtitle: { $regex: search, $options: "i" } },
                    { projectCategory: { $regex: search, $options: "i" } },
                    { skills: { $regex: search, $options: "i" } },
                ]
            };
        }

        const jobs = await jobModel
            .find(filter)
            .skip(skip)
            .limit(perPage)
            .populate("clientId", "firstName lastName company profileImage email country state");

        const totalJobs = await jobModel.countDocuments(filter);

        // console.log("Fetched jobs:", jobs);
        // console.log("total jobs", totalJobs)

        // res.send(jobs);
        return res.json({
            success: true,
            jobs: jobs || [],
            totalJobs,
            page,
            totalPages: Math.ceil(totalJobs / perPage),
            message: jobs.length ? "Jobs fetched successfully" : "No jobs found"
        });
    }
    catch (error) {
        console.log("Error in Handle_Getjob:", error);
        res.status(500).send("Internal Server Error from Handle_Getjob");
    }
}

// get all the jobs posted by the client
async function Handle_GetClientsJobs(req, res) {
    try {
        const AuthenticatedClientID = req.user._id;
        const Clientjobs = await jobModel.find({ clientId: AuthenticatedClientID }).sort({ createdAt: -1 }).populate("clientId", "firstName lastName company profileImage email country state");
        return res.json({
            success: true,
            Clientjobs: Clientjobs || [],
            message: Clientjobs.length ? "Jobs fetched successfully" : "No jobs found"
        });

    } catch (error) {
        console.log("Error in Handle_GetClientsJobs:", error);
        res.status(500).send("Internal Server Error from Handle_GetClientsJobs");
    }
}

// update the job status like active, assigned, cancelled etc
async function Handle_update_gob(req, res) {
    try {
        const { gig_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is comming soon..."
            })
        }
        // console.log("Received gig_id and status:", gig_id, status);
        const updatedJob = await jobModel.updateOne(
            { _id: gig_id },
            { $set: { status: status } }
        );

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            job: updatedJob,
            message: "Job status updated successfully"
        });

    } catch (error) {
        console.error("Error in Handle_update_gob:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function Handle_delete_job(req, res) {

    try {
        const jobId = req.params.gig_id;
        console.log("Received gig_id:", jobId);
        const deleteJob = await jobModel.findByIdAndDelete(jobId);
        console.log("Deleted job:", deleteJob);

        if (!deleteJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            job: deleteJob,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.log("error in deleting the job", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while deleting the job"
        });
    }
}


module.exports = { Handle_Addjob, Handle_Getjob, Handle_update_gob, Handle_delete_job, Handle_GetClientsJobs };
