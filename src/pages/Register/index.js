import React from "react";
import { registerCustomer } from "../../services/Api";
const Register = () => {
  const [form, setForm] = React.useState({
    fullName: "",
    password: "",
    email: "",
    phone: "",
    address: "",
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
        address: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại!");
    }
  };
  return (
    <>
      {/* Register Form */}
      <div id="customer">
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && (
          <div className="alert alert-success text-center">{success}</div>
        )}
        <h3 className="text-center">Đăng ký</h3>
        <form method="post" onSubmit={handleSubmit}>
          <div className="row">
            <div id="customer-name" className="col-lg-6 col-md-6 col-sm-12">
              <input
                placeholder="Họ và tên (bắt buộc)"
                type="text"
                name="fullName"
                className="form-control"
                required
                value={form.fullName}
                onChange={handleChange}
              />
            </div>
            <div id="customer-pass" className="col-lg-6 col-md-6 col-sm-12">
              <input
                placeholder="Mật khẩu (bắt buộc)"
                type="password"
                name="password"
                className="form-control"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div id="customer-mail" className="col-lg-6 col-md-6 col-sm-12">
              <input
                placeholder="Email (bắt buộc)"
                type="email"
                name="email"
                className="form-control"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div id="customer-phone" className="col-lg-6 col-md-6 col-sm-12">
              <input
                placeholder="Số điện thoại (bắt buộc)"
                type="text"
                name="phone"
                className="form-control"
                required
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div id="customer-add" className="col-lg-12 col-md-12 col-sm-12">
              <input
                placeholder="Địa chỉ nhà riêng hoặc cơ quan (bắt buộc)"
                type="text"
                name="address"
                className="form-control"
                required
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="by-now col-lg-6 col-md-6 col-sm-12">
              <button type="submit" className="btn btn-primary w-100">
                <b>Đăng ký ngay</b>
              </button>
            </div>
            <div className="by-now col-lg-6 col-md-6 col-sm-12">
              <a href="/">
                <b>Quay về trang chủ</b>
              </a>
            </div>
          </div>
        </form>
      </div>
      {/* End Register Form */}
    </>
  );
};

export default Register;
