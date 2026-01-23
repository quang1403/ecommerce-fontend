/**
 * Warranty Service
 * API calls for warranty management
 */

import Http from "./Http";

/**
 * PUBLIC APIs - Tra cứu bảo hành
 */

// Tra cứu theo mã bảo hành (PUBLIC)
export const searchByCode = async (code) => {
  try {
    const res = await Http.get(`/warranty/check/${code}`);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tra cứu thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in searchByCode:", error);
    throw error;
  }
};

// Tra cứu theo IMEI (PUBLIC)
export const searchByIMEI = async (imei) => {
  try {
    const res = await Http.get(`/warranty/check-imei/${imei}`);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tra cứu thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in searchByIMEI:", error);
    throw error;
  }
};

/**
 * ADMIN APIs - Quản lý bảo hành
 */

// Tra cứu user theo số điện thoại (ADMIN)
export const searchUser = async (phone) => {
  try {
    const res = await Http.get(`/users/search?phone=${phone}`);
    const data = res.data;

    if (!data.success) {
      console.log("User not found, can create new");
      return { success: false, message: "Chưa tìm thấy khách hàng" };
    }

    return data;
  } catch (error) {
    console.error("Error in searchUser:", error);
    return { success: false, message: error.message };
  }
};

// Tạo warranty mới (ADMIN)
export const createWarranty = async (warrantyData) => {
  try {
    const res = await Http.post("/warranty", warrantyData);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tạo bảo hành thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in createWarranty:", error);
    throw error;
  }
};

// Lấy danh sách warranties (ADMIN)
export const getWarranties = async (params = {}) => {
  try {
    const res = await Http.get("/warranty", { params });
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tải danh sách thất bại");
    }

    return data;
  } catch (error) {
    console.error("Error in getWarranties:", error);
    throw error;
  }
};

// Lấy chi tiết warranty (ADMIN)
export const getWarrantyDetail = async (id) => {
  try {
    const res = await Http.get(`/warranty/${id}`);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Lấy thông tin thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in getWarrantyDetail:", error);
    throw error;
  }
};

// Cập nhật warranty (ADMIN)
export const updateWarranty = async (id, updateData) => {
  try {
    const res = await Http.put(`/warranty/${id}`, updateData);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Cập nhật thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in updateWarranty:", error);
    throw error;
  }
};

// Xóa warranty (ADMIN)
export const deleteWarranty = async (id) => {
  try {
    const res = await Http.delete(`/warranty/${id}`);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Xóa thất bại");
    }

    return data;
  } catch (error) {
    console.error("Error in deleteWarranty:", error);
    throw error;
  }
};

/**
 * CLAIM APIs
 */

// Tạo claim mới (ADMIN)
export const createClaim = async (warrantyId, claimData) => {
  try {
    const res = await Http.post(`/warranty/${warrantyId}/claims`, claimData);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tạo claim thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in createClaim:", error);
    throw error;
  }
};

// Cập nhật claim (ADMIN)
export const updateClaim = async (warrantyId, claimId, updateData) => {
  try {
    const res = await Http.put(
      `/warranty/${warrantyId}/claims/${claimId}`,
      updateData,
    );
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Cập nhật claim thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in updateClaim:", error);
    throw error;
  }
};

// Xóa claim (ADMIN)
export const deleteClaim = async (warrantyId, claimId) => {
  try {
    const res = await Http.delete(`/warranty/${warrantyId}/claims/${claimId}`);
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Xóa claim thất bại");
    }

    return data;
  } catch (error) {
    console.error("Error in deleteClaim:", error);
    throw error;
  }
};

/**
 * STATISTICS APIs
 */

// Lấy thống kê (ADMIN)
export const getWarrantyStats = async () => {
  try {
    const res = await Http.get("/warranty/stats");
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tải thống kê thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in getWarrantyStats:", error);
    throw error;
  }
};

/**
 * USER APIs - Tra cứu bảo hành của user
 */

// Lấy danh sách bảo hành của user đăng nhập (USER)
export const getUserWarranties = async () => {
  try {
    const res = await Http.get("/warranty/user");
    const data = res.data;

    if (!data.success) {
      throw new Error(data.message || "Tải danh sách bảo hành thất bại");
    }

    return data.data;
  } catch (error) {
    console.error("Error in getUserWarranties:", error);
    throw error;
  }
};
