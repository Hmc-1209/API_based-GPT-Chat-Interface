import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../App";
import { get_chat_content_detail } from "../http-requests/user-data";

const ChatSection = () => {
  const chatContainerRef = useRef(null);
  const [loadingChatData, setLoadingChatData] = useState(false);

  const { chatContents, setChatContents, selectedChatRecord } =
    useContext(AppContext);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatContents]);

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
        <div className="relative h-[90%] bg-gray-800 text-sm xl:text-[20px]">
          <div className="flex flex-col h-full">
            <div
              className="flex-grow bg-gray-800 overflow-y-auto leading-8"
              ref={chatContainerRef}
            >
              {chatContents
                .filter((chat) => chat.record_id === selectedChatRecord)
                .flatMap((chat) => chat.contents)
                .map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    <div
                      className={`text-gray-300 text-left max-w-[60%] bg-gray-700 p-3 rounded-2xl break-words ${
                        message.role === "user" ? "ml-auto mr-7" : "mr-auto m-5"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-gray-800 p-2 flex justify-center relative">
              <textarea
                className="w-[90%] xl:w-[75%] h-[6rem] px-3 py-3 mb-3 xl:mb-3 bg-gray-700 text-white rounded-md overflow-y-auto resize-none focus:outline-none"
                placeholder="Send message to GPT"
                id="chat-text"
              />
              <button className="absolute right-[9%] xl:right-[13%] bottom-7 xl:bottom-6 bg-gray-600 text-white px-3 py-2 xl:m-2 rounded-md hover:bg-gray-800">
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
