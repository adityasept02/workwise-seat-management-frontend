import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Auth from "./Auth";
import TicketBookingUI from "./App";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return token ? (
    <TicketBookingUI setToken={setToken}/>
  ) : (
    <Auth
      setToken={(token) => {
        localStorage.setItem("token", token);
        setToken(token);
      }}
    />
  );
};

// Fix for React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
