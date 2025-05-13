import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getVideos = async () => {
    try {
        const response = await axios.get(api+`korean-video`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createVideo = async (body:any) => {
    try {
        const response = await axios.post(api+`korean-video`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteVideo = async (id:any) => {
    try {
        const response = await axios.delete(api+`korean-video/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}