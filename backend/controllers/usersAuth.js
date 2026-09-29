//User Registration controller
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const User = require("../models/usersModel");
const sendEmail = require("../utils/SendEmail");

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

// Hashing the user password
const hashPassword = await bcrypt.hash(password,12);

//Creating the verification token
const verificationToken = crypto.randomBytes(36).toString('hex');

//Creating the verifiationToken expires

const verificationTokenExpires = new Date(Date.now()+50*60*1000)

// creating the user in the database
const user =await User.create({
    fullName,
    email,
    password:hashPassword,
    role,
    isverified:false,
    verificationToken,
    verificationTokenExpires

});

//creating the verification url
const verificationUrl = `${process.env.SERVER_URL}/api/auth/verifyemail/${verificationToken}`

//Sending the email to the user to verify the email
await sendEmail(
    email,
    "Verify your Educonnect account",
    `<h2>Welcome to Educonnect, ${fullName}!</h2>

        <p>Thank you for registering.</p>

        <p>Please click the button below to verify your email:</p>

        <a 
          href="${verificationUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Verify Email
        </a>

        <p>This verification link expires in 15 minutes.</p>
        `
)
return res.status(201).json({
    message:"User are created sucessfull.check your email to verify",
    user:user
})


    } catch (error) {
        return res.status(500).json({
            message:"Failed to create the user"
        })
        
    }
}


// Creating the controller for verifying the user

const verifyEmail = async (req,res)=>{
    try {
        const {token} = req.params;

        const user =  await User.findOne({
            verificationToken:token,
            verificationTokenExpires:{
                $gt: new Date()
            }
        })

        if(!user){
            return res.status(400).json({
                message:"verification fail or verification Expires"
            })
        }

        user.isverified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        res.status(201).json({
            message:"Email verifies successfully go to the login"
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        
    }
}

// Creating the Login of the user

const loginUser = async (req,res)=>{
    try {
        const {email,password} =req.body;


    if(!email|| !password){
        return res.status(400).json({
            message:"field is missing",
        })
    }

    // Verify whether the user is verified or not 

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"invalid field!!"
        })
    }

    if(!user.isverified){
        return res.status(403).json({
            message:"Please verify your email !!"
        })
    }

    const iscorrectPassword = await bcrypt.compare(password,user.password);

    if(!iscorrectPassword){
        return res.status(400).json({
            message:"invalid password !!"
        })
    }
    
    //Creating the jwttoken

    const token = jwt.sign(
        {
            userId:user._id
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:"7d"
        }
    )
    
   //Saving to the cookies

  res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV ==="production",
    sameSite:process.env.NODE_ENV === "production"?"none":"lax",
    maxAge: 7 * 24 *60 *60 *1000
  });
  user.isLogging = true
  await user.save();
  res.status(200).json({
    message:"Login successfully !!",
    user:{
        id:user._id,
        email:user.email,
        name:user.fullName,
        isLogging:user.isLogging,
        isverified:user.isverified
        
    }
  })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

// Logout the user
const userLogout = async(req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV ="production",
            sameSite:process.env.NODE_ENV = "production"? "none":"lax"
        })

       return res.status(200).json({
            message:"User logout successfully !!"
        })
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message:"Failed to logout the user"
        })
    }
}

module.exports ={ userRegister,verifyEmail,loginUser,userLogout};