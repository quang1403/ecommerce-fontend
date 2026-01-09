import React, { useState } from "react";
import { loginCustomer } from "../../services/Api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux-setup/reducers/auth";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../shared/components/GoogleLoginButton";

const Login = () => {
  const [formInputs, setFormInputs] = useState({});
  const [errorLogin, setErrorLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changeFormInputs = (e) => {
    const { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });
  };
  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const clickLogin = async (e) => {
    e.preventDefault();
    setErrorLogin(false);
    if (!validateEmail(formInputs.email || "")) {
      setErrorLogin("Email không hợp lệ!");
      return;
    }
    try {
      const { data } = await loginCustomer(formInputs);
      if (data.user?.isAdmin) {
        localStorage.setItem("accessToken", data.token);
        dispatch(loginSuccess({ ...data.user, accessToken: data.token }));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return navigate("/admin");
      }
      localStorage.setItem("accessToken", data.token);
      dispatch(loginSuccess({ ...data.user, accessToken: data.token }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return navigate("/");
    } catch (error) {
      if (error.response?.data === "email not valid")
        return setErrorLogin("Thông tin email không hợp lệ!");
      if (error.response?.data === "password not valid")
        return setErrorLogin("Thông tin mật khẩu không hợp lệ!");
      return setErrorLogin("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="LoginPage">
      <div className="login-card">
        {errorLogin && <div className="alert alert-danger">{errorLogin}</div>}
        <h3>Đăng nhập</h3>
        <form onSubmit={clickLogin}>
          <div className="form-group">
            <input
              onChange={changeFormInputs}
              placeholder="Email (bắt buộc)"
              type="email"
              name="email"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input
              onChange={changeFormInputs}
              placeholder="Mật khẩu (bắt buộc)"
              type="password"
              name="password"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Đăng nhập ngay
          </button>
        </form>
        <div className="divider">
          <span>HOẶC</span>
        </div>
        <GoogleLoginButton />
        <div className="login-links">
          <div className="login-links-row">
            <a href="/register">Đăng ký tài khoản</a>
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
          <a href="/">Quay về trang chủ</a>
        </div>
      </div>
    </div>
  );
};
export default Login;
