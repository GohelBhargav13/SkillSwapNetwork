import React from "react";
import { Loader } from "lucide-react";

const LeaderBoard = ({ isFetch, leaderBoardData }) => {
  if (isFetch) {
    return (
      <div className="w-full mt-10 p-3 flex justify-center items-center">
        <Loader className="animate-spin mx-auto text-primary w-6 h-6" />
        <span className="ml-2 text-md font-semibold">Loading Leaderboard...</span>
      </div>
    );
  }

  return (
    <aside className="w-full md:w-[350px] lg:w-[358px]">
      <div className="card bg-base-100 shadow-xl p-5">
        <h2 className="font-bold text-xl mb-4 border-b pb-2 text-center">
          Leaderboard
        </h2>

        <ul className="menu bg-base-200 rounded-box divide-y divide-base-300">
          {leaderBoardData.map((user, idx) => (
            <li
              key={user.name}
              className="flex flex-row items-center justify-between hover:bg-base-300 rounded-md py-2 px-3 transition-all"
            >
              {/* Rank */}
              <span className="font-bold bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shrink-0">
                {user.rank}
              </span>

              {/* Avatar and Name */}
              <div className="flex items-center space-x-3 flex-1 px-3 min-w-0">
                <img
                  src={user.user_avatar || "https://placeimg.com/192/192/people"}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border border-gray-300"
                />

                <span className="font-medium text-sm md:text-base truncate break-words max-w-[180px]">
                  {user.name}
                </span>
              </div>

              {/* Tokens */}
              <span className="badge badge-primary text-xs md:text-sm px-3 py-2 whitespace-nowrap">
                {user.token}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default LeaderBoard;
