import axios from "axios";
import { api_host } from "./config";

const get_self_user = async (user_name, user_password) => {
  // Get self user detail
  try {
    const response = await axios.get(`${api_host}/user/`, {
      withCredentials: true,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      return 2;
    }

    return response.data;
  } catch (error) {
    return 5;
  }
};

export default get_self_user;
