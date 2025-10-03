import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isSingIn: false,
  isChecking: false,

  // User Checking Route
  checkinRoute: async () => {
    set({ isChecking: true });
    try {
      const res = await axiosInstance.get("/user/getme");
      console.log("Response of the checking Route : ", res.data);

      set({ authUser: res.data.data });
    } catch (error) {
      console.log("Error in checking ", error);
      set({ authUser: null });
    } finally {
      set({ isChecking: false });
    }
  },

  // User Login Route
  userLogin: async (data) => {
    set({ isSingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);
      console.log(res.data);

        set({ authUser: res.data.data });
        toast.success(res.data.message || "User Login Successfully");

    } catch (error) {
      console.error(error);
      toast.error("User Not Found Please Sign Up");
    } finally {
      set({ isSingIn: false });
    }
  },

  // user Logout Route
  userLogout: async () => {
    try {
      const res = await axiosInstance.get("/user/logout");
      console.log("Logout Response : ", res.data);

      set({ authUser: null });
      toast.success(res.data.message || "User Logout Successfully");
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error("Error While Logout");
    }
  },
}));
