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
              className="flex justify-between items-center px-2 py-1"
            >
              <img
                src={user.image || "https://placeimg.com/192/192/people"}
                alt="User avatar"
                className="w-[40px] h-8 rounded-full mr-2"
              />
              <span className="font-bold bg-accent">{user.rank}</span>
              <span>{user.name}</span>
              <span className="badge badge-primary">{user.token}</span>
            </li>
          ))}
        </ul>
        <h2 className="font-bold text-lg mb-2">LinkedIn News</h2>
        <ul className="list-disc list-inside text-sm mb-2">
          <li>From job seeker to CEO</li>
          <li>Tech startups on hiring spree</li>
          <li>Senior citizens eye second careers</li>
          <li>CFO churn hits India Inc</li>
          <li>Firms get pre-IPO makeovers</li>
        </ul>
        <div className="divider" />
        <div>
          <h2 className="font-bold text-base mb-2">Today's puzzles</h2>
          <div className="flex gap-2">
            <div className="card bg-base-200 p-3 flex-1">
              <span>Mini Sudoku</span>
            </div>
            <div className="card bg-base-200 p-3 flex-1">
              <span>Brain Teaser</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeaderBoard;
