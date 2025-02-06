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

  try {
    const response = await axios.patch(`${api_host}/user/`, null, {
      params: {
        mode: mode,
        val: value,
      },
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

export const update_chat_record_name = async (record_id, value) => {
  try {
    const response = await axios.patch(`${api_host}/chat_record/chat`, null, {
      params: {
        record_id: record_id,
        mode: 2,
        value: value,
      },
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

export const delete_chat_record = async (record_id) => {
  try {
    const response = await axios.delete(
      `${api_host}/chat_record/${record_id}`,
      {
        withCredentials: true,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      return 2;
    }

    return 1;
  } catch (error) {
    return 5;
  }
};

export const add_new_chat_record = async () => {
  try {
    const response = await axios.post(`${api_host}/chat_record/`, null, {
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

export const send_chat_request = async (record_id, chat_content) => {
  try {
    const response = await axios.post(`${api_host}/chat_record/chat`, null, {
      params: {
        record_id: record_id,
        chat_message: chat_content,
        use_record: false,
        model: "gpt-4o-mini",
      },
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
