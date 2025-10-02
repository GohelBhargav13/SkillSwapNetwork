import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"

dotenv.config({path:"./.env"})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true}))
app.use(cookieParser())


app.use(cors({ 
    origin:["http://localhost:5173","http://localhost:5174"],
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    credentials:true,
 }))

 app.get("/",(req,res) => {
    res.json({ message:"This is root directory" })
 })

 //importing routes
 import userRoutes from "./routes/user.routes.js";
 import postRoutes from "./routes/post.routes.js";
import skillswapRoutes from "./routes/skillswap.routes.js";
import userLeaderBoard from "./routes/leaderboard.routes.js";

 //calling routes
 app.use("/api/v1/user",userRoutes)
 app.use("/api/v1/post",postRoutes)
 app.use("/api/v1/skillswap",skillswapRoutes)
 app.use("/api/v1/leaderboard",userLeaderBoard)

export default app;

