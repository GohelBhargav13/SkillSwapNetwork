import { create } from "zustand"
import { axiosInstance } from "../libs/axios.js"
import { toast } from "react-hot-toast"

export const userLeaderBoardStore = create((set) => ({
  LeaderBoardDataFetch: [],
  isFetch: false,

  fetchLeaderBoard: async () => {
    set({ isFetch: true });
    try {
      const res = await axiosInstance.get("/leaderboard/userlist");
      console.log("LeaderBoard Response : ", res.data.data.finalResult);
      set({ LeaderBoardDataFetch: res.data.data.finalResult });
    } catch (error) {
      console.log("Error in Fetching LeaderBoard ", error);
      set({ LeaderBoardDataFetch: [] });
    } finally {
      set({ isFetch: false });
    }
  }
}));
