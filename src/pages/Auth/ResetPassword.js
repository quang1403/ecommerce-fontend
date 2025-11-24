import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/Api";
import { toast } from "react-toastify";
import "./Auth.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL params
    const urlParams = new URLSearchParams(location.search);
    const resetToken = urlParams.get("token");

    if (!resetToken) {
      setTokenValid(false);
      toast.error("Link đặt lại mật khẩu không hợp lệ");
    } else {
      setToken(resetToken);
    }
  }, [location]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, newPassword);

      if (response.data.success) {
        toast.success("Đặt lại mật khẩu thành công!");
        // Chuyển về trang login sau 2 giây
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>❌ Link không hợp lệ</h2>
            <p>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn</p>
          </div>

          <div className="error-content">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>

            <div className="error-message">
              <h3>Không thể đặt lại mật khẩu</h3>
              <p>Link có thể đã hết hạn hoặc đã được sử dụng</p>
            </div>
          </div>

          <div className="auth-footer">
            <Link to="/forgot-password" className="btn-primary">
              <i className="fas fa-redo"></i>
              Yêu cầu link mới
            </Link>

            <Link to="/login" className="back-to-login">
              <i className="fas fa-arrow-left"></i>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Đặt lại mật khẩu</h2>
          <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword">
              <i className="fas fa-lock"></i>
              Mật khẩu mới
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                disabled={loading}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            <div className="password-strength">
              <small>Mật khẩu phải có ít nhất 6 ký tự</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i>
              Xác nhận mật khẩu
            </label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                <i
                  className={`fas ${
                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <div className="password-mismatch">
                <small>Mật khẩu xác nhận không khớp</small>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`btn-primary ${loading ? "loading" : ""}`}
            disabled={
              loading ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Đang cập nhật...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Đặt lại mật khẩu
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="back-to-login">
            <i className="fas fa-arrow-left"></i>
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
