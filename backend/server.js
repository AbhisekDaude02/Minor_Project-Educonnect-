const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")
const connectDB = require("./db");
dotenv.config();

const userRoutes = require("./routes/userRoutes")
const connectionRoutes = require("./routes/connectionRoutes");
const postModel = require("./routes/postRoutes")


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
const startServer = async()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Server is running at port ${PORT}`);
    })

}
startServer();
