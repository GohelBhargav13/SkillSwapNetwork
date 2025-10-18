import React, { useEffect, useState } from "react";
import { socket } from "../../Server.js";
import { toast } from "react-hot-toast";
import { StatusBadge } from "../../store/Skills.js";

const InProgress = ({ currentState, authUserData }) => {
  const [inProgressPost, setInProgressPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      setIsLoading(true);
      socket.emit("inProgressPost", { authUserData });

      socket.on("inProgressPostFetch", ({ posts, message }) => {
        setInProgressPost(posts);
        setIsLoading(false);
        // if (message) toast.success(message);
      });

      socket.on("RequestComplete",({ userId,postId,token,message }) => {
          // change the state of the setPost
          setInProgressPost((prevPost) => prevPost.filter((post) => post?._id !== postId && post?.postUserId !== userId));
          console.log(token)
          if(message) toast.success(message)
      })

      socket.on("errorPostLike", ({ message }) => {
        if (message) toast.error(message);
      });
      
    } catch (error) {
      setIsLoading(false);
      toast.error(error || "Error fetching in-progress posts");
    }finally {
      setIsLoading(false);
    }

    return () => {
      socket.off("inProgressPost");
      socket.off("inProgressPostFetch");
      socket.off("errorPostLike");
      socket.off("RequestComplete")
    };
  }, []);

  // handle the post complete logic of the in_progress post

  const handlePostComplete = async (postId,userId,acceptedUserId) => {
      socket.emit("requestPostComplete",{ postId,userId,acceptedUserId })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner text-primary"></span>
        <span className="ml-2 text-sm font-medium text-gray-600">
          Loading Posts...
        </span>
      </div>
    );
  }

  return (
    <>
      {currentState == "in_progressPost" && inProgressPost.length > 0 ? (
        <div
          className={`grid gap-4 p-3 ${
            inProgressPost.length > 2
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-1"
          }`}
        >
          {inProgressPost.map((post) => (
            <div
              key={post?._id}
              className="card bg-gray-900 border border-gray-200 shadow-sm hover:shadow-md transition duration-300 rounded-xl overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center p-3 border-b border-gray-100">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8">
                    <span className="text-xs font-semibold">
                      {post?.title?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-2">
                  <h2 className="font-semibold text-sm">{post.title}</h2>
                  <p className="text-[11px] text-gray-500">In Progress</p>
                </div>
              </div>

              {/* Description */}
              <div className="px-3 py-2 text-gray-700 text-xs">
                {post.description?.length > 100
                  ? post.description.slice(0, 100) + "..."
                  : post.description}
              </div>

              {/* Offered Skills */}
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">
                  Offered Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {post.offerSkills?.length > 0 ? (
                    post.offerSkills.map((skill, idx) => (
                      <span
                        key={`offer-${idx}`}
                        className="badge badge-primary badge-sm badge-outline text-[10px]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-[10px] italic">
                      None
                    </span>
                  )}
                </div>
              </div>

              {/* Wanted Skills */}
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-[10px] font-semibold uppercase text-gray-400 mb-1">
                  Wanted Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {post.wantSkills?.length > 0 ? (
                    post.wantSkills.map((skill, idx) => (
                      <span
                        key={`want-${idx}`}
                        className="badge badge-secondary badge-sm badge-outline text-[10px]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-[10px] italic">
                      None
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              
              <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100">
                <span
                  className={`badge badge-outline badge-${StatusBadge[post.skillStatus]} text-[10px] uppercase`}
                >
                  {post.skillStatus}
                </span>

                <div className="flex gap-1">
                  <button className="btn btn-xs btn-success text-white rounded-md hover:scale-105 transition"
                  onClick={() => handlePostComplete(post?._id,authUserData?._id,post?.acceptedUserId)}
                   >
                    Complete
                  </button>
                  <button className="btn btn-xs btn-error text-white rounded-md hover:scale-105 transition">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-400 text-sm italic">
            No Posts Available
          </span>
        </div>
      )}
    </>
  );
};

export default InProgress;
