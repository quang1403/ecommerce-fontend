import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, visible, onClose, type = "success" }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast-container toast-${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
