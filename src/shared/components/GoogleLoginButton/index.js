import React from "react";
import { BASE_API } from "../../constants/app";
import "./style.css";

const GoogleLoginButton = ({ text = "Đăng nhập với Google" }) => {
  const handleGoogleLogin = () => {
    // Redirect đến backend để bắt đầu OAuth flow
    window.location.href = `${BASE_API}/users/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="google-login-btn"
      type="button"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="google-icon"
      />
      {text}
    </button>
  );
};

export default GoogleLoginButton;
