import React from "react";
import "../styles/Toast.css";

const Toast = ({ message, type, onClose }) => (
  <div className={`admin-toast admin-toast-${type}`}>
    <div className="toast-content">
      <span className="toast-icon">
        {type === "success" ? "✓" : type === "error" ? "✕" : "ⓘ"}
      </span>
      <span className="toast-message">{message}</span>
      <span className="toast-close" onClick={onClose}>
        &times;
      </span>
    </div>
  </div>
);

export default Toast;
