const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },

    company:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:["job","internship"],
        required:true
    },
    category: {
      type: String,
      default: "Other"
    },
    location: {
      type: String,
      required: true
    },
    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site"
    },
    salary: {
      type: String,
      default: "Not disclosed"
    },
    skills: [{
      type: String,
      trim: true
    }],
    experienceLevel: {
      type: String,
      enum: ["Entry-level", "Intermediate", "Experienced"],
      default: "Entry-level"
    },
    deadline: {
      type: Date,
      required: true
    },
    applicationInstructions: {
      type: String,
      default: ""
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open"
    }
},{timestamps:true});

const Job = mongoose.model("Job",jobSchema);
module.exports = Job