import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import Post from "./models/post.model.js";

dotenv.config();

// ✅ Create HTTP server (not app.listen)
export const server = createServer(app);

// ✅ Attach socket.io to the same HTTP server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// methods of the server
async function updateLikes(postId,userId,socket){
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


// ✅ Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("likePost", async ({ postId, userId }) => {
        updateLikes(postId,userId,socket);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

export default io;