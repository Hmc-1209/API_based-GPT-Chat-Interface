import "./App.css";

import LogIn from "./components/login";
import { useState, createContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { check_access_token } from "./http-requests/login";
import ChatPage from "./components/chat-page";
import PageLoading from "./components/app-loading";
import get_self_user from "./http-requests/user-data";
import AccountProfile from "./components/account-profile";
import SettingsPage from "./components/settings";
import HelpPage from "./components/help";

export const AppContext = createContext(null);

function App() {
  const [alert, setAlert] = useState(0);
  const [appPage, setAppPage] = useState(-1);
  const [userDetail, setUserDetail] = useState({});
  const [chatContents, setChatContents] = useState([]);
  const [selectedChatRecord, setSelectedChatRecord] = useState(0);

  const success = (message) => toast.success(message);
  const warning = (message) => toast.warning(message);
  const error = (message) => toast.error(message);

  // Login check
  useEffect(() => {
    const loggedin_check = async () => {
      const response = await check_access_token();
      if (response === 1) {
        const user_detail = await get_self_user();
        if (user_detail === 2 || user_detail === 5) {
          setAlert(9);
        } else {
          setUserDetail(user_detail);
        }
        setAppPage(1);
        return;
      } else {
        setAppPage(0);
        return;
      }
    };

    loggedin_check();
  }, []);

  /*
    Alert message type and settings:
  */
  useEffect(() => {
    switch (alert) {
      case 1:
        error("Missing information.");
        setAlert(0);
        return;
      case 2:
        success("Login success.");
        setAlert(0);
        return;
      case 3:
        error("Invalid username or password.");
        setAlert(0);
        return;
      case 4:
        error("Password doesn't match.");
        setAlert(0);
        return;
      case 5:
        success("Successfully registed.");
        setAlert(0);
        return;
      case 6:
        error("Currently unavailable.");
        setAlert(0);
        return;
      case 7:
        error("Failed to fetch user data.");
        setAlert(0);
        return;
      case 8:
        success("Logged out.");
        setAlert(0);
        setChatContents([]);
        setSelectedChatRecord(0);
        setAppPage(0);
        return;
      case 9:
        error("Unable to get user data.");
        setAlert(0);
        return;
      case 10:
        warning("No change detected.");
        setAlert(0);
        return;
      case 11:
        success("User data updated.");
        setAlert(0);
        return;
      case 12:
        success("Chat name updated.");
        setAlert(0);
        return;
      case 13:
        success("Chat deleted.");
        setAlert(0);
        return;
    }
  }, [alert]);

  return (
    <div className="App h-screen">
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <div className="App-content max-h-dvh">
        <AppContext.Provider
          value={{
            alert,
            setAlert,
            setAppPage,
            userDetail,
            setUserDetail,
            chatContents,
            setChatContents,
            selectedChatRecord,
            setSelectedChatRecord,
          }}
        >
          {appPage === -1 && <PageLoading />}
          {appPage === 0 && <LogIn />}
          {appPage === 1 && <ChatPage />}
          {appPage === 2 && <AccountProfile />}
          {appPage === 3 && <SettingsPage />}
          {appPage === 4 && <HelpPage />}
          <ToastContainer
            position="bottom-right"
            theme="colored"
            className="alert"
            limit={1}
            closeOnClick
            hideProgressBar
            autoClose={1000}
            toastClassName="text-sm"
          />
        </AppContext.Provider>
      </div>
    </div>
  );
}

export default App;
