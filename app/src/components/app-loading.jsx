import React from "react";
import icon from "../pics/icon.png";
import { ThreeDot } from "react-loading-indicators";

const PageLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen select-none w-full bg-gray-900">
      <img src={icon} alt="GPTCI loading icon" className="w-[10%] rounded-md" />
      <span className="p-10">GPTCI</span>
      <ThreeDot color="#ffffff" size="medium" text="" textColor="#c2c2c2" />
    </div>
  );
};

export default PageLoading;
