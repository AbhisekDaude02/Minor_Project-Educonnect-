const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },

    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    resumeUrl:{
        type:String,
        default:""
    },

    coverLetter:{
        type:String,
        default:"",
        trim:true
    },

    status:{
        type:String,
        enum:["pending","selected","rejected","shortlisted"],
        default:"pending"
    }
},{timestamps:true});

//This helps us to maintained one applicant cant apply two or more time in the same jobor intership
jobApplicationSchema.index({job:1, applicant:1},{unique:true})

const JobApplication = mongoose.model("JobApplication",jobApplicationSchema);

module.exports = JobApplication;