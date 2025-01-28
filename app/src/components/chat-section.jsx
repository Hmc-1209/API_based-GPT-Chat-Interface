import React, { useContext, useEffect, useRef, useState } from "react";

const ChatSection = () => {
    

    return (
        <div className="relative w-full h-screen bg-gray-800 text-sm xl:text-[20px]">
            <div className="flex flex-col h-full">
                <div className="flex-grow bg-gray-800 overflow-y-auto">
                <p className="text-white p-4">This is a chat message</p>
                <p className="text-white p-4">Another message</p>
                </div>

                <div className="bg-gray-800 p-2 flex justify-center relative">
                    <textarea
                        className="w-[75%] h-[6rem] px-2 py-3 bg-gray-700 text-white rounded-md overflow-y-auto resize-none focus:outline-none"
                        placeholder="Type something here..."
                        id="chat-text"
                    />
                    <button
                        className="absolute right-[13%] bottom-3 bg-gray-600 text-white px-3 py-2 m-2 rounded-md hover:bg-gray-800"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
export default ChatSection;