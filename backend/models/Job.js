const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, default: "" },
  status: { type: String, enum: ["Applied", "Shortlisted", "Rejected", "Accepted"], default: "Applied" }
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  company: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  location: { type: String, default: "Remote", trim: true, maxlength: 160 },
  type: { type: String, enum: ["Internship", "Job"], required: true },
  skills: [{ type: String, trim: true, maxlength: 60 }],
  deadline: Date,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applications: [applicationSchema]
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
