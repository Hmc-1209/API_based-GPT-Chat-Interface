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
      withCredentials: true,
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

export const create_new_user = async (user_name, user_password) => {
  const requestData = {
    name: user_name,
    password: user_password,
  };

  try {
    const response = await axios.post(`${api_host}/user/`, requestData, {
      headers: {
        "Content-Type": "application/json",
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

export const check_access_token = async () => {
  try {
    const response = await axios.get(
      `${api_host}/token/validate_access_token`,
      {
        withCredentials: true,
        validateStatus: function (status) {
          return (status >= 200 && status < 300) || status === 404;
        },
      }
    );

    if (response.status === 200) {
      return 1;
    } else {
      return response.data.detail;
    }
  } catch (error) {
    return 5;
  }
};

export const get_self_user = async () => {
  // Get self user detail
  try {
    const response = await axios.get(`${api_host}/user/`, {
      withCredentials: true,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
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
