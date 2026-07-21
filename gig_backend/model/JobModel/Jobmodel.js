const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// actual job schema
const JobModelSchema = new Schema({
    jobtitle: { type: String, required: true },
    projectCategory: { type: String, required: true },
    experiance: { type: String, required: true, lowercase: true },

    Project_Duration: {
        deliveryTime: {
            type: Number,
            required: true,
        },

        deliveryUnit: {
            type: String,
            // enum: ["Days", "Weeks", "Months"],
            // default: "Days",
            required: true
        }
    },

    jobDescription: { type: String, required: true },

    Budget: { type: Number, required: true },

    // minBudget:{ type: Number, required: true },
    // maxBudget:{ type: Number, required: true },

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
    },
    
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",

    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Job', JobModelSchema);



