import express from "express";
import IsLoggedIn from "../middleware/auth.middleware.js";
import {
  cancelRequest,
  createRequestPost,
  getAllRequestPost,
  getInProgressRequestPost,
  getRequestPostById,
  requestAccept,
  requestComplete,
} from "../controller/skillswap.controller.js";
import { requestPostValidation } from "../validators/index.js";
import { validate } from "../middleware/validate.middleware.js";

const skillswapRoutes = express.Router();

//routing of the skillswap mechanism
skillswapRoutes.post(
  "/createrequest",
  IsLoggedIn,
  requestPostValidation(),
  validate,
  createRequestPost
);

skillswapRoutes.get("/getall", IsLoggedIn, getAllRequestPost);
skillswapRoutes.get("/:postId", IsLoggedIn, getRequestPostById);
skillswapRoutes.post("/:postId/accept", IsLoggedIn, requestAccept);
skillswapRoutes.post("/:postId/complete", IsLoggedIn, requestComplete);
skillswapRoutes.delete("/:postId/cancel", IsLoggedIn, cancelRequest);
skillswapRoutes.get("/inProgress",IsLoggedIn,getInProgressRequestPost)

export default skillswapRoutes;
