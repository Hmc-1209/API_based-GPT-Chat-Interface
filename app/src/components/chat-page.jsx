import React, { useContext, useEffect, useRef, useState } from "react";
import {
  add_new_chat_record,
  delete_chat_record,
  get_self_chat_records,
  update_chat_record_name,
} from "../http-requests/user-data";
import { AppContext } from "../App";
import { clear_access_token } from "../http-requests/login";
import ChatSection from "./chat-section";
import ChatPending from "./chat-pending";

const ChatPage = () => {
  const [leftSideBar, setLeftSideBar] = useState(false);
  const [chatRecord, setChatRecord] = useState([]);
  const [backUpChatReord, setBackUpChatReord] = useState([]);
  const [settingChatFilter, setSettingChatFilter] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const [settingChatRoom, setSettingChatRoom] = useState(0);
  const [settingStatus, setSettingStatus] = useState(0);
  const [addingNewChat, setAddingNewChat] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const { setAlert, setAppPage, selectedChatRecord, setSelectedChatRecord } =
    useContext(AppContext);
  const dropdownRef = useRef(null);
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
    return;
  };

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
    setBackUpChatReord(Array.isArray(chat_records) ? chat_records : []);
    setSettingChatRoom(0);
    setSettingStatus(0);
    return;
  };

  const update_chat_name = async (record_id, new_name) => {
    const response = await update_chat_record_name(record_id, new_name);

    if (response === 1) {
      setAlert(12);
      await get_chat_records();
      return;
    }
    setAlert(6);
    return;
  };

  const delete_chat = async (record_id) => {
    const response = await delete_chat_record(record_id);

    if (response === 1) {
      setAlert(12);
      await get_chat_records();
      if (selectedChatRecord === record_id) {
        setSelectedChatRecord(0);
      }
      return;
    }
    setAlert(6);
    return;
  };

  const add_chat = async () => {
    setAddingNewChat(1);
    const response = await add_new_chat_record();

    if (response === 1) {
      setAlert(12);
      await get_chat_records();
      setAddingNewChat(0);
      return;
    }
    setAlert(6);
    setAddingNewChat(0);
    return;
  };

  const set_chat_filter = (filter) => {
    if (backUpChatReord.length === 0) {
      setBackUpChatReord(chatRecord);
    }

    if (filter.length === 0) {
      const filteredChat = backUpChatReord;
      setChatRecord(filteredChat);
      return;
    }

    const filteredChat = backUpChatReord.filter(
      (chat) => chat?.chat_name?.toLowerCase().includes(filter.toLowerCase()) // 避免 chat.message 為 undefined
    );

    setChatRecord(filteredChat);
    return;
  };

  // Get all char rooms' breief info
  useEffect(() => {
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

  // Set chat room unfocus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSettingChatRoom(0);
        setSettingStatus(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-[100%] bg-gray-800 font-bold flex flex-row xl:flex-row">
      {/* Menu button */}
      <button
        className="w-[40px] md:w-[70px] xl:hidden absolute top-4 left-4 flex flex-col gap-1 md:gap-3 bg-gray-700 text-white p-2 md:p-3 rounded"
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
        <div className="w-full pt-5 pb-5 pl-2 pr-2 text-md xl:text-sm text-white flex items-center justify-between sticky top-0 bg-gray-900 z-20">
          <button onClick={() => setSelectedChatRecord(0)}>Chat room</button>
          <div className="flex items-center gap-5 ml-auto">
            {" "}
            {/* Add new chat button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 cursor-pointer ${
                addingNewChat === 1 ? "text-gray-700" : "text-gray-100"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={() => addingNewChat === 0 && add_chat()}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2h-4l-5 3v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <line x1="14" y1="12" x2="20" y2="12" />
              <line x1="17" y1="9" x2="17" y2="15" />
            </svg>
            {/* Filter chat button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 cursor-pointer text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={() => {
                if (settingChatFilter) {
                  set_chat_filter("");
                }
                setSettingChatFilter(!settingChatFilter);
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Chat record from today */}
        {groupedRecords.today.length > 0 && (
          <div>
            <h3 className="text-gray-400 font-bold m-2 mt-4 text-md xl:text-sm text-left ">
              Today
            </h3>
            {groupedRecords.today.map((record) => (
              <div
                key={record.record_id}
                className={
                  "relative w-[100%] p-2 text-left text-md xl:text-sm cursor-pointer flex items-center group" +
                  (selectedChatRecord === record.record_id
                    ? " text-gray-400"
                    : " text-gray-600")
                }
                onClick={() => setSelectedChatRecord(record.record_id)}
              >
                {(settingStatus === 0 ||
                  settingChatRoom !== record.record_id) && (
                  <button className="w-[90%] p-1 text-left truncate overflow-hidden whitespace-nowrap">
                    {record.chat_name}
                  </button>
                )}

                {settingStatus === 1 &&
                  settingChatRoom === record.record_id && (
                    <input
                      ref={dropdownRef}
                      className="w-[90%] p-1 text-left truncate overflow-hidden whitespace-nowrap bg-gray-700 text-gray-400 outline-none"
                      defaultValue={record.chat_name}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        update_chat_name(record.record_id, e.target.value)
                      }
                    />
                  )}

                <button
                  className={
                    "absolute right-0 text-2xl text-bold xl:text-lg text-gray-400 pt-5 pb-5 pr-3 pl-3 opacity-0 group-hover:opacity-100" +
                    (settingChatRoom === record.record_id ? " opacity-100" : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const dropdownHeight = 100;
                    const isOverflowing =
                      rect.bottom + dropdownHeight > window.innerHeight;

                    setDropdownPosition({
                      top: isOverflowing
                        ? rect.top - dropdownHeight
                        : rect.bottom,
                      left: rect.left,
                    });

                    setSettingChatRoom(record.record_id);
                  }}
                >
                  ⋮
                </button>
              </div>
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
              <div
                key={record.record_id}
                className={
                  "relative w-[100%] p-2 text-left text-md xl:text-sm cursor-pointer flex items-center group" +
                  (selectedChatRecord === record.record_id
                    ? " text-gray-400"
                    : " text-gray-600")
                }
                onClick={() => setSelectedChatRecord(record.record_id)}
              >
                {(settingStatus === 0 ||
                  settingChatRoom !== record.record_id) && (
                  <button className="w-[90%] p-1 text-left truncate overflow-hidden whitespace-nowrap">
                    {record.chat_name}
                  </button>
                )}

                {settingStatus === 1 &&
                  settingChatRoom === record.record_id && (
                    <input
                      ref={dropdownRef}
                      className="w-[90%] p-1 text-left truncate overflow-hidden whitespace-nowrap bg-gray-700 text-gray-400 outline-none"
                      defaultValue={record.chat_name}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        update_chat_name(record.record_id, e.target.value)
                      }
                    />
                  )}

                <button
                  className={
                    "absolute right-0 text-2xl text-bold xl:text-lg text-gray-400 pt-5 pb-5 pr-3 pl-3 opacity-0 group-hover:opacity-100" +
                    (settingChatRoom === record.record_id ? " opacity-100" : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const dropdownHeight = 100;
                    const isOverflowing =
                      rect.bottom + dropdownHeight > window.innerHeight;

                    setDropdownPosition({
                      top: isOverflowing
                        ? rect.top - dropdownHeight
                        : rect.bottom,
                      left: rect.left,
                    });

                    setSettingChatRoom(record.record_id);
                  }}
                >
                  ⋮
                </button>
              </div>
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
              <div
                key={record.record_id}
                className={
                  "relative w-[100%] p-2 text-left text-md xl:text-sm cursor-pointer flex items-center group" +
                  (selectedChatRecord === record.record_id
                    ? " text-gray-400"
                    : " text-gray-600")
                }
              >
                {(settingStatus === 0 ||
                  settingChatRoom !== record.record_id) && (
                  <button
                    className="w-[90%] p-1 text-left truncate overflow-hidden whitespace-nowrap"
                    onClick={() => setSelectedChatRecord(record.record_id)}
                  >
                    {record.chat_name}
                  </button>
                )}

                {settingStatus === 1 &&
                  settingChatRoom === record.record_id && (
                    <input
                      ref={dropdownRef}
                      className="w-[90%] p-1 text-left truncate overflow-hidden whitespace-nowrap bg-gray-700 text-gray-400 outline-none"
                      defaultValue={record.chat_name}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        update_chat_name(record.record_id, e.target.value)
                      }
                    />
                  )}

                <button
                  className={
                    "absolute right-0 text-2xl text-bold xl:text-lg text-gray-400 pt-5 pb-5 pr-3 pl-3 opacity-0 group-hover:opacity-100" +
                    (settingChatRoom === record.record_id ? " opacity-100" : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const dropdownHeight = 100;
                    const isOverflowing =
                      rect.bottom + dropdownHeight > window.innerHeight;

                    setDropdownPosition({
                      top: isOverflowing
                        ? rect.top - dropdownHeight
                        : rect.bottom,
                      left: rect.left,
                    });

                    setSettingChatRoom(record.record_id);
                  }}
                >
                  ⋮
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {settingChatFilter && (
        <div className="fixed z-[10] mt-12 xl:mt-11 w-[60%] xl:w-[15%] text-center flex items-center justify-center">
          <input
            type="text"
            className="w-[95%] bg-gray-700 focus:outline-none text-sm xl:text-md text-white p-1 rounded-md"
            placeholder="Type here to filter chat..."
            onChange={(e) => set_chat_filter(e.target.value)}
          />
        </div>
      )}

      {/* Left side bar cover */}
      {leftSideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 h-[100%] z-[2] xl:hidden"
          onClick={() => {
            setLeftSideBar(false);
            if (settingChatFilter) {
              setSettingChatFilter(false);
              set_chat_filter("");
            }
          }}
        />
      )}

      {/* Chat */}
      <div className="max-w-[100%] xl:w-[85%] text-white bg-gray-800 flex flex-col h-[90%] xl:h-full">
        <div className="text-white text-2xl xl:text-4xl pt-5 pb-5 bg-gray-800">
          GPTCI
        </div>
        {selectedChatRecord !== 0 && <ChatSection className="z-[1]" />}
        {selectedChatRecord === 0 && <ChatPending className="z-[1]" />}
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

      {/* Set chat room */}
      {settingChatRoom !== 0 && (
        <div
          ref={dropdownRef}
          className="absolute bg-gray-800 text-sm left-5 z-[10] shadow-md rounded-md"
          style={{
            top: `${dropdownPosition.top - 15}px`,
            left: `${dropdownPosition.left - 70}px`,
          }}
        >
          <button
            className="block w-full rounded-md text-left px-3 py-2 hover:bg-gray-700"
            onClick={() => setSettingStatus(1)}
          >
            <i class="fa-solid fa-pen" /> Rename
          </button>
          <button
            className="block w-full rounded-md text-left px-3 py-2 hover:bg-gray-700 text-red-600"
            onClick={() => delete_chat(settingChatRoom)}
          >
            <i class="fa-solid fa-trash-can" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
