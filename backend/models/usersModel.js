
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({

    // =================================
    // COMMON USER INFORMATION
    // =================================

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "professional"],
        default: "student"
    },

    profilepic: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 500,
        default: ""
    },

    website: {
        type: String,
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
    },

    github: {
        type: String,
        default: ""
    },

    // =================================
    // STUDENT INFORMATION
    // =================================

    university: {
        type: String,
        default: ""
    },

    program: {
        type: String,
        default: ""
    },

    semester: {
        type: String,
        default: ""
    },

    // =================================
    // PROFESSIONAL INFORMATION
    // =================================

    jobTitle: {
        type: String,
        default: ""
    },

    company: {
        type: String,
        default: ""
    },

    experienceLevel: {
        type: String,
        enum: [
            "",
            "Fresher",
            "Intern",
            "Junior",
            "Mid-Level",
            "Senior",
            "Expert"
        ],
        default: ""
    },

    skills: {
        type: [String],
        default: []
    },

    // =================================
    // ACCOUNT INFORMATION
    // =================================

    isverified: {
        type: Boolean,
        default: false
    },

    isLogging: {
        type: Boolean,
        default: false
    },

    // =================================
    // EMAIL VERIFICATION
    // =================================

    verificationToken: {
        type: String
    },

    verificationTokenExpires: {
        type: Date
    },

    // =================================
    // PASSWORD RESET
    // =================================

    resetToken: {
        type: String
    },

    resetTokenExpires: {
        type: Date
    }

}, {
    timestamps: true
});

// Creating the model
const User = mongoose.model("User", userSchema);

// Exporting the model
module.exports = User;
