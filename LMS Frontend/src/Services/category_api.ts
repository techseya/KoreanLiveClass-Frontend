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
