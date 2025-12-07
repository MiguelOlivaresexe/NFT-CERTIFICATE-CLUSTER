import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "../index.css";
// Initialize api client (sets axios defaults & interceptor)
import "./utils/apiClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
