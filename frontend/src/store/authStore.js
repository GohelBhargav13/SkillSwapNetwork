import { create } from "zustand"
import { axiosInstance } from "../libs/axios.js"
import { toast } from "react-hot-toast"

export const useAuthStore = create((set) => ({
    authUser:null,
    isSignUp:false,
    isSingIn:false,

    userLogin: async(data) => {
        set({ isSingIn:true })
        try {
            const res = await axiosInstance.post("/auth/login",data)
            console.log(res.data)

            set({ authUser:res.data.data })
            toast.success(res.data.message || "Login Successfully")
            
        } catch (error) {
            console.error(error)
            toast.error("Error while Logged In")
        }
    }

}))