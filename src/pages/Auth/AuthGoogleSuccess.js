import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux-setup/reducers/auth";
import "./style.css";

function AuthGoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Lưu token vào localStorage
        localStorage.setItem("accessToken", token);

        // Dispatch action để cập nhật Redux state
        dispatch(loginSuccess({ ...user, accessToken: token }));

        // Kiểm tra nếu là admin thì redirect về admin page
        // Dùng window.location.href để force reload trang và load lại CSS
        if (user.isAdmin) {
          setTimeout(() => {
            window.location.href = "/admin";
          }, 500);
        } else {
          // User thường redirect về trang chủ
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login?error=invalid_data");
      }
    } else {
      navigate("/login?error=missing_token");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="auth-google-success">
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>⏳ Đang xử lý đăng nhập...</h2>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}

export default AuthGoogleSuccess;
