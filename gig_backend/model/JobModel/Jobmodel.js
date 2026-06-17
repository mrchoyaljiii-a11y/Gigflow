const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// actual job schema
const JobModelSchema = new Schema({
    jobtitle: { type: String, required: true },
    projectCategory: { type: String, required: true },
    experiance: { type: String, required: true, lowercase: true },
    timeline: { type: String, required: true },
    jobDescription: { type: String, required: true },
    Budget: { type: Number, required: true },
    BudgetType: { type: String, required: true },
    skills: [String],
    status: { type: String, required: true },
    job_attachment: {
        type: String,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Job', JobModelSchema);



