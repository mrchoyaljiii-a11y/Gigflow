const jobModel = require('../model/JobModel/Jobmodel');

async function Handle_Addjob(req,res){
try {
    const jobData = req.body;
    // console.log("Received job data:",jobData);
    const {Freelancer_type,projectTitle,clientName,category,Timeline,description,minBudget,maxBudget,tags,status} = jobData;
    
    //  console.log("Received job data:",jobData);   

    const newJob = new jobModel({
        Freelancer_type,
        projectTitle,
        clientName,
        category,
        Timeline,
        description,
        minBudget,
        maxBudget,
        tags,
        status
    });

    const savedJOB = await newJob.save();

    return res.status(201).json({
        success:true,
        job:savedJOB,
        message:"Job added successfully"
    });
} 
catch (error) {
    console.log("Error in Handle_Addjob:", error);
    res.status(500).send("Internal Server Error from Handle_Addjob");
}
}

async function Handle_Getjob(req,res){
try {
    const jobs = await jobModel.find();
    // console.log("Fetched jobs:", jobs);
    return res.json({
        success:true,
        jobs: jobs || [],
        message: jobs && jobs.length ? "Jobs fetched successfully" : "No jobs found"
    });
} 
catch (error) {
    console.log("Error in Handle_Getjob:", error);
    res.status(500).send("Internal Server Error from Handle_Getjob");
}
}


module.exports =  {Handle_Addjob,Handle_Getjob};