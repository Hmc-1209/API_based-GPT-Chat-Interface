import React, { useContext } from "react";
import { AppContext } from "../App";

const HelpPage = () => {
  const { setAppPage } = useContext(AppContext);

  return (
    <div className="h-dvh w-[100%] flex flex-col items-center justify-center text-center">
      {/* Title */}
      <div className="min-h-[7%] font-bold mt-5 text-2xl xl:text-4xl">
        GPTCI
      </div>

      {/* Help contents */}
      <div className="w-[90%] md:w-[80%] text-left min-h-[80%] text-[15px] xl:text-[20px] xl:min-h-[80%] overflow-y-auto text-justify">
        <div className="leading-6 xl:leading-8 mb-4 xl:mb-2">
          Welcome to <b>API based GPT chat interface</b>. This website is an
          application built for people to use GPT with a pay as you go method. I
          made this application because I would like to use GPT 4o without
          limitation but my monthly usage is much lower than $20(the price of
          ChatGPT Plus), so using GPT api is definitily a better case for me.
        </div>
        <div className="leading-6 xl:leading-8 mb-4 xl:mb-2">
          In this application by setting up the api key, we're able to ask
          questions just like ChatGPT website. Account passwords are stored with
          hash and each openai API key were encrypted with unique encrytption
          key. All chat records were encrypted on the server too. The
          application is hosted on Synology NAS DS923+.
        </div>
        <br />
        <div className="leading-6 xl:leading-8 mb-4 xl:mb-2">
          <b>The information of this website:</b>
          <ul>
            <li>
              &emsp;&#8226; The application is built on NAS server. The NAS
              server is Synology DS 923+.
            </li>
            <li>
              &emsp;&#8226; Password were stored properly with hashing and each
              API key encrypted with unique encryption key.
            </li>
            <li>
              &emsp;&#8226; The chat record were also encrypted with encryption
              key.
            </li>
            <li>
              &emsp;&#8226; The account token is stored in the browser with HTTP
              only cookie and secure tag.
            </li>
          </ul>
        </div>
        <br />
        <div className="leading-6 xl:leading-8 mb-4 xl:mb-2">
          <b>Functional button explain:</b>
          <ul>
            <li>
              &emsp;
              <i class="fa-solid fa-user" /> : Menu dropdown, help page and
              settings page listed in the dropdown menu.
            </li>
            <li>
              &emsp;
              <i class="fa-solid fa-address-card" /> : User profile, for user to
              check the detail of the accont.
            </li>
            <li>
              &emsp;
              <i class="fa-solid fa-gear" /> : User settings page for updating
              username and API key setup.
            </li>
            <li>
              &emsp;
              <i class="fa-solid fa-circle-info" /> : Help page, you're here
              now.
            </li>
            <li>
              &emsp;
              <i className="fa-solid fa-right-from-bracket" /> : Logout button,
              just for logging out.
            </li>
            <li>
              &emsp;
              <span className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 cursor-pointer"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2h-4l-5 3v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                  <line x1="14" y1="12" x2="20" y2="12" />
                  <line x1="17" y1="9" x2="17" y2="15" />
                </svg>
                : Add new chat room.
              </span>
            </li>
            <li>
              &emsp;
              <span className="inline-flex items-center">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer text-white mr-1"
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
                : Search particular chat room by name filter.
              </span>
            </li>
          </ul>
        </div>
        <br />
        <div className="leading-6 xl:leading-8 mb-4 xl:mb-2">
          Please make sure that select the <b>Use history chat records</b>{" "}
          checkbox if you're not asking individual questions. If you have any
          questions or any advices, please fell free to contact with me using
          the given email:{" "}
          <span className="font-bold">dannyho1209@gmail.com</span>. Also, check
          out the original source code of this project{" "}
          <a
            href="https://github.com/Hmc-1209/API_based-GPT-Chat-Interface.git"
            className="text-gray-300 underline"
          >
            here
          </a>
          !<span className="font-bold"></span>
        </div>
      </div>

      {/* Return button */}
      <i
        class="fa-solid fa-home absolute top-4 right-4 text-gray-400 text-3xl md:text-4xl cursor-pointer rounded"
        onClick={() => setAppPage(1)}
      />
    </div>
  );
};

export default HelpPage;
