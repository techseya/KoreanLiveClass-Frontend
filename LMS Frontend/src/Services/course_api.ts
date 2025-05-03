import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getTopCourses = async () => {
    try {
        const response = await axios.get(api+`course/top`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAllCourses = async () => {
    try {
        const response = await axios.get(api+`course/all`)
        return response;
    } catch (error) {
        throw error;
    }
}