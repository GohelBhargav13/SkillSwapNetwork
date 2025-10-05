import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { Swiper, SwiperSlide } from "swiper/react"; // fro the image sliding
import { toast } from "react-hot-toast"

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Pagination, Navigation } from "swiper/modules";


function PostView() {
  const [loading, setLoading] = useState(false);
  const [posts, setPost] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let isMouted = true;
      const getPostData = async () => {
      setLoading(true);
     
      try {
        const posts = await apiClient.getAllPost();
        console.log(posts);
        if (posts.StatusCode >= 400) {
          toast.error(posts.Message)
        } else if(isMouted) {
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

    return () => {
      isMouted = false;
    }
  }, []);

  //Like Post Function
  const likePost = async ({_id}) => {
    try {
      const response = await apiClient.likePost(_id);
      console.log(response);
    
      if (response.StatusCode >= 400) {
        console.log(response.Message);
        toast.error(response.Message);
        return;
      } else {
        console.log(response.message);
        toast.success(response.message);
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error in Post Fetching");
    }
  };

  //comment Post Function
  const commentPost = async ({ _id }, comment) => {
    console.log({ _id, comment });
    try {
      const response = await apiClient.commentPost(_id, comment);
      console.log(response);

      if (response.StatusCode >= 400) {
        toast.error(response.Message);
        return;
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Error in post Comment");
      return;
    }
    setComment("");
  };

  return (
    <div>
  {loading ? (
    <span className="loading loading-infinity loading-xl"></span>
  ) : (
    <div className="m-5 p-5 flex flex-col gap-10 items-center w-full">
      {posts.map((post, index) => (
        <article
          className="card bg-base-100 shadow-sm border rounded-lg w-full max-w-xl"
          key={index}
        >
          {/* Header: user info */}
          <header className="flex items-start gap-4 p-4">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full">
                <img src={post.postdBy.user_avatar} alt="avatar" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">
                    {post.postdBy.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Software Engineer • {post.postdAt.slice(0, 10)}
                  </p>
                </div>
                <div>
                  <button className="btn btn-ghost btn-sm">⋯</button>
                </div>
              </div>
              <p className="text-md text-white mt-3">
                {post.description}
              </p>
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
                onClick={() => likePost(post)}
              >
                {`👍 Like    ${post.post_likes.length}`}
              </button>
              <button className="btn btn-ghost btn-sm flex-1 rounded-md">
                💬 Comment
              </button>
            </div>
          </div>
          {/* Comments */}
          <div className="p-4 border-t">
            {post.post_comments?.map((comment, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-semibold text-shadow-fuchsia-50 text-start">
                    {comment.user}
                  </p>
                  <p className="text-sm text-shadow-fuchsia-50 text-start">{comment.text}</p>
                </div>
            ))}
          </div>
          {/* Comment preview / add comment area */}
          <div className="px-4 py-3 border-t">
            <div className="flex items-start gap-3">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <img src={post.postdBy.user_avatar} alt="me" />
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
                onClick={() => commentPost(post, comment)}
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
