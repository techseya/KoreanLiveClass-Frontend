import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getWord = async () => {
    try {
        const response = await axios.get(api+`today-lesson`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllWords = async (token:any) => {
    try {
        const response = await axios.get(`${api}today-lesson-notification/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const addWord = async (token:any, body:any) => {
    try {
        const response = await axios.post(`${api}today-lesson-notification`,body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}