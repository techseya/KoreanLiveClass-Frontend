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
