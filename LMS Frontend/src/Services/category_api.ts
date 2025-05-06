import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getCategories = async () => {
    try {
        const response = await axios.get(api+`category`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createCategory = async (body:any) => {
    try {
        const response = await axios.post(api+`category`,body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateCategory = async (id:any, body:any) => {
    try {
        const response = await axios.put(api+`category/${id}`,body)
        return response;
    } catch (error) {
        throw error;
    }
}