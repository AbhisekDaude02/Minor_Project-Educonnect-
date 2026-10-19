const User = require("../models/usersModel")
const allowRoles = (...roles)=>{
    return async (req,res,next)=>{
        try {
            const user = await User.findById(req.user.userId);

            if(!user){
                return res.status(400).json({
                    message:"The user not found"
                })
            }

            if(!roles.includes(user.role)){
                return res.status(400).json({
                    message:"You are not the authorized user"
                })
            }

            req.currentUser = user;
            next();
        } catch (error) {
            console.log("Error in the user allowMiddleware");
            res.status(500).json({
                message:"authorization failed",
                error:error.message
            })
            
        }
    }
}

module.exports = allowRoles;