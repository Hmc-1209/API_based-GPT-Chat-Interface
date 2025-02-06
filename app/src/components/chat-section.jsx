import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from "../App";
import { get_chat_content_detail } from "../http-requests/user-data";

const ChatSection = () => {
  const chatContainerRef = useRef(null);
  const [loadingChatData, setLoadingChatData] = useState(0);

  const { chatContents, setChatContents, selectedChatRecord } =
    useContext(AppContext);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatContents]);

  const chatContentsRef = useRef(chatContents);

  useEffect(() => {
    setLoadingChatData(1);

    const get_chat_contents = async () => {
      const response = await get_chat_content_detail(selectedChatRecord);

      setChatContents((prevChatContents) => {
        const exists = prevChatContents.some(
          (item) => item.record_id === selectedChatRecord
        );

        if (exists) return prevChatContents;

        const updatedChatContents = [
          ...prevChatContents,
          { record_id: selectedChatRecord, contents: response },
        ];
        chatContentsRef.current = updatedChatContents;
        return updatedChatContents;
      });

      setLoadingChatData(0);
    };

    if (
      !chatContentsRef.current.some(
        (item) => item.record_id === selectedChatRecord
      )
    ) {
      get_chat_contents();
    }

    console.log("Data loaded.", chatContentsRef.current);
  }, [selectedChatRecord]);

  return (
    <>
      {loadingChatData === 1 ? (
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
                .map((chat, index) =>
                  chat.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="text-gray-300 text-left max-w-[60%] bg-gray-700 p-3 rounded-2xl ml-auto mr-7 break-words">
                        {chat.content}
                      </div>
                    </div>
                  ) : chat.role === "assistant" ? (
                    <div
                      key={index}
                      className="text-gray-300 text-left  max-w-[85%] p-2 rounded-lg mr-auto m-5 p-3"
                    >
                      {chat.content}
                    </div>
                  ) : (
                    <div key={index} />
                  )
                )}
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
