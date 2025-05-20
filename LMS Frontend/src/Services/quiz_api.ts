import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getQuiz = async (id:any) => {
    try {
        const response = await axios.get(api+`quiz?courseId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getQuestions = async (id:any,type:any) => {
    try {
        const response = await axios.get(api+`question?quizId=${id}&type=${type}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createQuiz = async (body:any) => {
    try {
        const response = await axios.post(api+`quiz`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createQuestion = async (body:any) => {
    try {
        const response = await axios.post(api+`question`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateQuestion = async (body:any) => {
    try {
        const response = await axios.put(api+`question`, body)
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