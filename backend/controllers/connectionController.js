const { connection } = require("mongoose");
const Connection = require("../models/connectionModel");
const User = require("../models/usersModel");

// Making the controller for the sending the friend request

const sendFriendRequest = async (req,res)=>{
    try {
        const senderId = req.user.userId;
        const recevierId= req.params.userId;

        //user cannot send friend request to yourself
        if(senderId === recevierId){
           return  res.status(400).json({
                message:"You are not allow to send friend request to yourself"
            })
        }
        const recevier= await User.findById(recevierId);
        if(!recevier){
           return res.status(400).json({
                message:"User doesnt exist"
            })
        }

        //Checking whether there is already connection or not 

        const existingConnection = await Connection.findOne({
            $or:[
                {
                    sender:senderId,
                    recevier:recevierId
                },
                {
                    sender:recevierId,
                    recevier:senderId
                }
            ]
        });

        if(existingConnection){
            if(existingConnection.status === "pending"){
                return res.status(400).json({
                    message:"you already send the friend request"
                })
            }
            if(existingConnection.status === "accepted"){
                return res.status(400).json({
                    message:"You are already friend with this user"
                })
            }

            if(existingConnection.status === "rejected"){
                existingConnection.sender=senderId;
                existingConnection.recevier=recevierId;
                existingConnection.status="pending";
                await existingConnection.save();
                return res.status(201).json({
                    message:"Friend request send successfully"
                })
            }
        }
        //Creating the new friend request
            const connection = await Connection.create({
                sender:senderId,
                recevier:recevierId,
                status:"pending"
            })
         
          res.status(201).json({
            message:"new Friend request send successfully",
            connection
          })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message:"Faild to send the friend request",
            error:error.message
        })
    }
}

// Making controller for the getting friend request
const getFriendRequest = async (req,res)=>{
    try {
        const userId = req.user.userId;
        const request = await Connection.find({
            recevier:userId,
            status:"pending"
        }).populate("sender","fullName,email,role,profilepic").sort({created:-1});
        res.status(200).json({
            message:"friend request get sucessfully",
            request
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Failed to get the request",
            error:error.message
        })
        
    }
}

// Making the controller for accepting the request

const acceptFriendRequest = async(req,res)=>{
    try {
        const userId = req.user.userId;
       const requestId = req.params.requestId;

        const request = await Connection.findOne({
            _id:requestId,
            recevier:userId,
            status:"pending"

        });

        if(!request){
            return res.status(400).json({
                message:"request not found"
            });

        }
          request.status="accepted"
            await request.save();
            res.status(200).json({
                message:"Friend request accepted successfully",
                connection:request
            })
    } catch (error) {
        console.log("error in accepting friend request");
        res.status(500).json({
            message:"Failed to accept the friend request"
        })
        
    }
}

//Making controller for reject the friend request

const rejectFriendRequest = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const requestId = req.params.requestId;

        const request = await Connection.findOne({
            _id:requestId,
            recevier:userId,
            status:"pending"
        });

        if(!request){
            return res.status(400).json({
                message:"User not found"
            });
        }

        request.status ="rejected";
        await request.save();

        res.status(200).json({
            message:"Friend request rejected Successfully",
            
        })
    } catch (error) {
        console.log("Error in the rejection",error);
        res.status(500).json({
            messeage:"Failed to reject the request"
        })
        
        
    }
}

//Get all my friends

const getMyFriends = async (req,res)=>{
    try {
       const userId = req.user.userId;
       
       const connections = await Connection.find({
        $or:[
            {
                sender:userId,
                recevier:userId
            }
        ],
        status:"accepted"
       }).populate("sender","fullName,email,role,profilepic").populate("recevier","fullName,email,role,profilepic");

        const friends = connections.map((connection) => {

            if (
                connection.sender._id.toString() ===
                userId.toString()
            ) {
                return connection.recevier;
            }

            return connection.sender;
        });

        return res.status(200).json({
            friends
        });

    } catch (error) {

        console.error("Get friends error:", error);

        return res.status(500).json({
            message: "Failed to get friends",
            error: error.message
        });
    }
};



module.exports ={sendFriendRequest,getFriendRequest,acceptFriendRequest,rejectFriendRequest,getMyFriends}