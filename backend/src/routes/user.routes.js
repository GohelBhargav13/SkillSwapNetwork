import express from "express";
import {
  changePassword,
  getMe,
  registerUser,
  resetPasswordRequest,
  userLogin,
  userLogout,
  verifyEmail,
} from "../controller/user.controller.js";
import IsLoggedIn from "../middleware/auth.middleware.js";
import {
  changePasswordValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validators/index.js";
import { validate } from "../middleware/validate.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  upload.single("user_avatar"),
  registerUserValidation(),
  validate,
  registerUser
);

userRoutes.get("/verify/:token", verifyEmail);
userRoutes.post("/login", loginUserValidation(), validate, userLogin);

userRoutes.get("/getme", IsLoggedIn, getMe);
userRoutes.get("/resetpassword", IsLoggedIn, resetPasswordRequest);

userRoutes.post(
  "/changepassword/:token",
  IsLoggedIn,
  changePasswordValidation(),
  validate,
  changePassword
);

userRoutes.get("/logout", IsLoggedIn, userLogout);

export default userRoutes;
