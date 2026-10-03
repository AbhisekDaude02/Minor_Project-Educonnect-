const User = require("../models/usersModel");

// controller for the user to upload the profilepictures

const profilepicture = async(req,res)=>{
    try {
        //Check whether the user upload image or not 

        if(!req.file){
          return res.status(401).json({
                message:"profile Picture is not uploaded"
            })
        }

        // Finding loggin user form  the database

        const user = await User.findById(req.user.userId);
        if(!user){
           return res.status(401).json({
                message:"user not found",
            })
        }

       user.profilepic = req.file.path;
       await user.save();

       res.status(200).json({
        message:"Profile uploaded successfully",
        profilepic:user.profilepic
       })
    } catch (error) {
        console.log(error);
        
       res.status(500).json({
        message:"Failed to upload the profilePicture"
       })
    }
}

module.exports =profilepicture;