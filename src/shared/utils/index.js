import { BASE_URL } from "../constants/app";

// Lấy ảnh sản phẩm (upload)
export const getImageProduct = (imagePath) => {
  if (!imagePath) return "/no-image.png"; // fallback nếu không có ảnh

  // Nếu đã có '/uploads/' trong path thì nối thẳng BASE_URL
  if (imagePath.startsWith("/uploads/")) {
    return `${BASE_URL}${imagePath}`;
  }

  // Ngược lại chỉ là fileName thì tự động thêm '/uploads/'
  return `${BASE_URL}/uploads/${imagePath}`;
};

// Lấy ảnh slider (tĩnh trong /public/images/sliders)
export const getImageSlider = (imageName) => {
  return `${BASE_URL}/images/sliders/${imageName}`;
};

// Lấy ảnh banner (tĩnh trong /public/images/banners)
export const getImageBanner = (imageName) => {
  return `${BASE_URL}/images/banners/${imageName}`;
};
