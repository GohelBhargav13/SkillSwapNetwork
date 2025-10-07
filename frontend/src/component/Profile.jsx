import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { axiosInstance } from "../libs/axios.js";
import UserPost from "./Post/UserPost.jsx";
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const { authUser } = useAuthStore();
  const [userPosts, setUserPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/user/posts")
      .then((res) => setUserPosts(res.data.data))
      .catch((err) => console.log("Error in fetch data : ", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-md shadow-md overflow-hidden">
      {/* Cover */}
      <div className="relative h-48 bg-black">
        <img
          alt="Banner"
          className="w-full h-full object-cover"
          src={authUser.bannerImage || "https://placehold.co/1200x200/000000/ffffff"}
        />
        {/* Profile avatar */}
        <div className="absolute bottom-0 left-10 translate-y-1/2">
          <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-300">
            <img
              alt="User avatar"
              src={authUser.avatar || "https://placehold.co/128x128/cccccc/000000?text=User+avatar"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Info + Actions */}
      <div className="px-16 pt-16 pb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{authUser.name}</h1>
          {/* <p className="text-gray-600 text-lg mt-1">{authUser.pronouns}</p> */}
          <div className="flex flex-wrap items-center space-x-4 mt-1">
            {/* <p className="text-gray-600">{authUser.headline}</p> */}
          </div>
          {/* <p className="text-gray-600 mt-2">{authUser.location}</p> */}
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => navigate("/create-post")}>Create Post</button>
          <button className="btn btn-outline btn-sm">Add profile section</button>
          <button className="btn btn-outline btn-sm">Enhance profile</button>
          <button className="btn btn-outline btn-sm">Resources</button>
        </div>
      </div>

      {/* Posts Section */}
      <UserPost userPosts={userPosts} />
    </div>
  );
};

export default Profile;
