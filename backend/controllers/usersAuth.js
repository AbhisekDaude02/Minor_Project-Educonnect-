//User Registration controller

const User = require("../models/usersModel");

const userRegister = async (req,res)=>{
    try {
        const {fullName,email,password,role} = req.body;
//checking whether the user is fill all the field or not 
        if(!fullName || !email || !password || !role){
          return  res.status(500).json({
                message:"All the field are required"
            })
        }
// checking for the existing user from the email

const existingUser = await User.findOne({email});
if(existingUser){
    return res.status(409).json({
        message:"The user is already exist please login"
    })
}

// creating the user in the database
const user = User.create({
    fullName,
    email,
    password,
    role:"Professional"
});

return res.status(201).json({
    message:"User are created sucessfull !!",
    user:user
})


    } catch (error) {
        return res.status(500).json({
            message:"Failed to create the user"
        })
        
    }
}

module.exports = userRegister;