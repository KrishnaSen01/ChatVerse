import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore";
import axios from "axios";

export const useChatStore = create((set,get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async ()=>{
        set({isUsersLoading:true});
        try{
            const res=await axiosInstance.get("/messages/users");
            set({users:res.data});
        }catch(error){
            toast.error(error.response.data.messages);
        }finally{
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosInstance(`messages/${userId}`);
            set({messages:res.data})
        } catch (error) {
            toast.error(error.response.data.messages);
        }finally{
            set({isMessagesLoading: false});
        }
    },

    sendMessages: async (messageData) => {
        const {selectedUser, messages} = get();
        try{
            const res= await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]})

        }catch(error){
            toast.error(error.response.data.message);

        }
    },

    //todo: optimize this one latter
    setSelectedUser: (selectedUser) => set({selectedUser}), 

    // sendMessage: async (messageData)=>{
    //     const {selectedUser, messages} = get();
    //     try {
    //         const res=await axiosInstance.
    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //     }
    // },
}))