import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const deleteNotice = async (id:any) => {
    try {
        const response = await axios.delete(api+`today-lesson-notification?Id=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllNotices = async (token:any) => {
    try {
        const response = await axios.get(`${api}today-lesson-notification/notification`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const addNotice = async (token:any, body:any) => {
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

export const updateNotice = async (token:any, body:any) => {
    try {
        const response = await axios.put(`${api}today-lesson-notification`,body, {
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