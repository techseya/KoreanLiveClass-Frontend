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