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

    if (response.status === 200) {
      // login success
      return 1;
    } else if (response.status === 404) {
      // login failed
      return 2;
    }
  } catch (error) {
    // unknown error
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
        return (status >= 200 && status < 300) || status === 400;
      },
    });

    if (response.status === 200) {
      // successfully registed
      return 1;
    } else if (response.status === 404) {
      // invalid username or password
      return 2;
    }
  } catch (error) {
    // unknown error
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
          return (status >= 200 && status < 300) || status === 401;
        },
      }
    );

    if (response.status === 200) {
      // token available
      return 1;
    } else if (response.status === 401) {
      // invalid token
      return 2;
    }
  } catch (error) {
    // unknown error
    return 5;
  }
};

export const clear_access_token = async () => {
  // Get self user chat records
  try {
    const response = await axios.get(`${api_host}/token/clear_access_token`, {
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
};
