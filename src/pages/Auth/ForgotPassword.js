import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/Api";
import { toast } from "react-toastify";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không đúng định dạng");
      return;
    }

    setLoading(true);
    try {
      const response = await forgotPassword(email);

      if (response.data.success) {
        setEmailSent(true);
        toast.success(
          "Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!"
        );
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>📧 Email đã được gửi</h2>
            <p>Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn</p>
          </div>

          <div className="email-sent-content">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>

            <div className="email-instructions">
              <h3>Kiểm tra email của bạn</h3>
              <p>
                Email đã được gửi đến: <strong>{email}</strong>
              </p>

              <div className="instructions-list">
                <div className="instruction-item">
                  <i className="fas fa-envelope"></i>
                  <span>Kiểm tra hộp thư đến</span>
                </div>
                <div className="instruction-item">
                  <i className="fas fa-spam"></i>
                  <span>Nếu không thấy, kiểm tra thư mục spam</span>
                </div>
                <div className="instruction-item">
                  <i className="fas fa-clock"></i>
                  <span>Link có hiệu lực trong 1 giờ</span>
                </div>
              </div>
            </div>

            <div className="resend-section">
              <p>Không nhận được email?</p>
              <button
                className="btn-secondary"
                onClick={() => setEmailSent(false)}
              >
                Gửi lại
              </button>
            </div>
          </div>

          <div className="auth-footer">
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
          <h2>🔒 Quên mật khẩu?</h2>
          <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email đăng ký
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className={`btn-primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Đang gửi...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Gửi email đặt lại mật khẩu
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <div className="auth-footer">
          <Link to="/login" className="back-to-login">
            <i className="fas fa-arrow-left"></i>
            Quay lại đăng nhập
          </Link>

          <div className="auth-links">
            <span>Chưa có tài khoản? </span>
            <Link to="/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
