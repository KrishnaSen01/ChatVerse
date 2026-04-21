import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";//
import axios from "axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    memberSince: null,
    onlineUsers: [],
    

    setMemberSince: async () => {
        try {
            const authUser = get().authUser; // ✅ correct
            console.log("before null return");
            console.log("(authUser?.createdAt):- ",authUser?.createdAt);
            

            if (!(authUser?.createdAt)) return null;
            console.log("after null return");
            
            // return authUser.createdAt.split("T")[0];
            set({ memberSince: authUser.createdAt.split("T")[0] });
        } catch (error) {
            console.log("error in setMemberSince:- ", { error });
            set({ memberSince: null });
        }
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("res:-", res);

            set({ authUser: res.data });

        } catch (error) {
            console.log("error in checkAuth:- ", { error });
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);

        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            console.log("res:- ", res);

            set({ authUser: res.data });
            toast.success("Logged in successfully");

            // get().connectSocket();
        } catch (error) {
            console.log("catch error in login");

            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            console.log("logged out run successfully");

            set({ authUser: null });
            toast.success("Logged Out successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            console.log("authUser: res.data", { authUser: res.data });

            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },


}))