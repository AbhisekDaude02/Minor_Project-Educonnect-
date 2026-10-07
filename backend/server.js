const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http =require("http");
const {Server}= require("socket.io") 
const connectDB = require("./db");
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const postModel = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socketConnection= require("./socket/socket");
const notesRoutes = require("./routes/notesRoutes")


const app = express();
const PORT = process.env.PORT || 3000
// Middelware
app.use( cors({ origin: "http://localhost:5173", credentials: true }) );
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("Server is running successfully");
});

//Main routes API end points
app.use("/api/auth",userRoutes);
app.use("/api/connection",connectionRoutes)
app.use("/api/post",postModel)
app.use("/api/message", messageRoutes);
app.use("/api/notes",notesRoutes);

//Creating the server using the http 
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:[
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        credentials:true
    }
})

socketConnection(io);
const startServer = async()=>{
   try {
     await connectDB();
    server.listen(PORT,()=>{
        console.log(`Server is running at port ${PORT}`);
    })
   } catch (error) {
      console.log("Server failed to start:",error);
   }

}
startServer();
