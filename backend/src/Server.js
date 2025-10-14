import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import Post from "./models/post.model.js";
import uploadImageOnCloudinary from "./utills/cloudinary.js";
import User from "./models/user.model.js";
import SkillSwap from "./models/skillswap.model.js";
import { skillStatus } from "./utills/constant.js";

dotenv.config();

export const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// methods of the server
async function updateLikes(postId, userId, socket) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      socket.emit("errorPostLike", { message: "Post Not Found" });
      return;
    }

    if (!post.post_likes.includes(userId)) {
      post.post_likes.push(userId);
      await post.save();

      io.emit("LikeUpdate", {
        postId: post._id,
        likeCount: post.post_likes.length,
        message: "Post Liked",
      });
    } else {
      post.post_likes = post.post_likes.filter(
        (Id) => Id.toString() !== userId.toString()
      );
      await post.save();
      io.emit("LikeUpdate", {
        postId: post._id,
        likeCount: post.post_likes.length,
        message: "Post DisLiked",
      });
    }
  } catch (error) {
    console.error("Error in likePost socket event:", error);
    socket.emit("errorPostLike", { message: "Internal Error in Post Like" });
  }
}

async function updateComment(postId, comment, userId, socket) {
  try {
    const newCommentOnPost = { user: userId, text: comment };
    const post = await Post.findById(postId);
    if (!post) {
      socket.emit("errorPostLike", { message: "Post Not Found" });
      return;
    }

    const newComment = await Post.findByIdAndUpdate(
      postId,
      { $push: { post_comments: newCommentOnPost } },
      { new: true }
    )
      .populate("post_comments.user", "name user_avatar")
      .select("-_id -postdAt -updatedAt -createdAt -__v");
    await newComment.save();

    console.log(newComment.post_comments.length);

    io.emit("CommentUpdate", {
      postId: post._id,
      Comment: newComment,
      commentCount: newComment.post_comments.length,
      message: "Comment Successfully",
    });
  } catch (error) {
    console.error("Error in likePost socket event:", error);
    socket.emit("errorPostLike", { message: "Internal Error in Post comment" });
  }
}

async function deleteComment(commentId, postId, socket) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      socket.emit("errorPostLike", { message: "Post Not Found" });
      return;
    }

    //  console.log("Before Delete", post.post_comments.length)
    if (post.post_comments.length > 0) {
      post.post_comments = post.post_comments.filter(
        (comment) => comment?._id != commentId
      );
    } else {
      socket.emit("errorPostLike", { message: "No Comment Found" });
    }
    await post.save();

    // console.log("After Delete",post.post_comments.length)
    io.emit("commentDeleted", {
      postId: postId,
      post: post,
      message: "Comment Deleted Successfully",
    });
  } catch (error) {
    socket.emit("errorPostLike", {
      message: "Intenal Error in deleting comment",
    });
  }
}

async function newRequest(data, authUser) {
  try {
    const postUserId = authUser?._id;
    //creating request Post
    const skillSwapReq = await SkillSwap.create({
      title: data.title,
      wantSkills: data.wantSkills,
      offerSkills: data.offerSkills,
      postUserId,
    });

    const user = await User.findById(postUserId).select(
      "-__v -createdAt -updatedAt -passwordResetToken -passwordResetTokenExpires -isVerified -isDisabled -role -email -password "
    );
    console.log(skillSwapReq);
    console.log("User Details : ", user);
    if (!skillSwapReq) {
      socket.emit("errorPostLike", { message: "Request Not Created" });
    }

    io.emit("newRequest", {
      skillSwapReq,
      userPostInfo: user,
      message: "Request Created Successfully",
    });
  } catch (error) {
    socket.emit("errorPostLike", { message: "Error While creating request" });
  }
}

async function requestAccepted(requestId, acceptUserId) {
  try {
    const post = await SkillSwap.findOne({
      _id: requestId,
    })
      .select("-__v -createdAt -updatedAt")
      .populate("postUserId", "name user_avatar");

    if (!post) {
      socket.emit("errorPostLike", { message: "Post Not Found" });
      return;
    }

    //Here is post check status is not equal to open
    if (post.skillStatus !== skillStatus.OPEN) {
      socket.emit("errorPostLike", {
        message: "This request Already Taken by someone",
      });
      return;
    }

    console.log(post);
    console.log(acceptUserId.toString());
    //check the user itself cannot accept it's own request
    if (post.postUserId._id.toString() === acceptUserId.toString()) {
      socket.emit("errorPostLike", {
        message: "You Cannot Accept Your Own Request",
      });
      return;
    }

    //now update the status and accepted_id`
    const updatedpost = await SkillSwap.findByIdAndUpdate(
      requestId,
      {
        $set: {
          skillStatus: skillStatus.IN_PROGRESS,
          acceptedUserId: acceptUserId,
        },
      },
      { new: true }
    )
      .select("-__v -createdAt -updatedAt")
      .populate("postUserId", "name user_avatar");

    await updatedpost.save(); // This is must remember for the save data in database
    io.emit("requestAccepted", { updatedpost, message: "Request Accepted" });
  } catch (error) {
    console.error(error);
    socket.emit("errorPostLike", { message: "Error while accepting request" });
  }
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("likePost", async ({ postId, userId }) => {
    await updateLikes(postId, userId, socket);
  });

  socket.on("commentPost", async ({ postId, comment, userId }) => {
    await updateComment(postId, comment, userId, socket);
  });

  socket.on("deleteComment", async ({ commentId, postId }) => {
    await deleteComment(commentId, postId, socket);
  });

  socket.on("newRequest", async ({ data, authUser }) => {
    await newRequest(data, authUser);
  });

  socket.on("acceptRequest", async ({ requestId, acceptUserId }) => {
      await requestAccepted(requestId, acceptUserId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

export default io;
