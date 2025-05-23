import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getFamousCourses = async () => {
    try {
        const response = await axios.get(api+`course/famous`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getTopStudents = async () => {
    try {
        const response = await axios.get(api+`user/top-students`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getTopLocations = async () => {
    try {
        const response = await axios.get(api+`user/top-locations`)
        return response;
    } catch (error) {
        throw error;
    }
}