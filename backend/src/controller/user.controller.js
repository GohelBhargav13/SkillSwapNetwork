import User from "../models/user.model.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import crypto from "crypto";
import {
  resetPasswordTemplate,
  sendEmail,
  verificationEmailTemplate,
} from "../utills/mail.js";

import uploadImageOnCloudinary from "../utills/cloudinary.js"
import Post from "../models/post.model.js";

export const registerUser = async (req, res) => {
  console.log(req.body);
  const { email, name, user_avatar, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiError(400, "User already exists"));
    }

    //check for the user_avatar is upload to the localpath
    console.log(req.file);
    const user_avatar_upload = req.file?.path;

    if(!user_avatar_upload){
        return res.status(400).json(new ApiError(400,"Image is not uploaded"))
    }

    const cloudPathImage = await uploadImageOnCloudinary(user_avatar_upload);
    if(!cloudPathImage){
        return res.status(400).json(new ApiError(400,"File is not uploaded in cloud"))
    }

    const newUser = await User.create({
      email,
      name,
      user_avatar:cloudPathImage,
      password,
    });

    //Generate email verification token
    const emailToken = newUser.generateEmailVerifiactionToken();

    await newUser.save();

    //Send verification email
    await sendEmail({
      email: newUser.email,
      subject: "Verification Email",
      mailgencontent: verificationEmailTemplate(name, emailToken.unhashedToken),
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: newUser._id, email: newUser.email,user_avatar:cloudPathImage },
          "User registerd sucessfully please Verify Your Email"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in Registering User", error.message)
      );
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log(token);
  
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);

    const userToken = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });
    if (!userToken) {
      return res.status(400).json(new ApiError(400, "User Not Found"));
    }

    userToken.emailVerificationToken = undefined;
    userToken.emailVerificationTokenExpires = undefined;
    userToken.isVerified = true;

    await userToken.save();

    res.status(200).json(
      new ApiResponse(200, {
        message: "User Email Verification Successfully",
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in Verifying User", error.message)
      );
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log({email,password})
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    //generate Access Token
    const accessToken = user.generateAccessToken();
    console.log(accessToken);

    //match the password of User
    const isMatched = user.comparePassword(password);
    if (!isMatched) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid Credential,Please Try Again"));
    }

    //check if user is verfied or not 
    if(user.isVerified === false){
      return res.status(400).json(new ApiError(400,"Please Verify Your Email"))
    }

    //check if user is disabled or not
    if(user.isDisabled){
      return res.status(400).json(new ApiError(400,"User is Disabled"))
    }

    //set Access Token into cookies
    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    }); // 24 hrs

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(201, { message: "User LoggedIn successfully" }));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in Login", error.message));
  }
};

export const getMe = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById({ _id: id }).select(
      "-password -__v -createdAt -updatedAt -isVerified -isDisabled"
    );
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    res.status(200).json(new ApiResponse(200, user, "User data Fetched"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in getMe", error.message));
  }
};
export const resetPasswordRequest = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not Found"));
    }

    const { unhashedPasswordToken, hashedPasswordToken, resetPasswordExpiry } =
      user.generateResetPasswordToken();

    user.passwordResetToken = hashedPasswordToken;
    user.passwordResetTokenExpires = resetPasswordExpiry;

    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      mailgencontent: resetPasswordTemplate(user.name, unhashedPasswordToken),
    });

    res.status(200).json(
      new ApiResponse(200, {
        message: "Please Check Your Mail For Password Reset",
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in resetPassword", error.message)
      );
  }
};

export const changePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not Found"));
    }

    const updateUser = await user
      .updateOne({ password })
      .select(
        "-_id -password -__v -createdAt -updatedAt -isVerified -isDisabled"
      );

    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;

    await user.save();

    if (updateUser.modifiedCount === 1) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, updateUser, "User Password Updated Successfully")
        );
    } else {
      return res
        .status(400)
        .json(new ApiError(400, "Error in Modification of Password"));
    }
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in changepassword", error.message)
      );
  }
};

export const userLogout = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    res.cookie("accesstoken", "", {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // res.cookie("jwt", "", {
    //   httpOnly: true,
    //   secure: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.status(200).json(new ApiResponse(200,{ message:"user Logout Successfully" }))

  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Internal Error in logout", error.message)
      );
  }
};

// find the user's post 
export const FindUserPost = async (req,res) => {
  const { id } = req.user
  try {

    if(!id){
      return res.status(404).json(new ApiError(404,"Id Was not Found"))
    }

    const data = await Post.find({postdBy:id}).select("-_id -updatedAt -__v -posthash -createdAt")
    .populate("postdBy","name user_avatar")
    .populate("post_comments.user","name user_avatar")
    console.log("All Data is : ",data)

    if(!data){
      return res.status(400).json(new ApiError(400,""))
    }

    res.status(200).json(new ApiResponse(200,data,"Post Fetched"))
    
  } catch (error) {
    res.status(500).json(new ApiError(500,"Internal Error in post Fetch"))
  }
}

// Find Me with the unique Style
export const FindMeWithUniqueStyle = async (req,res) => {
  const { name,userId } = req.params;
  try {

    if(!name || !userId){
      return res.status(404).json(new ApiError(404,"Name or User Id was not found"))
    }

    // find the data from the name and the userId
    const profileDetails = await User.findOne({name,_id:userId}).select("-_id -updatedAt -__v -password -createdAt")

    if(!profileDetails){
      return res.status(400).json(new ApiError(400,"404 Profile Not Found "))
    }

    res.status(200).json(new ApiResponse(200,profileDetails,"Profile Fetched"))
    
  } catch (error) {
    res.status(500).json(new ApiError(500,"Intenal Error in Profile Fetch"))
  }
}