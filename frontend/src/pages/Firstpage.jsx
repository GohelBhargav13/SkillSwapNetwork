import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore.js";
import { userLeaderBoardStore } from "../store/leaderBoard.js";
import LeaderBoard from "../component/Post/LeaderBoard.jsx";
import PostView from "../component/PostView.jsx";
import { useNavigate } from "react-router";
import { Plus,File } from "lucide-react"

const Firstpage = () => {

  const navigate = useNavigate();

  const { authUser } = useAuthStore();

  // Destructure leaderboard state and actions from the store
  const { isFetch, LeaderBoardDataFetch, fetchLeaderBoard } =
    userLeaderBoardStore();

    // fetch user profile with the all details
    const fetchUserProfile = async() => {
      navigate(`/profile`); 
      return
    }

  // fetch leaderboard data on component mount
  useEffect(() => {
    fetchLeaderBoard();
  }, [fetchLeaderBoard]);

  return (
    <div className="max-w-[1360px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_320px] gap-10">
        {/* Left: User Info  fetch from authUser */}
        <aside className="hidden md:block w-full max-w-[220px]">
          <div className="card bg-base-100 shadow-xl mb-4 p-5">
            <div className="flex flex-col items-center">
              <div className="avatar mb-3">
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      authUser?.user_avatar || "../assets/user.png"
                    }
                    alt="User avatar"
                  />
                </div>
              </div>
              <a className="cursor-pointer" onClick={() => fetchUserProfile(authUser.name,authUser?._id)}>
              <h2 className="font-bold text-lg text-center">{authUser.name}</h2>
              </a>
              <div className="text-sm text-gray-600 mb-2 text-center">
                {authUser?.headline}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {authUser?.location}
              </div>
              <div className="badge badge-outline badge-primary mt-2">
                {authUser?.university}
              </div>
            </div>
            <div className="divider" />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>Profile viewers</span>
                <span className="font-bold text-primary">36</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Post impressions</span>
                <span className="font-bold text-primary">18</span>
              </div>
              <div className="divider" />
              <a className="btn btn-primary" onClick={() => navigate("/create-post")}>
                <File className="font-bold" />
                <span>Create Post</span>
              </a>
               <a className="btn btn-primary" onClick={() => navigate("/new-request")}>
                 <Plus className="font-bold" />
                <span>New Request</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Center: Posts */}
        <main className="w-full flex flex-col gap-6 overflow-y-scroll h-[80vh] items-center">
          {/* Posts List Come from the Postview */}
          <div className="card bg-base-100 shadow p-5 w-full max-w-2xl">
            <PostView curerntUser={authUser} />
          </div>
        </main>

        {/* Right: Leaderboard come from the Leaderboard */}
        <LeaderBoard isFetch={isFetch} leaderBoardData={LeaderBoardDataFetch} />
      </div>
    </div>
  );
};

export default Firstpage;
