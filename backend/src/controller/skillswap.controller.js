import SkillSwap from "../models/skillswap.model.js";
import User from "../models/user.model.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import { skillStatus } from "../utills/constant.js";

//create a request post
export const createRequestPost = async (req, res) => {
  const { title, wantSkills, offerSkills, images } = req.body;
  try {
    const postUserId = req.user.id;
    //creating request Post
    const skillSwapReq = await SkillSwap.create({
      title,
      wantSkills,
      offerSkills,
      postUserId,
    });

    const user = await User.findById(postUserId).select(
      "-_id -__v -createdAt -updatedAt -passwordResetToken -passwordResetTokenExpires -isVerified -isDisabled -role -email -password "
    );
    console.log(skillSwapReq);

    if (!skillSwapReq) {
      return res
        .status(400)
        .json(new ApiError(400, "Error While creating request"));
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { skillSwapReq, postedUser: user },
          "Request Created Successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in creating request"));
  }
};

//get all post with STATUS:OPEN
export const getAllRequestPost = async (req, res) => {
  try {
    //getting the all post with status:OPEN
    const fetchAllPost = await SkillSwap.find({ skillStatus: skillStatus.OPEN })
      .populate("postUserId", "name user_avatar")
      .select("-_id -__v -createdAt -updatedAt");
    if (fetchAllPost.length === 0) {
      return res.status(400).json(new ApiError(400, "Post Are not Available"));
    }

    //forward in response
    res
      .status(200)
      .json(
        new ApiResponse(200, { fetchAllPost }, "Post Fetched Successfully")
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching request Posts"));
  }
};

//get post by Id
export const getRequestPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    //check if post is available or not
    const reqPost = await SkillSwap.findById(postId)
      .populate("postUserId", "name user_avatar")
      .select("-_id -__v -createdAt -updatedAt");
    if (!reqPost) {
      return res.status(400).json(new ApiError(400, "Post is not Found"));
    }

    //forward response
    res
      .status(200)
      .json(new ApiResponse(200, { reqPost }, "Post Fetched Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching req post by ID"));
  }
};

//request Accept controller
export const requestAccept = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await SkillSwap.findOne({
      _id: postId,
    })
      .select("-_id -__v -createdAt -updatedAt")
      .populate("postUserId", "name user_avatar");

    if (!post) {
      return res.status(404).json(new ApiError(404, "Post is not Found"));
    }

    //Here is post check status is not equal to open
    if (post.skillStatus !== skillStatus.OPEN) {
      return res
        .status(400)
        .json(new ApiError(400, "This request Already Taken by someone"));
    }

    //check the user itself cannot accept it's own request
    if(post.postUserId._id.toString() === req.user.id.toString()){
      return res.status(400).json(new ApiError(400,"You Can You Accept Your Own Request"))
    }

    //now update the status and accepted_id`
    const updatedpost = await SkillSwap.findByIdAndUpdate(
      postId,
      {
        $set: {
          skillStatus: skillStatus.IN_PROGRESS,
          acceptedUserId: req.user.id,
        },
      },
      { new: true }
    )
      .select("-_id -__v -createdAt -updatedAt")
      .populate("postUserId", "name user_avatar");

    await updatedpost.save(); // This is must remember for the save data in database
    return res
      .status(200)
      .json(
        new ApiResponse(200, { updatedpost }, "Request Accepted Successfully")
      );

  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in Accepting Request"));
  }
};

//request complete controller
export const requestComplete = async(req,res) => {
    const { postId } = req.params;
    try {
       const post = await SkillSwap.findById(postId);

       if(!post){
            return res.status(404).json(new ApiError(404,"Post not found"))
       }

       if(post.skillStatus !== skillStatus.IN_PROGRESS){
            return res.status(400).json(new ApiError(400,"Post Is Already Completed"))
       }

       //check only postedUser and acceptedUser only change the state of it
       if(post.postUserId.toString() !== req.user.id.toString()){
          return res.status(400).json(new ApiError(400,"You Have Not Permission To Change request this Post"))
       }

       //update the skillstatus to complete and token increment +10
       const user = await User.findById(req.user.id);
       if(!user){
        return res.status(404).json(new ApiError(404,"User Not Found"))
       }

        return res.status(200).json(new ApiResponse(200,{ result: await user.incrementToken(post.postUserId, post.acceptedUserId, postId) },"Request Updated Successfully"))
        
    } catch (error) {
        res.status(500).json(new ApiError(500,"Internal Error in complete Request"))
    }
}

//cancel Request controller
export const cancelRequest = async(req,res) => {
  const { postId } = req.params;
  try {

      const post = await SkillSwap.findById(postId);
      if(!post){
          return res.status(404).json(new ApiError(400,"Post not found"))
      }

      //check if the IN_PROGRESS than it make CANCEL
      if(post.skillStatus !== skillStatus.IN_PROGRESS){
        return res.status(400).json(new ApiError(500,"This Request is Not Cancel because of not in in_progress"))
      }


      //update the status into cancel
      post.skillStatus = skillStatus.CANCEL;
      await post.save(); // saving a data in database

      res.status(200).json(new ApiResponse(200,{ post },"Post Cancel Successfully"))
    
  } catch (error) {
      res.status(500).json(new ApiError(500,"Internal Error in canceling request"))
  }
}
