const User = require("../models/usersModel");
const Connection = require("../models/connectionModel");
const Message = require("../models/messageModel");

const onlineUsers = new Map();

const checkFriendShip = async (user1,user2)=>{
    const connection = await Connection.find({
        $or:[
            {
                sender:user1,
                recevier:user2,
                status:"accepted"
            },
            {
                sender:user2,
                recevier:user1,
                status:"accepted"
            }
        ]
    })

    return connection;
}


const socketConnection = (io)=>{
    io.on("connection",(socket)=>{
        console.log("user Connected",socket.id);
        
   
//userOnline

socket.on("user-online",(userId)=>{
    onlineUsers.set(userId.toString(),socket.id);
    console.log("User online:",userId);
    io.emit("user-online",{
        userId
    })
});

// sending the realtime message

socket.on("send-message",async(data)=>{
    try {
        const {senderId,recevierId,content}=data;
         
        if(!content || content.trim()===""){
            socket.emit("message-error",{
                message:"Content cannot be the empty"
            })
            return
        }

        if(senderId.toString()===recevierId.toString()){
            socket.emit("message-error",{
                message:"You cannot send message to yourself"
            })
            return
        }

        const areFriend = await checkFriendShip(senderId,recevierId);
        if(!areFriend) {
            socket.emit("message-error",{
                message:"You are allowed to send message with your friend only"
            })
            return
        }

        const newMessage = await Message.create({
            sender:senderId,
            recevier:recevierId,
            content:content.trim()

        });

        await newMessage.populate("sender","fullName email role profilepic")
        .populate("recevier","fullName email role profilepic");

        //find the recevier socket
        const receiversocketId = onlineUsers.get(recevierId.toString());

        //Send to recevier

        if(receiversocketId){
            io.to(receiversocketId).emit("recevie-message",newMessage);
        }

        //send back  to sender

        socket.emit("message-sent",newMessage);
        console.log("message sent successfully")
    } catch (error) {
        console.log("Erro in sending the message",error)

        socket.emit("message-error",{
            message:"failed to sent the message"
        })

        
    }
})

//For typing

socket.on("typing",async(data)=>{
    
        const{senderId,recevierId}=data;

        const receiversocketId = onlineUsers.get(recevierId.toString());
        if(receiversocketId){
            io.to(receiversocketId).emit("user-typing",{senderId})
        }
})

// For stop Typing

socket.on("stop-typing",async(data)=>{
    const {senderId,recevierId}= data;
    const receiversocketId = onlineUsers.get(recevierId.toString());

    if(receiversocketId){
        io.to(receiversocketId).emit("user-stop-typing",{senderId})
    }
})

//For disconnecting the user

socket.on("disconnect",()=>{
    console.log("User disconnected:",socket.id);
    
    for(const [userId,socketId] of onlineUsers.entries()){
        if(socketId === socket.id){
            onlineUsers.delete(userId);

            io.emit("user-offline",{userId});
            console.log("User-offline",userId);
            break;
        }
    }
})
 })
}

module.exports = socketConnection;