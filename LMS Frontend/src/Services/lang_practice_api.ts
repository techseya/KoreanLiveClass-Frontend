import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const createLanguagePractice = async (body: any,token:any) => {
    try {
        const response = await axios.post(api + `language-practice`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateLanguagePractice = async (body: any, token: any) => {
    try {
        const response = await axios.put(api + `language-practice`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteLanguagePractice = async (id: any, token: any) => {
    try {
        const response = await axios.delete(api + `language-practice/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getLanguagePractices = async (token: any) => {
    try {
        const response = await axios.get(api + `language-practice`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}