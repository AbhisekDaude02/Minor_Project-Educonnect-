const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
dotenv.config();

const userRoutes = require("./routes/userRoutes")


const app = express();
PORT = process.env.PORT
// Middelware
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Server is running successfully");
});

//Main routes API end points
app.use("/api/auth",userRoutes)

const startServer = async()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Server is running at port ${PORT}`);
    })

}
startServer();
