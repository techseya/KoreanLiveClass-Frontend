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

export const getQuizById = async (id:any) => {
    try {
        const response = await axios.get(api+`quiz/by-id?quizId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getQuestions = async (id:any) => {
    try {
        const response = await axios.get(api+`question/by-quizid?quizId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getQuestionsForUser = async (id:any, userId:any) => {
    try {
        const response = await axios.get(api+`question?quizId=${id}&userType=1&userId=${userId}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getAnswer = async (id:any) => {
    try {
        const response = await axios.get(api+`question/by-id?questionId=${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createQuiz = async (body:any) => {
    try {
        const response = await axios.post(api+`quiz`,body,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateQuiz = async (body:any) => {
    try {
        const response = await axios.put(api+`quiz`,body,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteQuiz = async (id:any) => {
    try {
        const response = await axios.delete(api+`quiz/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const createQuestion = async (body:any) => {
    try {
        const response = await axios.post(api+`question`,body,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateQuestion = async (body:any) => {
    try {
        const response = await axios.put(api+`question`,body,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteQuestion = async (id:any) => {
    try {
        const response = await axios.delete(api+`question/${id}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const submitQuiz = async (body:any) => {
    try {
        const response = await axios.post(api+`question/validate`,body)
        return response;
    } catch (error) {
        throw error;
    }
}