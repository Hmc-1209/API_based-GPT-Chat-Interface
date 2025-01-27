import axios from "axios";
import { api_host } from "./config";

const get_self_user = async () => {
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

export const get_self_chat_records = async () => {
  // Get self user chat records
  try {
    const response = await axios.get(`${api_host}/chat_record/`, {
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

export const update_user_data = async (mode, value) => {
  // Update username or api key
  const data = {
    "mode": mode,
    "val": value
  }

  try {
    const response = await axios.patch(`${api_host}/user/`, data, {
      withCredentials: true,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      return 2;
    }

    return 1;
  } catch (error) {
    return 5;
  }
}