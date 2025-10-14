import React, { useState } from "react";
import { Heart, MessageCircle, Repeat } from "lucide-react";

const UserPost = ({ userPosts = [],currentState,authUserData }) => {
  const [ShowComment,setShowComment] = useState(false);
  return (
    <>  
    <div className="overflow-x-auto py-4">
      <div className="flex gap-6 w-[950px] px-5">
        {currentState === "post" && userPosts.map((post) => (
          <div
            key={post._id}
            className="card bg-gray-900 shadow-sm border border-gray-700 rounded-xl overflow-hidden text-white"
          >
            {/* Header: User avatar, name, meta */}
            <div className="flex items-center gap-3 px-5 pt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={
                    post.postdBy?.user_avatar ||
                    "https://placehold.co/128x128/cccccc/000000?text=User"
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-300 text-base">
                  {post.postdBy?.name}{" "}
                  <span className="text-xs text-gray-500">• You</span>
                </p>
                {/* Optional tagline example */}
                {/* <p className="text-xs text-gray-400">{user.headline}</p> */}
                <span className="text-xs text-gray-500">{post?.postdAt.slice(0,10)}</span>
              </div>
            </div>

            {/* Body: Description in black text */}
            <div className="px-5 py-3">
              <div className="text-white text-base mb-1">{post.description}</div>
              {post.post_images && post.post_images.length > 0 && (
                <div className="mt-3 relative">
                  <img
                    src={post.post_images[0]}
                    alt="post"
                    style={{"width":"100%","height":"100%"}}
                    className="rounded-lg w-full max-h-64 object-cover border border-gray-700"
                  />
                  {/* Multi-image indicator */}
                  {post.post_images.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                      1/{post.post_images.length}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Footer: reactions, comments and action icons, count badges */}
            <div className="px-5 pb-3 flex items-center gap-6 text-gray-400 text-xs">
              <div className="flex items-center gap-2">
                <span>
                  {post.post_comments.length > 0 ? (
                    <>
                      <div className="mt-2 justify-start  ">
                        {ShowComment && post.post_comments.map((comment, index) => (
                          <div
                        key={comment?._id}
                        className="flex items-start gap-2 group relative rounded-md pt-2 pb-3 "
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
                              {comment.user?.name === authUserData.name ? (
                                <p>You</p>
                              ): (
                                <p>{comment.user?.name}</p>
                              )}
                            </span>
                          </div>

                          {/* Comment text underneath, full width */}
                          <p className="text-sm text-base-content/80 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <span>No comments yet</span>
                  )}
                </span>
              </div>
            </div>
            <div className="divider my-0 border-gray-700" />
            <div className="px-5 pb-3 flex items-center justify-between gap-3 text-gray-400">
              <button className="btn btn-ghost btn-sm flex items-center gap-1 text-gray-400 hover:text-white">
                <Heart className="w-4 h-4" /> Like
                  <span>{post.post_likes.length || 0}</span>
              </button>
              <button className="btn btn-ghost btn-sm flex items-center gap-1 text-gray-400 hover:text-white"
              onClick ={() => setShowComment((prev) => !prev)}
              >
                <MessageCircle className="w-4 h-4" /> Comment
                <span>
                        {post.post_comments.length}
                        {post.post_comments.length > 1 ? "s" : ""}
                      </span>
              </button>
              <button className="btn btn-ghost btn-sm flex items-center gap-1 text-gray-400 hover:text-white">
                <Repeat className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ))}
        {userPosts.length === 0 && (
          <div className="text-center text-gray-500 py-8">No posts yet.</div>
        )}
      </div>
      </div>
    </>
  );
};

export default UserPost;
