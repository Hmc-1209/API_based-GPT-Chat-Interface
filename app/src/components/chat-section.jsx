import React, { useContext, useEffect, useRef, useState } from "react";

const ChatSection = () => {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "system",
      content: "You're an assistant for answering questions.",
    },
    {
      role: "user",
      content: "Hi, can you introduce yourself in 30 words?",
    },
    {
      role: "assistant",
      content:
        "I'm an AI assistant designed to provide information, answer questions, and offer help on a wide range of topics. I'm here to make your experience informative and enjoyable!",
    },
    {
      role: "user",
      content: "How long have you been working?",
    },
    {
      role: "assistant",
      content:
        "I don’t have a specific start date, as I’m part of an ongoing development of AI technology. My training includes data and knowledge up until October 2023.",
    },
    {
      role: "user",
      content:
        "Give me a short fix for the HTML code so that the texts are red, and just return the code for me. ```<div>Testing</div>```",
    },
    {
      role: "assistant",
      content: '```html\n<div style="color: red;">Testing</div>\n```',
    },
  ]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="relative h-[90%] bg-gray-800 text-sm xl:text-[20px]">
      <div className="flex flex-col h-full">
        <div
          className="flex-grow bg-gray-800 overflow-y-auto leading-8"
          ref={chatContainerRef}
        >
          {chatMessages.map((message, index) =>
            message.role === "user" ? (
              <div className="flex justify-end">
                <div className="text-gray-300 text-left max-w-[60%] bg-gray-700 p-3 rounded-2xl ml-auto mr-10 break-words">
                  {message.content}
                </div>
              </div>
            ) : message.role === "assistant" ? (
              <div
                key={index}
                className="text-gray-300 text-left  max-w-[80%] p-2 rounded-lg mr-auto m-10 p-3"
              >
                {message.content}
              </div>
            ) : (
              <div key={index} />
            )
          )}
        </div>

        <div className="bg-gray-800 p-2 flex justify-center relative">
          <textarea
            className="w-[90%] xl:w-[75%] h-[6rem] px-3 py-3 xl:mb-3 bg-gray-700 text-white rounded-md overflow-y-auto resize-none focus:outline-none"
            placeholder="Send message to GPT"
            id="chat-text"
          />
          <button className="absolute right-[10%] xl:right-[13%] bottom-5 xl:bottom-6 bg-gray-600 text-white px-3 py-2 xl:m-2 rounded-md hover:bg-gray-800">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatSection;
