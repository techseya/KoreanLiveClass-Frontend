import axios from "axios";
import env from "src/env"; 

const api = env.BASE_URL;

export const getUsers = async (token: any) => {
    try {
        const response = await axios.get(`${api}admin/user-details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id:any, token: any) => {
    try {
        const response = await axios.delete(`${api}admin?userId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (body:any, token: any) => {
    try {
        const response = await axios.post(`${api}admin/manage-user`,body,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const assignCourse = async (body:any, token: any) => {
    try {
        const response = await axios.post(`${api}admin/assign-course`,body,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const assignQuizes = async (body:any, token: any) => {
    try {
        const response = await axios.post(`${api}admin/assign-quiz`,body,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAssignSections = async (courseId:any, userId:any, token: any) => {
    try {
        const response = await axios.get(`${api}admin/assigned-sections?courseId=${courseId}&userId=${userId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAlertUsers = async (token: any) => {
    try {
        const response = await axios.get(`${api}admin/alert-users`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (body:any, token:any) =>{
    try {
        const response = await axios.post(`${api}admin/password-reset`,body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (body:any, token:any) =>{
    try {
        const response = await axios.post(`${api}user/change-password`,body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const resetDevice = async (body:any, token: any) => {
    try {
        const response = await axios.post(`${api}admin/device-reset`,body,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUser = async (id:any, token: any) => {
    try {
        const response = await axios.get(`${api}admin/user-by-id?userId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
};