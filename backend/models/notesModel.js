const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },

    subject:{
        type:String,
        required:true,
        trim:true
    },

    university:{
        type:String,
        required:true,
        trim:true
    },
    program:{
        type:String,
        required:true,
        trim:true
    },

    semester:{
        type:String,
        required:true,
        trim:true
    },

    noteType:{
        type:String,
        enum:["Notes","Question Paper","Assignment","Lab Report","Other"],
        default:"Notes"
    },

    description:{
        type:String,
        trim:true
    },

    pdfUrl:{
        type:String,
        required:true,
        trim:true
    },
    publicId:{
        type:String,
        required:true
    },

    uploadedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},{timestamps:true});

const Notes = mongoose.model("Notes", noteSchema);
module.exports=Notes;