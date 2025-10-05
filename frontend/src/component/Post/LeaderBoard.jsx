import React from "react";
import { Loader } from "lucide-react";
const LeaderBoard = ({ isFetch, leaderBoardData }) => {
  if (isFetch) {
    return (
      <div className="w-full mt-10 p-3 justify-start items-start">
        <Loader className="animate-spin mx-auto" />
      </div>
    );
  }
  return (
    <aside className="hidden md:block">
      <div className="card bg-base-100 shadow-xl p-5">
        <h2 className="font-bold text-lg mb-3">Leaderboard</h2>
        <ul className="menu bg-base-200 rounded-box mb-3">
          {leaderBoardData.map((user, idx) => (
            <li
              key={user.name}
              className="flex flex-row p-2 justify-between items-center px-2 py-1"
            >
              <span className="font-bold bg-accent px-5">{user.rank}</span>
              <img
                src={user.image || "https://placeimg.com/192/192/people"}
                alt="User avatar"
                className="w-[40px] h-8 rounded-full"
              />
              <span className="font-bold px-5">{user.name}</span>
              <span className="badge badge-primary">{user.token}</span>
            </li>
          ))}
        </ul>

      </div>
    </aside>
  );
};

export default LeaderBoard;
