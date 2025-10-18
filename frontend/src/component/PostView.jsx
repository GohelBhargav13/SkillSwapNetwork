import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { Swiper, SwiperSlide } from "swiper/react"; // fro the image sliding
import { toast } from "react-hot-toast";
import { Flag, Trash } from "lucide-react";
import { axiosInstance } from "../libs/axios.js";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Pagination, Navigation } from "swiper/modules";
import { socket } from "../Server.js";

function PostView({ curerntUser }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPost] = useState([]);
  const [comment, setComment] = useState("");
  const [showComment, SetShowComments] = useState(false);

  console.log(curerntUser);

  useEffect(() => {
    let isMouted = true;
    const getPostData = async () => {
      setLoading(true);

      try {
        const posts = await apiClient.getAllPost();
        console.log(posts);
        if (posts.StatusCode >= 400) {
          toast.error(posts.Message);
        } else if (isMouted) {
          setPost(posts.data.posts);
        }
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        if (isMouted) setLoading(false);
      }
    };
    getPostData();
    
    // Listen of the UpdateLike
    socket.on("LikeUpdate", ({ postId,UserId,likeCount, message }) => {
      console.log({postId, likeCount, message})
      setPost((prevPost) => prevPost.map((post) => post._id === postId ? { ...post, post_likes: likeCount } : post));
      if (UserId === curerntUser?._id && message) toast.success(message);
    });

    socket.on("CommentUpdate",({ postId,UserId,Comment,commentCount,message }) => {
      console.log({postId,Comment,commentCount,message})
      setPost((prevpost) => prevpost.map((post) => post._id === postId ? {...post,post_comments:Comment.post_comments,commentCount:commentCount} : post))
      if(UserId === curerntUser?._id && message) { 
        toast.success(message) 
        setComment("") 
      }
    })

    socket.on("commentDeleted",({postId,post,data_other,message}) => {
        console.log({postId,post,data_other,message})
          setPost((prevpost) => prevpost.map((postD) => postD?._id === postId ? {...postD,post_comments:post.post_comments} : postD) )
        if(message) toast.success(message)
    })

    socket.on("NewPost",({post,postedBy,message}) => {
      console.log({ post,postedBy,message })
      setPost((prevPost) => [...prevPost,post])
      if(message) toast.success(message);

    })

    // Listen of the error from socket
    socket.on("errorPostLike", ({ message }) => {
      if (message) toast.error(message);
    });

    return () => {
      isMouted = false;
      socket.off("LikeUpdate");
      socket.off("errorPostLike");
      socket.off("CommentUpdate");
      socket.off("commentDeleted");
      socket.off("NewPost");
    };
  }, []);

  // Like Post Event occuring
  const handlePostLike = (postId, userId) => {
    console.log({ postId, userId });
    socket.emit("likePost", { postId, userId });
    console.log("Like Post Event Emitting");
  };

   // Comment Post Event occuring
  const handlePostComment = (postId,comment,userId) => {
    console.log({postId,comment,userId})
    socket.emit("commentPost",{ postId,comment,userId});
    console.log("Comment Post Event Emitting");
  }

  // Delete Comment Post Event Occuring
  const handleDeleteComment = (commentId,postId) => {
    console.log({commentId,postId})
    socket.emit("deleteComment",{ commentId,postId })
    console.log("Delete Comment On Post Event Emitting")
  }  

    //Like Post Function
  // const likePost = async ({ _id }) => {
  //   try {
  //     const response = await apiClient.likePost(_id);
  //     console.log(response);

  //     if (response.StatusCode >= 400) {
  //       console.log(response.Message);
  //       toast.error(response.Message);
  //       return;
  //     } else {
  //       console.log(response.message);
  //       toast.success(response.message);
  //       return;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.message || "Error in Post Fetching");
  //   }
  // };

  //delete Comment Function
   //comment Post Function
  // const commentPost = async ({ _id }, comment) => {
  //   console.log({ _id, comment });
  //   try {
  //     const response = await apiClient.commentPost(_id, comment);
  //     console.log(response);

  //     if (response.StatusCode >= 400) {
  //       toast.error(response.Message);
  //       return;
  //     } else {
  //       toast.success(response.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Error in post Comment");
  //     return;
  //   }
  //   setComment("");
  // };
  
  // const deleteComment = async ({ _id }, postData) => {
  //   console.log("Getting into the Delete Comment");
  //   try {
  //     const res = await apiClient.deletePostComment(_id, postData?._id);

  //     if (res.StatusCode < 400) {
  //       toast.success(res.message);
  //     } else {
  //       toast.error(res.Message);
  //     }
  //   } catch (error) {
  //     console.log("Internal Error in the deleting Comment");
  //   }
  // };
  return (
    <div>
      {loading ? (
        <span className="loading loading-infinity loading-xl"></span>
      ) : (
        <div className="m-5 p-5 flex flex-col gap-10 items-center w-full">
          {posts.map((post, index) => (
            <article
              className="card bg-gray-800 shadow-sm border rounded-lg w-full max-w-xl"
              key={index}
            >
              {/* Header: user info */}
              <header className="flex items-start gap-4 p-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img
                      src={
                        post.postdBy?.user_avatar ??
                        "https://static.vecteezy.com/system/resources/previews/046/010/545/non_2x/user-icon-simple-design-free-vector.jpg"
                      }
                      alt="avatar"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {post.postdBy?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Member • {post.postdAt.slice(0, 10)}
                      </p>
                    </div>
                    <div>
                      <button className="btn btn-ghost btn-sm">⋯</button>
                    </div>
                  </div>
                  <p className="text-md text-white mt-3">{post.description}</p>
                </div>
              </header>
              {/* Media: image / carousel placeholder */}
              <figure className="px-4 pb-4">
                <Swiper
                  modules={[Pagination, Navigation]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={10}
                  slidesPerView={1}
                  className="rounded-md"
                >
                  {post.post_images.map((src, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={src}
                        alt={`post media ${idx}`}
                        className="w-full h-72 object-cover rounded-md"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </figure>
              {/* Stats (likes, comments) */}
              <div className="px-4 pb-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        className="w-6 h-6 rounded-full border-2 border-white"
                        src="https://placehold.co/40x40"
                        alt=""
                      />
                      <img
                        className="w-6 h-6 rounded-full border-2 border-white"
                        src="https://placehold.co/41x41"
                        alt=""
                      />
                    </div>
                    <span>{post.post_comments.length}</span>
                  </div>
                  <div>
                    <span>{post.post_comments.length} comments</span>
                  </div>
                </div>
              </div>
              {/* Actions (Like / Comment / Repost / Send) */}
              <div className="border-t px-4 py-2">
                <div className="flex items-center justify-between">
                  <button
                    className="btn btn-ghost btn-sm flex-1 rounded-md"
                    onClick={() => handlePostLike(post?._id, curerntUser?._id)}
                  >
                    {`👍 Like    ${typeof post.post_likes === "number" ? post.post_likes : post.post_likes.length}`}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm flex-1 rounded-md"
                    onClick={() => SetShowComments((prev) => !prev)}
                  >
                    💬 Comment
                  </button>
                </div>
              </div>
              {/* Comments */}
              {post.post_comments.length > 0 ? (
                <div className="p-4 border-t space-y-4">
                  <div className="rounded-md text-center text-gray-500 text-lg font-semibold">
                    {post.post_comments.length} Comment
                  </div>
                  {showComment &&
                    post.post_comments?.map((comment, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 group relative bg-gray-900 rounded-md pt-2 pb-3 px-3 shadow-md "
                      >
                        {/* Avatar & content */}
                        <img
                          src={comment.user?.user_avatar}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover mt-[2px] border"
                        />

                        <div className="flex-1">
                          {/* Name and trash icon in header row */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-base-content/90 text-sm">
                              {comment.user?.name}
                            </span>
                            {/* Dropdown menu */}
                            <div className="dropdown dropdown-end">
                              <button
                                tabIndex={0}
                                className="btn btn-ghost btn-xs px-1"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx="5" cy="12" r="2" />
                                  <circle cx="12" cy="12" r="2" />
                                  <circle cx="19" cy="12" r="2" />
                                </svg>
                              </button>
                              <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-24"
                              >
                                {comment.user?._id === curerntUser?._id ? (
                                  <li>
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(comment?._id,post?._id)
                                      }
                                      className="text-error flex items-center gap-2"
                                    >
                                      <Trash size={14} /> Delete
                                    </button>
                                  </li>
                                ) : (
                                  <li>
                                    <button className="text-xs text-warning">
                                      Report
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Comment text underneath, full width */}
                          <p className="text-sm text-base-content/80 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-8 border rounded-md text-center text-gray-500 text-lg font-semibold">
                  No comments yet.
                </div>
              )}

              {/* Comment preview / add comment area */}
              <div className="px-4 py-3 border-t">
                <div className="flex items-start gap-3">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img src={curerntUser.user_avatar} alt="me" />
                    </div>
                  </div>
                  <input
                    className="input input-bordered input-sm w-full"
                    placeholder="Write a comment..."
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="btn btn-square w-[120px]"
                    onClick={() => handlePostComment(post._id,comment,curerntUser._id)}
                  >
                    comment
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostView;
