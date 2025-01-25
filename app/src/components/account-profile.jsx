import React, { useContext } from "react";
import { AppContext } from "../App";
import camelCase from "../../node_modules/boxen/node_modules/camelcase/index";

const AccountProfile = () => {
  const { setAppPage } = useContext(AppContext);

  const userDetail = {};

  return (
    <div className="flex flex-col text-[20px] w-[70%] h-full xl:w-[30%] select-none text-base text-center">
      <span className="text-white top-0 left-0 p-5 font-bold text-2xl xl:text-4xl">
        GPTCI
      </span>
      <i class="fa-solid fa-user m-10 text-4xl xl:text-6xl" />
      <b className="text-left m-2">Account information</b>
      <hr className="mb-5" />
      {/* Username */}
      <div className="m-2 text-left">
        <b>Username :</b>{" "}
        <input
          type="text"
          defaultValue={
            userDetail.name !== undefined ? userDetail.name : "None"
          }
          readOnly
          className="bg-gray-700 text-white px-2 py-1 border-none outline-none max-w-[75%] rounded-md text-center select-none overflow-hidden text-ellipsis whitespace-nowrap"
          size={userDetail.name !== undefined ? userDetail.name.length : 4}
          title={userDetail.name}
        />
      </div>
      {/* User API key */}
      <div className="m-2 text-left">
        <b>API key :</b>{" "}
        <input
          type="text"
          defaultValue={
            userDetail.api_key_encryption_key !== undefined
              ? userDetail.api_key_encryption_key
              : "None"
          }
          readOnly
          className="bg-gray-700 text-white px-2 py-1 border-none outline-none max-w-[65%] xl:max-w-[75%] rounded-md text-center select-none overflow-hidden text-ellipsis whitespace-nowrap"
          size={
            userDetail.api_key_encryption_key !== undefined
              ? userDetail.api_key_encryption_key.length
              : 4
          }
          title={userDetail.api_key_encryption_key}
        />
      </div>
      <span className="text-sm italic mt-5">
        Account settings can be changed in <i class="fa-solid fa-gear" />
        Settings page.
      </span>

      {/* Return button */}
      <i
        class="fa-solid fa-home absolute top-4 right-4 text-gray-400 text-3xl md:text-4xl cursor-pointer rounded"
        onClick={() => setAppPage(1)}
      />
    </div>
  );
};

export default AccountProfile;
