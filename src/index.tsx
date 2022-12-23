import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <button style={{ backgroundColor: "#8cb4ff" }}>blue</button>
    <button style={{ backgroundColor: "#ff6d91" }}>pink</button>
    <button style={{ backgroundColor: "#afa100" }}>yellow</button>
    <button
      style={{ color: "rgb(205, 205, 205)", backgroundColor: "transparent" }}
    >
      other
    </button> */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
