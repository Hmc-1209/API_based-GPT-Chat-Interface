import axios from "axios";
import { api_host } from "./config";

const get_access_token = async (user_name, user_password) => {
    // Get the access token for user to do actions.
    //  Param: 
    //    user_name: The user's username for login.
    //    user_password: The user's password for login.
    //  Return:
    //    INTEGER: Status for frontend to take actions.
    //    response.data.detail: Detail information for frontend to take actions.
    const formData = new FormData();
    formData.append("username", user_name);
    formData.append("password", user_password);
    
    try {
        const response = await axios.post(`${api_host}/token`, formData, {
            headers: {
                accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            validateStatus: function (status) {
                return (status >= 200 && status < 300) || status === 404;
            },
        });
        if (response.data.access_token) {
            console.log(response.data.access_token);
            // window.localStorage.setItem("access_token", response.data.access_token);
            return 1;
        } else {
            return response.data.detail;
        }
    } catch (error) {
        return 5;
    } 
};
export default get_access_token;