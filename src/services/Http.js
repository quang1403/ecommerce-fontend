import axios from "axios";
import { BASE_API } from "../shared/constants/app";
const Http = axios.create({
  baseURL: BASE_API,
});

// Interceptor tự động gắn accessToken vào header nếu có
Http.interceptors.request.use(
  (config) => {
    // Log kiểm tra interceptor có chạy
    const auth = JSON.parse(localStorage.getItem("persist:root") || "{}");
    let token = "";

    // Cách 1: Lấy từ Redux persist
    if (auth && auth.auth) {
      try {
        const authState = JSON.parse(auth.auth);
        token = authState?.login?.currentCustomer?.accessToken;
      } catch {}
    }

    // Cách 2: Fallback - lấy trực tiếp từ localStorage nếu không có trong Redux
    if (!token) {
      token = localStorage.getItem("accessToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default Http;
