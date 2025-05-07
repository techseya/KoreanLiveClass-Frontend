import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getRecordings = async (id:any) => {
    try {
        const response = await axios.get(api+`recording?sectionId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createRecording = async (body:any) => {
    try {
        const response = await axios.post(api+`recording`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateRecording = async (id:any, body:any) => {
    try {
        const response = await axios.put(api+`recording/${id}`, body)
        return response;
    } catch (error) {
        throw error;
    }
}