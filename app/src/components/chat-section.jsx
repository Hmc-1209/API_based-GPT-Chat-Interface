import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../App";
import {
  get_chat_content_detail,
  send_chat_request,
} from "../http-requests/user-data";
import { motion } from "framer-motion";

const ChatSection = () => {
  const chatContainerRef = useRef(null);
  const [loadingChatData, setLoadingChatData] = useState(false);
  const [sendingChatRequest, setSendingChatRequest] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const { chatContents, setChatContents, selectedChatRecord, setAlert } =
    useContext(AppContext);

  const send_chat = async (record_id, chat_message, use_record) => {
    setSendingChatRequest(true);

    const prevChatContents = [...chatContents];

    setChatContents((prevChatContents) =>
      prevChatContents.map((chat) =>
        chat.record_id === record_id
          ? {
              ...chat,
              contents: [
                ...chat.contents,
                { role: "user", content: chat_message },
              ],
            }
          : chat
      )
    );

    try {
      const response = await send_chat_request(
        record_id,
        chat_message,
        use_record
      );

      setChatContents((prevChatContents) =>
        prevChatContents.map((chat) =>
          chat.record_id === record_id
            ? { ...chat, contents: [...chat.contents, response] }
            : chat
        )
      );
    } catch (error) {
      setChatContents(prevChatContents);
      setAlert(6);
    } finally {
      setSendingChatRequest(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatContents]);

  // Check and load chat datas
  useEffect(() => {
    const fetchChatContents = async () => {
      if (!selectedChatRecord) return;

      const existingChat = chatContents.find(
        (chat) => chat.record_id === selectedChatRecord
      );
      if (existingChat) return;

      setLoadingChatData(true);

      try {
        const response = await get_chat_content_detail(selectedChatRecord);

        setChatContents((prevChatContents) => [
          ...prevChatContents,
          { record_id: selectedChatRecord, contents: response },
        ]);
      } catch (error) {
        console.error("Failed to load chat contents:", error);
      } finally {
        setLoadingChatData(false);
      }
    };

    fetchChatContents();
  }, [selectedChatRecord, chatContents, setChatContents]);

  return (
    <>
      {loadingChatData ? (
        <div className="relative w-screen xl:w-[100%] h-[90%] bg-gray-800 text-md xl:text-[20px] text-gray-500 italic text-center flex items-center justify-center select-none">
          Loading chat data...
        </div>
      ) : (
        <div className="relative h-[90%] bg-gray-800 text-sm xl:text-[15px]">
          <div className="flex flex-col justify-center h-full">
            <div
              className="flex-grow bg-gray-800 overflow-y-auto leading-8 custom-scrollbar flex flex-col items-center"
              ref={chatContainerRef}
            >
              <div className="w-[90%] xl:w-[75%]">
                {chatContents
                  .filter((chat) => chat.record_id === selectedChatRecord)
                  .flatMap((chat) => chat.contents)
                  .map((message, index) =>
                    message.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="text-gray-300 text-left max-w-[100%] bg-gray-700 p-3 rounded-2xl ml-auto break-words">
                          {message.content}
                        </div>
                      </div>
                    ) : message.role === "assistant" ? (
                      <div
                        key={index}
                        className="text-gray-300 text-left max-w-[100%] p-2 rounded-lg mr-auto"
                      >
                        {message.content}
                      </div>
                    ) : (
                      <div key={index} />
                    )
                  )}
                {sendingChatRequest && (
                  <div
                    key={-1}
                    className="text-gray-300 text-left max-w-[100%] p-2 rounded-lg"
                  >
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-[100%] flex justify-center text-center">
              <div className="w-[89%] xl:w-[74%] flex justify-end items-center">
                <input
                  type="checkbox"
                  id="useHistoryRecord"
                  className="appearance-none w-5 h-5 bg-gray-800 border-2 border-gray-600 rounded-md checked:bg-gray-800 checked:border-white checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center"
                />
                <label htmlFor="useHistoryRecord" className="ml-2 text-white">
                  Use history chat records
                </label>
              </div>
            </div>

            <div className="bg-gray-800 p-2 flex justify-center relative">
              <textarea
                className="w-[90%] xl:w-[75%] h-[6rem] px-3 py-3 mb-3 xl:mb-3 bg-gray-700 text-white rounded-md overflow-y-auto resize-none focus:outline-none"
                placeholder="Send message to GPT"
                id="chat-text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    if (isComposing) {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                      return;
                    }

                    e.preventDefault();
                    const useRecord =
                      document.getElementById("useHistoryRecord").checked;
                    send_chat(selectedChatRecord, e.target.value, useRecord);
                    e.target.value = "";
                  }
                }}
                onCompositionStart={() => {
                  // 開始中文輸入時標記
                  setIsComposing(true);
                }}
                onCompositionEnd={() => {
                  // 結束中文輸入時標記
                  setIsComposing(false);
                }}
                disabled={sendingChatRequest}
              />
              <button
                className="absolute right-[9%] xl:right-[13%] bottom-7 xl:bottom-6 bg-gray-600 text-white px-3 py-2 xl:m-2 rounded-md hover:bg-gray-800"
                onClick={(e) => {
                  const useRecord =
                    document.getElementById("useHistoryRecord").checked;
                  send_chat(selectedChatRecord, e.target.value, useRecord);
                }}
                disabled={sendingChatRequest}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ChatSection;
