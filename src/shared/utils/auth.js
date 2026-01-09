// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

// Lấy thông tin user hiện tại từ Redux store trong localStorage
export const getCurrentUser = () => {
  try {
    const persistRoot = localStorage.getItem("persist:root");
    if (!persistRoot) return null;

    const rootState = JSON.parse(persistRoot);
    if (!rootState.auth) return null;

    const authState = JSON.parse(rootState.auth);
    return authState?.login?.currentCustomer || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Lấy token
export const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("persist:root");
  window.location.href = "/login";
};

// Setup Axios interceptors để tự động thêm token vào header
export const setupAxiosInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        logout();
      }
      return Promise.reject(error);
    }
  );
};
