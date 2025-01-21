import "./App.css";

import LogIn from "./components/login";
import { useState, createContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { check_access_token } from "./http-requests/login";
import ChatPage from "./components/chat-page";

export const AppContext = createContext(null);

function App() {
  const [alert, setAlert] = useState(0);
  const [appPage, setAppPage] = useState(1);
  const success = (message) => toast.success(message);
  const warning = (message) => toast.warning(message);
  const error = (message) => toast.error(message);

  useEffect(() => {
    const loggedin_check = async () => {
      const response = await check_access_token();
      if (response === 1) {
        console.log("The user has already logged in.");
        setAppPage(1);
      } else {
        console.log(response);
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
    }
  }, [alert]);

  return (
    <div className="App">
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <div className="App-content">
        <AppContext.Provider value={{ alert, setAlert }}>
          {appPage === 0 && <LogIn />}
          {appPage === 1 && <ChatPage />}
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
