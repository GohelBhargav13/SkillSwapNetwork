import express from "express";
import {
  commentPost,
  createPost,
  deleteComment,
  deletePost,
  getAllPost,
  getPostById,
  likePost,
  updatePost,
} from "../controller/post.controller.js";
import IsLoggedIn from "../middleware/auth.middleware.js";
import { uploadForPost } from "../middleware/postImageMulter.middleware.js";
import {
  commentPostValidation,
  createPostValidation,
} from "../validators/index.js";
import { validate } from "../middleware/validate.middleware.js";

const postRoutes = express.Router();

postRoutes.post(
  "/createpost",
  IsLoggedIn,
  uploadForPost.array("post_images", 10),
  createPostValidation(),
  validate,
  createPost
);

postRoutes.delete("/deletepost/:postId", IsLoggedIn, deletePost);
postRoutes.post("/:postId/like", IsLoggedIn, likePost);

postRoutes.post(
  "/:postId/comment",
  IsLoggedIn,
  commentPostValidation(),
  validate,
  commentPost
);

postRoutes.post("/updatepost/:postId", IsLoggedIn, updatePost);
postRoutes.get("/getall", IsLoggedIn, getAllPost);
postRoutes.get("/getpostbyid/:postId", IsLoggedIn, getPostById);
postRoutes.delete("/:commentId/:postId",IsLoggedIn,deleteComment)

export default postRoutes;
