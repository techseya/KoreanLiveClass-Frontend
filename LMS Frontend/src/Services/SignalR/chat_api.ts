import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const initChat = async (body:any) => {
    try {
        const response = await axios.post(api+`chat`,body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const postChatMessage = async (body:any) => {
    try {
        const response = await axios.post(api+`chat`,body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const readChatMessage = async (id:any) => {
    try {
        const response = await axios.put(api+`chat/mark-as-read/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getMessages = async (id:any) => {
    try {
        const response = await axios.get(api+`chat?threadId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}


export const getChatList = async (id:any) => {
    try {
        const response = await axios.get(api+`chat/chat-list?instructorId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}