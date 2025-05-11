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

export const createCourse = async (body:any) => {
    try {
        const response = await axios.post(api+`course`, body)
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateCourse = async (id:any, body:any) => {
    try {
        const response = await axios.put(api+`course/${id}`, body)
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

export const getSectionByCourseId = async (courseId:any) => {
    try {
        const response = await axios.get(api+`section?courseId=${courseId}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getRecordingsBySectionId = async (sectionId:any) => {
    try {
        const response = await axios.get(api+`recording?sectionId=${sectionId}`)
        return response;
    } catch (error) {
        throw error;
    }
}

export const getCourseByCategoryId = async (Id: any, token: any) => {
    try {
        const response = await axios.get(`${api}course?categoryId=${Id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getCourseByUserId = async (userId: any, token: any) => {
    try {
        const response = await axios.get(`${api}user/my-courses?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

