import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../App";
import {
  get_chat_content_detail,
  send_chat_request,
} from "../http-requests/user-data";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
                        <div className="text-gray-300 text-left max-w-[70%] bg-gray-700 p-3 mt-2 mb-2 rounded-2xl ml-auto break-words">
                          <ReactMarkdown
                            className="markdown"
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => (
                                <h1 className="text-3xl font-bold mt-6 mb-4">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-2xl font-bold mt-5 mb-3">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-xl font-bold mt-4 mb-3">
                                  {children}
                                </h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="text-lg font-bold mt-4 mb-2">
                                  {children}
                                </h4>
                              ),
                              h5: ({ children }) => (
                                <h5 className="text-base font-bold mt-3 mb-2">
                                  {children}
                                </h5>
                              ),
                              h6: ({ children }) => (
                                <h6 className="text-sm font-bold mt-2 mb-1">
                                  {children}
                                </h6>
                              ),
                              p: ({ children }) => (
                                <p className="text-base">{children}</p>
                              ),
                              code: ({ children }) => (
                                <code className="bg-gray-900 text-white px-1 py-0 rounded-md inline-block">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-gray-900 text-white p-1 rounded-md overflow-x-auto mt-3 mb-2">
                                  <style>
                                    {`
                                        pre::-webkit-scrollbar {
                                          width: 6px;
                                          height: 6px;
                                        }
                                        pre::-webkit-scrollbar-thumb {
                                          background-color: rgba(255, 255, 255, 0.4);
                                          border-radius: 3px;
                                        }
                                        pre::-webkit-scrollbar-track {
                                          background: transparent;
                                        }
                                      `}
                                  </style>
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ) : message.role === "assistant" ? (
                      <div
                        key={index}
                        className="text-gray-300 text-left max-w-[100%] p-2 rounded-lg mr-auto"
                      >
                        <ReactMarkdown
                          className="markdown"
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-3xl font-bold mt-6 mb-4">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-bold mt-5 mb-3">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-bold mt-4 mb-3">
                                {children}
                              </h3>
                            ),
                            h4: ({ children }) => (
                              <h4 className="text-lg font-bold mt-4 mb-2">
                                {children}
                              </h4>
                            ),
                            h5: ({ children }) => (
                              <h5 className="text-base font-bold mt-3 mb-2">
                                {children}
                              </h5>
                            ),
                            h6: ({ children }) => (
                              <h6 className="text-sm font-bold mt-2 mb-1">
                                {children}
                              </h6>
                            ),
                            p: ({ children }) => (
                              <p className="text-base">{children}</p>
                            ),
                            code: ({ children }) => (
                              <code className="bg-gray-900 text-white px-1 py-0 rounded-md inline-block">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-gray-900 text-white p-1 rounded-md overflow-x-auto mt-3 mb-2">
                                <style>
                                  {`
                                      pre::-webkit-scrollbar {
                                        width: 6px;
                                        height: 6px;
                                      }
                                      pre::-webkit-scrollbar-thumb {
                                        background-color: rgba(255, 255, 255, 0.4);
                                        border-radius: 3px;
                                      }
                                      pre::-webkit-scrollbar-track {
                                        background: transparent;
                                      }
                                    `}
                                </style>
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
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

            {/* Use history record button */}
            <div className="w-[100%] flex justify-center text-center">
              <div className="w-[89%] xl:w-[74%] flex justify-end items-center">
                <input
                  type="checkbox"
                  id="useHistoryRecord"
                  className="appearance-none w-5 h-5 bg-gray-800 pt-2 border-2 border-gray-600 rounded-md checked:bg-gray-800 checked:border-white checked:before:content-['✔'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center"
                />
                <label htmlFor="useHistoryRecord" className="ml-2 text-white">
                  Use history chat records
                </label>
              </div>
            </div>

            {/* Send chat section */}
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
                  setIsComposing(true);
                }}
                onCompositionEnd={() => {
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
