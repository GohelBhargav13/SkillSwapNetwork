import express from "express"
import { leaderBoard } from "../controller/leaderboard.controller.js";

const userLeaderBoard = express.Router();

userLeaderBoard.get("/userlist",leaderBoard)

export default userLeaderBoard