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

export const createLanguagePracticeQuestion = async (body: any, token: any) => {
    try {
        const response = await axios.post(api + `language-practice/question`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
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

export const updateLanguagePracticeQuestion = async (body: any, token: any) => {
    try {
        const response = await axios.put(api + `language-practice/question`, body, {
            headers: {
                "Content-Type": "multipart/form-data",
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

export const deleteLanguagePracticeQuestion = async (id: any, token: any) => {
    try {
        const response = await axios.delete(api + `language-practice/question/${id}`, {
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

export const getLanguagePracticeQuestions = async (practiceId: any, token: any) => {
    try {
        const response = await axios.get(api + `language-practice/question/${practiceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}