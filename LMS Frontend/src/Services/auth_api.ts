import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const register = async (body:any) => {
    try {
        const response = await axios.post(api+`auth/register`,body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const login = async (body:any) => {
    try {
        const response = await axios.post(api+`auth/login`,body)
        return response;
    } catch (error) {
        throw error;
    }
}