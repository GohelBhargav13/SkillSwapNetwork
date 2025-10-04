import React from "react";
import { useAuthStore } from "../store/authStore.js"
import LeaderBoard from "../component/Post/LeaderBoard.jsx";

const Firstpage = () => {
    const { authUser } = useAuthStore();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: User Info */}
        <aside className="hidden md:block">
          <div className="card bg-base-100 shadow-xl mb-4 p-5">
            <div className="flex flex-col items-center">
              <div className="avatar mb-3">
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={authUser?.image || "https://placeimg.com/192/192/people"} alt="User avatar" />
                </div>
              </div>
              <h2 className="font-bold text-lg text-center">{authUser.name}</h2>
              <div className="text-sm text-gray-600 mb-2 text-center">{authUser.headline}</div>
              <div className="text-xs text-gray-500 text-center">{authUser.location}</div>
              <div className="badge badge-outline badge-primary mt-2">{authUser.university}</div>
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
              <button className="btn btn-warning btn-sm w-full mb-2">Try Premium for ₹0</button>
              <ul className="menu bg-base-200 rounded-box">
                <li><a>Saved items</a></li>
                <li><a>Groups</a></li>
                <li><a>Newsletters</a></li>
                <li><a>Events</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Center: Posts */}
        <main className="col-span-1 md:col-span-1 flex flex-col gap-6">
          {/* Post Creation Card */}
          <div className="card bg-base-100 shadow p-4">
            <div className="flex gap-2 items-center mb-2">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={authUser.image} alt="User avatar" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Start a post"
                className="input input-bordered flex-1"
              />
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline btn-success btn-xs">Video</button>
              <button className="btn btn-outline btn-primary btn-xs">Photo</button>
              <button className="btn btn-outline btn-warning btn-xs">Write Article</button>
            </div>
          </div>
          {/* Posts List */}
          {[1, 2].map(postId => (
            <div key={postId} className="card bg-base-100 shadow p-5">
              <div className="flex gap-3 items-center mb-2">
                <div className="avatar">
                  <div className="w-9 rounded-full">
                    <img src={authUser.image} alt="" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">Hitesh Choudhary <span className="badge badge-outline badge-info">Verified</span></p>
                  <span className="text-xs text-gray-500">Retired corporate & full time YouTuber · 39m</span>
                </div>
              </div>
              <p className="mb-3">
                Example post content here. You can render actual post data from your database or component.
              </p>
              <div className="rounded-lg overflow-hidden">
                <img src="https://via.placeholder.com/600x300?text=Post+Image" alt="Post" />
              </div>
            </div>
          ))}
        </main>

        {/* Right: Leaderboard */}
        <LeaderBoard />
      </div>
    </div>
  );
};

export default Firstpage;
