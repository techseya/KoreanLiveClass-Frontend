import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getSections = async (id:any) => {
    try {
        const response = await axios.get(api+`section?courseId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createSection = async (body:any) => {
    try {
        const response = await axios.post(api+`section`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateSection = async (id:any, body:any) => {
    try {
        const response = await axios.put(api+`section/${id}`, body)
        return response;
    } catch (error) {
        throw error;
    }
}