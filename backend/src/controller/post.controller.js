import Post from "../models/post.model.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import uploadImageOnCloudinary from "../utills/cloudinary.js";

//Create Post
export const createPost = async (req, res) => {
  const { title, description, post_images } = req.body;
  try {

    console.log(req.body);
    // console.log("This is the original Print for the files",req.files);

    //multiple file handling with the multer middleware
    const finalCloudArray = [];
    for(let file of req.files){
      const cloudinaryResponse = await uploadImageOnCloudinary(file.path);
      finalCloudArray.push(cloudinaryResponse);

      if(cloudinaryResponse === null){
        return res.status(400).json(new ApiError(400,"No Cloudinary Response"));
      }
    }

    console.log(finalCloudArray);

    //Add the post into Database
    const newPost = await Post.create({
      title,
      description,
      post_images:finalCloudArray,
      postdBy:req.user.id,
    });

    console.log(newPost);
    
    if (!newPost) {
      return res.status(400).json(new ApiError(400, "Post Is Not Created"));
    }

    //Fetched User details from the post
    const userFetched = await newPost.populate("postdBy", "name user_avatar");
    if (!userFetched) {
      return res.status(404).json(new ApiError(404, "User not Found"));
    }

    //store a hashed post details
    const hashedPost = newPost.generateHashOfPost(
      title,
      description,
      finalCloudArray
    );
    newPost.posthash = hashedPost;

    //Post saved in database
    await newPost.save();

    // console.log(newPost.post_likes.length)
    // console.log(newPost.post_images.length)

    res
      .status(201)  
      .json(new ApiResponse(201, { userFetched }, "Post Created Successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Error in Creating Post"));
  }
};

//Delete Post
export const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById({ _id: postId });
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post Not Found yet"));
    }

    const deletedPost = await Post.deleteOne({ _id: postId });
    if (!deletePost) {
      return res.status(400).json(new ApiError(400, "Error in Deleting Post"));
    }

    if (deletePost.deletedCount === 1) {
      res
        .status(200)
        .json(
          new ApiResponse(200, { deletedPost }, "Post is deleted Successfully")
        );
    } else {
      res.status(400).json(new ApiError(400, "Error in delete Post"));
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in deleting Post", error));
  }
};

//Like in post
export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { id } = req.user;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not found"));
    }
    console.log(post);

    //If User id is not include in post_like array than push it into array otherwise dislike it
    if (!post.post_likes.includes(id)) {
      post.post_likes.push(id);
      await post.save(); //This is must important for save the likes
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { LikeCount: post.post_likes.length,post },
            "Post Liked"
          )
        );
      return;
    } else {
      post.post_likes = post.post_likes.filter(
        (userId) => userId.toString() !== id.toString()
      );
      await post.save(); // This is must important for save the Dislikes

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { LikeCount: post.post_likes.length },
            "Post DisLiked"
          )
        );
      return;
    }
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Error in Like Section"));
  }
};

//post comment
export const commentPost = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { id } = req.user;
  try {
    const newCommentOnPost = { user: id, text: comment };
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json(new ApiError(404, "Post not Found"));
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

    res
      .status(200)
      .json(new ApiResponse(200, { newComment }, "Comment Successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Error in Comment"));
  }
};

//update post
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json(new ApiError(404, "Post is not found"));
    }

    if (post.ModifiedCount === 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, { post }, "Post Updated Successfully"));
    } else {
      return res.status(500).json(new ApiError(500, "Post not updated"));
    }
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal Error in updating Post"));
  }
};

//get All Post
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .select("-__v -updatedAt")
      .populate("postdBy", "name user_avatar")
      .populate("post_comments.user", "name user_avatar");
    if (posts.length === 0) {
      return res.status(400).json(new ApiError(400, "No Post Available"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, { posts }, "Posts Fetched Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in Fetching Posts "));
  }
};

//get Post By Id
export const getPostById = async(req,res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json(new ApiError(400, "Post is not Available"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, { post }, "Post Fetched Successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetching post by Id"));
  }
}
