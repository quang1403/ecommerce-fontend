import Http from "./Http";


export const getAllSliders = async () => {
  try {
    const response = await Http.get("/sliders");
    // Transform backend data to match frontend format
    const sliders = Array.isArray(response.data) ? response.data : [];
    return {
      ...response,
      data: sliders.map((slider) => ({
        _id: slider.id || slider._id,
        title: slider.title || "",
        image: slider.image,
        link: slider.link || "",
        createdAt: slider.createdAt || new Date().toISOString(),
        updatedAt: slider.updatedAt || new Date().toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching sliders:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một slider
 * @param {string} id - ID của slider
 * @returns {Promise} Promise chứa thông tin slider
 */
export const getSliderById = (id) => {
  return Http.get(`/sliders/${id}`);
};

// ================ ADMIN APIs ================

/**
 * Tạo slider mới (Admin only)
 * @param {Object} sliderData - Dữ liệu slider
 * @param {string} sliderData.title - Tiêu đề
 * @param {string} sliderData.image - URL ảnh (required)
 * @param {string} sliderData.link - Link đích
 * @returns {Promise} Promise chứa slider mới tạo
 */
export const createSlider = (sliderData) => {
  return Http.post("/sliders", sliderData);
};

/**
 * Cập nhật slider (Admin only)
 * @param {string} id - ID của slider
 * @param {Object} sliderData - Dữ liệu cập nhật
 * @returns {Promise} Promise chứa slider đã cập nhật
 */
export const updateSlider = (id, sliderData) => {
  return Http.put(`/sliders/${id}`, sliderData);
};

/**
 * Xóa slider (Admin only)
 * @param {string} id - ID của slider
 * @returns {Promise} Promise chứa kết quả xóa
 */
export const deleteSlider = (id) => {
  return Http.delete(`/sliders/${id}`);
};

// Export default object containing all functions
const sliderService = {
  getAllSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
};

export default sliderService;
