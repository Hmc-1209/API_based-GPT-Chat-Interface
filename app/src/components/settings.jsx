import React, { useContext, useState } from "react";
import { AppContext } from "../App";
import { update_user_data } from "../http-requests/user-data";

const SettingsPage = () => {
  const [updating, setUpdating] = useState(false);
  const { userDetail, setUserDetail, setAppPage, setAlert } =
    useContext(AppContext);

  const update = async (mode, val) => {
    setUpdating(true);
    if (val === "") {
      setAlert(10);
      setUpdating(false);
      return;
    }
    const response = await update_user_data(mode, val);
    setUpdating(false);
    if (response === 2) {
      setAlert(6);
      return;
    }
    setAlert(11);
    setUserDetail((prevDetail) => {
      const updatedDetail = { ...prevDetail };

      if (mode === 1) {
        updatedDetail.name = val;
      } else if (mode === 2) {
        updatedDetail.api_key = val;
      }

      return updatedDetail;
    });
    return;
  };

  return (
    <div className="flex flex-col text-[20px] w-[70%] h-full xl:w-[30%] select-none text-base text-center">
      <span className="text-white top-0 left-0 p-5 font-bold text-2xl xl:text-4xl">
        GPTCI
      </span>
      <i class="fa-solid fa-gear m-10 text-4xl xl:text-6xl" />
      <b className="text-left m-2">Account settings</b>
      <hr className="mb-5" />
      {/* Username */}
      <div className="m-2 text-left flex flex-col xl:inline-block">
        <b>Username :</b>{" "}
        <input
          type="text"
          id="input-username"
          placeholder={userDetail.name !== undefined ? userDetail.name : "None"}
          className="bg-gray-700 text-white px-2 py-1 border-none outline-none max-w-[100%] rounded-md select-none overflow-hidden text-ellipsis whitespace-nowrap"
          size={20}
          title={userDetail.name}
          disabled={updating}
        />
        <button
          className="bg-gray-700 text-bold p-1 mt-2 xl:ml-5 rounded-md"
          onClick={() => {
            const inputValue = document.getElementById("input-username").value;
            update(1, inputValue);
          }}
        >
          Apply change
        </button>
      </div>
      {/* User API key */}
      <div className="m-2 text-left flex flex-col xl:inline-block">
        <b>API key :</b>{" "}
        <input
          type="text"
          id="input-api-key"
          placeholder={
            userDetail.api_key !== undefined ? userDetail.api_key : "None"
          }
          className="bg-gray-700 text-white px-2 py-1 border-none outline-none max-w-[100%] xl:max-w-[50%] rounded-md select-none overflow-hidden text-ellipsis whitespace-nowrap "
          size={20}
          title={userDetail.api_key}
          disabled={updating}
        />
        <button
          className="bg-gray-700 text-bold p-1 mt-2 xl:ml-5 rounded-md"
          onClick={() => {
            const inputValue = document.getElementById("input-api-key").value;
            update(2, inputValue);
          }}
        >
          Apply change
        </button>
      </div>

      {/* Return button */}
      <i
        class="fa-solid fa-home absolute top-4 right-4 text-gray-400 text-3xl md:text-4xl cursor-pointer rounded"
        onClick={() => setAppPage(1)}
      />
    </div>
  );
};
export default SettingsPage;
