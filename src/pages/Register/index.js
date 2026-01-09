import React from "react";
import { registerCustomer } from "../../services/Api";
import GoogleLoginButton from "../../shared/components/GoogleLoginButton";

const Register = () => {
  const [form, setForm] = React.useState({
    fullName: "",
    password: "",
    email: "",
    phone: "",
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  // Validate phone (Vietnam 10-11 số, bắt đầu bằng 0)
  const validatePhone = (phone) => {
    return /^0\d{9,10}$/.test(phone);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateEmail(form.email)) {
      setError("Email không hợp lệ!");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError(
        "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 số, bắt đầu bằng 0."
      );
      return;
    }
    try {
      const res = await registerCustomer(form);
      setSuccess("Đăng ký thành công!");
      setForm({
        fullName: "",
        password: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err?.response?.data?.message || "Đăng ký thất bại!");
    }
  };
  return (
    <>
      <div className="register-container">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <h3 className="register-title">Đăng ký</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="Họ và tên (bắt buộc)"
                required
                value={form.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-col">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Mật khẩu (bắt buộc)"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email (bắt buộc)"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-col">
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="Số điện thoại (bắt buộc)"
                required
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <button type="submit" className="btn-submit">
                Đăng ký ngay
              </button>
            </div>
            <div className="form-col">
              <a href="/" className="btn-back">
                Quay về trang chủ
              </a>
            </div>
          </div>
        </form>

        <div className="divider">
          <span>HOẶC</span>
        </div>

        <GoogleLoginButton text="Đăng ký với Google" />
      </div>
    </>
  );
};

export default Register;
