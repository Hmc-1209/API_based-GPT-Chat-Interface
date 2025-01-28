import React, { useContext, useEffect, useRef, useState } from "react";
import get_self_user, {
  get_self_chat_records,
} from "../http-requests/user-data";
import { AppContext } from "../App";
import { clear_access_token } from "../http-requests/login";
import ChatSection from "./chat-section";

const ChatPage = () => {
  const [leftSideBar, setLeftSideBar] = useState(false);
  const [chatRecord, setChatRecord] = useState([]);
  const [selectedChatRecord, setSelectedChatRecord] = useState(0);
  const [accountMenu, setAccountMenu] = useState(false);
  const { setAlert, setAppPage } = useContext(AppContext);
  const accountMenuRef = useRef(null);

  // Classify chat rooms with update date
  const groupChatRecords = (records) => {
    if (!Array.isArray(records) || records.length === 0) {
      return { today: [], yesterday: [], previous: [] };
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return records.reduce(
      (groups, record) => {
        const recordDate = new Date(record.updated_at);
        const recordDay = recordDate.toDateString();

        if (recordDay === today.toDateString()) {
          groups.today.push(record);
        } else if (recordDay === yesterday.toDateString()) {
          groups.yesterday.push(record);
        } else {
          groups.previous.push(record);
        }
        return groups;
      },
      { today: [], yesterday: [], previous: [] }
    );
  };
  const groupedRecords = groupChatRecords(chatRecord);

  const logout = async () => {
    const response = await clear_access_token();
    if (response === 1) {
      setAlert(8);
      return;
    }
    setAlert(6);
  };

  // Get all char rooms' breief info
  useEffect(() => {
    const get_chat_records = async () => {
      const chat_records = await get_self_chat_records();
      if (chat_records === 2) {
        setAlert(7);
        return;
      } else if (chat_records === 5) {
        setAlert(6);
        return;
      }
      setChatRecord(Array.isArray(chat_records) ? chat_records : []);
      return;
    };

    get_chat_records();
  }, []);

  // Account icon unfocus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full bg-gray-800 font-bold flex flex-row xl:flex-row">
      {/* Menu button */}
      <button
        className="w-[10%] xl:hidden absolute top-4 left-4 flex flex-col gap-1 md:gap-3 bg-gray-700 text-white p-2 md:p-3 rounded"
        onClick={() => setLeftSideBar(!leftSideBar)}
      >
        <span className="block w-[100%] h-0.5 md:h-1 bg-white"></span>
        <span className="block w-[90%] h-0.5 md:h-1 bg-white"></span>
        <span className="block w-[100%] h-0.5 md:h-1 bg-white"></span>
      </button>

      {/* Left side bar */}
      <div
        className={`absolute xl:static top-0 left-0 transform ${
          leftSideBar ? "translate-x-0" : "-translate-x-full"
        } transition-transform xl:transform-none w-[60%] xl:w-[15%] h-full bg-gray-900 z-10 overflow-y-auto custom-scrollbar`}
      >
        <div className="w-full p-5 text-md xl:text-sm text-white flex items-center justify-between sticky top-0 bg-gray-900 z-20">
          <button onClick={() => setSelectedChatRecord(0)}>Chat room</button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Chat record from today */}
        {groupedRecords.today.length > 0 && (
          <div>
            <h3 className="text-gray-400 font-bold m-2 mt-4 text-md xl:text-sm text-left ">
              Today
            </h3>
            {groupedRecords.today.map((record) => (
              <button
                key={record.record_id}
                className={
                  "w-[100%] p-4 text-left text-md xl:text-sm" +
                  (selectedChatRecord === record.record_id
                    ? " text-gray-400"
                    : " text-gray-600")
                }
                onClick={() => setSelectedChatRecord(record.record_id)}
              >
                {record.chat_name}
              </button>
            ))}
          </div>
        )}
        {/* Chat record from yesterday */}
        {groupedRecords.yesterday.length > 0 && (
          <div>
            <h3 className="text-gray-400 font-bold m-2 mt-4 text-md xl:text-sm text-left">
              Yesterday
            </h3>
            {groupedRecords.yesterday.map((record) => (
              <button
                key={record.record_id}
                className={
                  "w-[100%] p-4 text-left text-md xl:text-sm" +
                  (selectedChatRecord === record.record_id
                    ? " text-gray-400"
                    : " text-gray-600")
                }
                onClick={() => setSelectedChatRecord(record.record_id)}
              >
                {record.chat_name}
              </button>
            ))}
          </div>
        )}
        {/* Chat record from previous */}
        {groupedRecords.previous.length > 0 && (
          <div>
            <h3 className="text-gray-400 font-bold m-2 mt-4 text-md xl:text-sm text-left">
              Previous
            </h3>
            {groupedRecords.previous.map((record) => (
              <button
                key={record.record_id}
                className={
                  "w-[100%] p-4 text-left text-md xl:text-sm" +
                  (selectedChatRecord === record.record_id
                    ? " text-gray-400"
                    : " text-gray-600")
                }
                onClick={() => setSelectedChatRecord(record.record_id)}
              >
                {record.chat_name}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Left side bar cover */}
      {leftSideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 h-[100%] z-[2] xl:hidden"
          onClick={() => setLeftSideBar(false)}
        />
      )}

      {/* Chat */}
      <div className="w-full xl:w-[85%]h-full text-white bg-gray-800 flex flex-col h-screen">
        <div className="text-white text-2xl xl:text-4xl pt-5 pb-5 bg-gray-800">
          GPTCI
        </div>
        <ChatSection className="z-[1]"/>
      </div>

      {/* Account icon */}
      <i
        class="fa-solid fa-user absolute top-4 right-4 text-gray-400 text-3xl md:text-4xl cursor-pointer rounded"
        onClick={() => setAccountMenu((prev) => !prev)}
      />
      {/* Account dropdown menu */}
      {accountMenu && (
        <div
          className="absolute top-16 right-4 bg-gray-700 shadow-lg rounded-md w-48 text-sm"
          ref={accountMenuRef}
        >
          <button
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 rounded"
            onClick={() => setAppPage(2)}
          >
            <i class="fa-solid fa-address-card" /> Profile
          </button>
          <button 
            className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 rounded"
            onClick={() => setAppPage(3)}
          >
            <i class="fa-solid fa-gear" /> Settings
          </button>
          <button className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600 rounded">
            <i class="fa-solid fa-circle-info" /> Help
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-300 hover:bg-gray-600 rounded"
            onClick={() => logout()}
          >
            <i class="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
