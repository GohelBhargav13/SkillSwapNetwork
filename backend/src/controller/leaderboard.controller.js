import User from "../models/user.model.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";

export const leaderBoard = async (req, res) => {
  try {
    const LeaderBoarduser = await User.find({ token: { $gt: 0 } })
      .sort({ token: -1 })
      .limit(3)
      .select(
        "-__v -createdAt -updatedAt -passwordResetToken -passwordResetTokenExpires -isVerified -isDisabled -password -role"
      );

    const finalResult = LeaderBoarduser.map((user, index) => {
      return { ...user._doc, rank : index + 1 };
    });

    console.log(finalResult);

    res
      .status(200)
      .json(
        new ApiResponse(200, { finalResult }, "User's Found Successfully")
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching a User data"));
  }
};
