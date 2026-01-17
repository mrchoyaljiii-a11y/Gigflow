const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// actual job schema
const JobModelSchema = new Schema({
    Freelancer_type:{type:String,required:true},
    projectTitle:{type:String,required:true},
    clientName:{type:String,required:true},
    category:{type:String,required:true,lowercase:true},
    Timeline:{type:String,required:true},
    description:{type:String,required:true},
    minBudget:{type:Number,required:true},
    maxBudget:{type:Number,required:true},
    tags: [String],
    status:{type:String,required:true},
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Job', JobModelSchema);



