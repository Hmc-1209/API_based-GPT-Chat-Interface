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
    const response = await axios.post(`${api_host}/token/`, formData, {
      headers: {
        "Access-Control-Allow-Origin": "https://chat-api.dh1209.com",
      },
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 404;
      },
    });

    if (response) {
      console.log(response);
      return 1;
    } else {
      return response.data.detail;
    }
  } catch (error) {
    return 5;
  }
};
export default get_access_token;

export const get_self_user = async () => {
  // Get self user detail
  try {
    const response = await axios.get(`${api_host}/user/`, {
      withCredentials: true,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://chat-api.dh1209.com",
      },
    });

    if (!response.data) {
      return false;
    }

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
