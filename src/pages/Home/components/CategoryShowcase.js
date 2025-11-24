import { Link } from "react-router-dom";
import "./CategoryShowcase.css";

const CategoryShowcase = ({ brands }) => {
  // Debug: kiểm tra tên brand từ API
  console.log(
    "Brands from API:",
    brands.map((brand) => brand.name)
  );

  // Tạo category items với icons và colors tương ứng
  const categoryItems = brands.map((brand) => {
    console.log(`Brand: ${brand.name}, Image: ${getCategoryImage(brand.name)}`);
    return {
      id: brand._id,
      name: brand.name,
      icon: getCategoryIcon(brand.name),
      color: getCategoryColor(brand.name),
      link: `/brand/${brand._id}`,
      image: getCategoryImage(brand.name),
      description: getCategoryDescription(brand.name),
    };
  });

  function getCategoryIcon(brandName) {
    const icons = {
      iPhone: "fab fa-apple",
      Samsung: "fas fa-mobile-alt",
      Xiaomi: "fas fa-bolt",
      OPPO: "fas fa-camera",
      Vivo: "fas fa-music",
      Realme: "fas fa-gamepad",
      OnePlus: "fas fa-rocket",
    };
    return icons[brandName] || "fas fa-mobile-alt";
  }

  function getCategoryColor(brandName) {
    const colors = {
      iPhone: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      Samsung: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      Xiaomi: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      OPPO: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      Vivo: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      Realme: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      OnePlus: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    };
    return (
      colors[brandName] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    );
  }

  function getCategoryImage(brandName) {
    const images = {
      // Mapping chính xác
      iPhone: "/images/apple.png",
      Apple: "/images/apple.png", // Thêm fallback
      Samsung: "/images/samsung.png",
      Xiaomi: "/images/xiaomi.png",
      OPPO: "/images/oppo.png",
      Vivo: "/images/vivo.png",
      Realme: "/images/realme.png",
      OnePlus: "/images/oneplus.png",
    };
    console.log(
      `Getting image for brand: ${brandName}, result: ${
        images[brandName] || "/images/product-1.png"
      }`
    );
    return images[brandName] || "/images/product-1.png";
  }

  function getCategoryDescription(brandName) {
    const descriptions = {
      iPhone: "Điện thoại cao cấp với hệ điều hành iOS",
      Samsung: "Công nghệ Android hàng đầu thế giới",
      Xiaomi: "Hiệu năng mạnh mẽ, giá cả hợp lý",
      OPPO: "Chuyên gia selfie và nhiếp ảnh",
      Vivo: "Thiết kế đẹp, âm thanh sống động",
      Realme: "Gaming phone cho thế hệ trẻ",
      OnePlus: "Flagship killer với hiệu năng khủng",
    };
    return descriptions[brandName] || "Khám phá dòng sản phẩm mới nhất";
  }

  return (
    <div className="category-showcase">
      <div className="category-grid">
        {categoryItems.map((category, index) => (
          <Link
            to={category.link}
            key={category.id}
            className={`category-item ${index === 0 ? "featured" : ""}`}
            style={{ "--category-color": category.color }}
          >
            <div className="category-background">
              <div className="category-icon">
                <i className={category.icon}></i>
              </div>
              <div className="category-image">
                <img
                  src={category.image}
                  alt={category.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/product-1.png";
                  }}
                />
              </div>
            </div>

            <div className="category-content">
              <h3 className="category-title">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="category-action">
                <span>Khám phá ngay</span>
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>

            <div className="category-overlay"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;
