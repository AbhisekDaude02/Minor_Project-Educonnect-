const mongoose = require("mongoose");

//User schema
const userSchema = new mongoose.Schema({
 fullName:{
    type:String,
    required:true,
    trim:true
 },

 email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true
 },
 password:{
    type:String,
    required:true,
    
 },
 role:{
    type:String,
    enum:["student","Professional"],
    default:"student"
 },

 isverified:{
   type:Boolean,
   default:false
 },
isLogging:{
   type:Boolean,
   default:false
},

profilepic:{
   type:String,
   default:""
},
 verificationToken:{
   type:String,

 },
 verificationTokenExpires:{
   type:Date,
 }
},{timestamps:true})

// Creating the model

const User = mongoose.model("User",userSchema);

// Exporting this model

module.exports = User;