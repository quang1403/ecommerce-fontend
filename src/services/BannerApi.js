import Http from "./Http";

class BannerApi {
  // Get all banners/slides
  static getBanners = () => {
    return Http.get("/banners");
  };

  // Get active banners only
  static getActiveBanners = () => {
    return Http.get("/banners/active");
  };

  // Get banner by ID
  static getBannerById = (id) => {
    return Http.get(`/banners/${id}`);
  };

  // Transform API data to slider format
  static transformToSliderData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return null;

    return apiData
      .map((banner) => ({
        id: banner.id,
        title: banner.title || banner.name,
        subtitle: banner.subtitle || banner.description_short,
        description: banner.description || banner.content,
        price: banner.price ? `Từ ${this.formatPrice(banner.price)}` : null,
        originalPrice: banner.original_price
          ? this.formatPrice(banner.original_price)
          : null,
        discount: banner.discount_percentage
          ? `${banner.discount_percentage}%`
          : null,
        buttonText: banner.button_text || "Mua ngay",
        buttonSecondary: banner.button_secondary || "Tìm hiểu thêm",
        image: banner.image
          ? this.getImageUrl(banner.image)
          : "/images/slide-1.png",
        background:
          banner.background_color ||
          banner.gradient ||
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: banner.text_color || "white",
        link: banner.link || banner.product_link,
        isActive: banner.status === 1 || banner.is_active,
        order: banner.sort_order || banner.position || 0,
      }))
      .filter((slide) => slide.isActive)
      .sort((a, b) => a.order - b.order);
  };

  // Format price to Vietnamese currency
  static formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get full image URL
  static getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/slide-1.png";

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) return imagePath;

    // If it starts with /, it's relative to domain
    if (imagePath.startsWith("/")) return imagePath;

    // Otherwise, assume it's in uploads folder
    return `/uploads/banners/${imagePath}`;
  };
}

export default BannerApi;
