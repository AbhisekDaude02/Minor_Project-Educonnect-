const User = require("../models/usersModel");
const Connection = require("../models/connectionModel");
const Message = require("../models/messageModel");
const { set } = require("mongoose");


// At first defing the function to check the user are fried or not 

const friendShipCheck = async (user1,user2)=>{
    
        const connection = await Connection.findOne({
            $or:[
                {
                    sender:user1,
                    recevier:user2,
                    status:"accepted"
                },

                {
                    sender:user2,
                    recevier:user1,
                    status:"accepted",
                }
            ]
        })

        return connection;
    
}


// Making the controller to send the message
  const sendMessage = async (req,res)=>{
    try {
        const senderId = req.user.userId;
        const recevierId = req.params.userId;
        const {content}= req.body;

        if(!content || content.trim()===""){
            return res.status(400).json({
                message:"Content is needed",
            })
        }

        //user cant send message to himself

        if(senderId === recevierId){
            return res.status(400).json({
                message:"You are not allowed to message yourself"
            })
        }

        const recevier = await User.findById(recevierId);

        if(!recevier){
            return res.status(400).json({
                message:"recevier doenot exist"
            })
        }

        const areFriend = await friendShipCheck(senderId,recevierId);

        if(!areFriend){
            return res.status(400).json({
                message:"Your are not friend so failed to message"
            })
        }

        const newMessage = await Message.create({
            sender:senderId,
            recevier:recevierId,
            content:content.trim()
        });

        await newMessage.populate("sender","fullName email role profilepic");
        await newMessage.populate("recevier","fullName email role profilepic");

        res.status(200).json({
            message:"Message sent successfull ",
            message:newMessage
        })
    } catch (error) {
        console.log("Error in the sending message",error);
        res.status(500).json({
            message:"Failed to send the message",
            error:error.message
        })
        
    }
  }

  

// Making the controller for the geting the message

const getMessage = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const friendId =req.params.userId;

        const friend = await friendShipCheck(userId,friendId);
        if(!friend){
            return res.status(400).json({
                message:"You both are not friend so you can see message of your friend"
            })
        }

        const message = await Message.find({
            $or:[
                {
                   sender:userId,
                   recevier:friendId 
                },

                {
                    sender:friendId,
                    recevier:userId
                }
            ]
        })

        .populate("sender","fullName email role profilepic")
        .populate("recevier","fullName email role profilepic").sort({createdAt:1});

        res.status(200).json({
            message:"Message recevied successfully",
            message
        })
    } catch (error) {
        console.log("Error in geting message");
        return res.status(500).json({
            message:"Failed to get the message",
            error:error.message
        })
        
        
    }
}



// Making the controller to get all the conversation
 
const getAllConversation = async (req,res)=>{
    try {
        const userId = req.user.userId;

        const messages = await Message.find({
            $or:[{sender:userId},{recevier:userId}]
        })

        .populate("sender","fullName email role profilepic")
        .populate("recevier","fullName email role profilepic")
        .sort({createdAt:-1});

        const conversations = [];
        const users = new Set();

        for(const message of messages ){
            let otherusers;
            if(message.sender._id.toString()===userId.toString()){
                otherusers = message.recevier;
            }else{
                otherusers= message.sender;
            }
        

        const otherusersId = otherusers._id.toString();
         if(!users.has(otherusersId)){
            users.add(otherusersId);

            conversations.push({
                user:otherusers,
                lastmessage:message
            })
         }
        }
            res.status(200).json({

            message: "Conversations fetched successfully",

            conversations

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to fetch conversations",

            error: error.message

        });

    }

};


//Making the controller for markhasread
const markMessagesAsRead = async (req, res) => {
    try {

        const userId = req.user.userId;
        const otherUserId = req.params.userId;

        const result = await Message.updateMany(
            {
                sender: otherUserId,
                recevier: userId,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        console.log("Messages updated:", result);

        res.status(200).json({
            message: "Messages marked as read",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to mark messages as read",
            error: error.message
        });

    }
};


module.exports = {sendMessage,getMessage,getAllConversation,markMessagesAsRead};