import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { searchProducts, getCategories } from "../../services/Api";
import ProductItem from "../../shared/components/ProductItem";
import HeroSection from "./components/HeroSection";
import BlogSection from "./components/BlogSection";
import FeaturedProducts from "./components/FeaturedProducts";
import TrustSignals from "./components/TrustSignals";
import Newsletter from "./components/Newsletter";
import "./ModernHome.css";

const ModernHome = () => {
  useEffect(() => {
    const showAd = () => {
      toast.info(
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/product-1.png"
            alt="Sản phẩm nổi bật"
            style={{ width: 48, height: 48, marginRight: 12, borderRadius: 8 }}
          />
          <div>
            <b>S25 Ultra hàng bán 30tr, PhoneStore bán 25tr</b>
            <div style={{ fontSize: 13 }}>Bảo hành Chính hãng</div>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    };
    showAd(); // Hiển thị lần đầu
    const interval = setInterval(showAd, 15000); // Lặp lại mỗi 15s
    return () => clearInterval(interval);
  }, []);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [tabletProducts, setTabletProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories first
        const categoriesRes = await getCategories({});
        const categoriesData = categoriesRes.data.data || [];
        setCategories(categoriesData);
        setCategoriesLoaded(true);

        // Find category IDs
        const tabletCategory = categoriesData.find(
          (cat) => cat.name === "Máy tính bảng"
        );
        const accessoryCategory = categoriesData.find(
          (cat) => cat.name === "Phụ kiện"
        );

        // Fetch featured products
        const featuredRes = await searchProducts({ featured: true, limit: 8 });
        setFeaturedProducts(featuredRes.data.data || []);

        // Fetch latest products (theo trường isLatest)
        const latestRes = await searchProducts({ isLatest: true, limit: 8 });
        setLatestProducts(latestRes.data.data || []);

        // Fetch tablet products
        if (tabletCategory) {
          const tabletRes = await searchProducts({
            category: tabletCategory._id,
            limit: 8,
          });
          setTabletProducts(tabletRes.data.data || []);
        }

        // Fetch accessory products
        if (accessoryCategory) {
          const accessoryRes = await searchProducts({
            category: accessoryCategory._id,
            limit: 8,
          });
          setAccessoryProducts(accessoryRes.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get category ID safely
  const getCategoryId = (categoryName) => {
    if (!categoriesLoaded || !categories.length) return "";
    const category = categories.find((cat) => cat.name === categoryName);
    return category?._id || "";
  };

  if (loading) {
    return (
      <div className="home-loading-container">
        <div className="home-loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <ToastContainer />
      <HeroSection />

      {/* Featured Products */}
      <section className="home-section home-featured-section">
        <div className="home-inner-container">
          <div className="home-section-header">
            <h2>Sản phẩm nổi bật</h2>
            <p>Những sản phẩm được yêu thích nhất</p>
            <Link to="/products/?featured=true" className="home-view-all-btn">
              Xem tất cả <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>

      {/* Latest Products */}
      <section className="home-section home-latest-section">
        <div className="home-inner-container">
          <div className="home-section-header">
            <h2>Sản phẩm mới nhất</h2>
            <p>Cập nhật những mẫu điện thoại mới nhất</p>
            <Link to="/products?isLatest=true" className="home-view-all-btn">
              Xem tất cả <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <FeaturedProducts products={latestProducts} />
        </div>
      </section>

      {/* Tablet Products */}
      {tabletProducts.length > 0 && (
        <section className="home-section home-tablet-section section tablet-section">
          <div className="home-inner-container">
            <div className="home-section-header section-header">
              <h2>Máy tính bảng</h2>
              <p>Khám phá dòng máy tính bảng hiện đại</p>
              <Link
                to={`/products?category=${getCategoryId("Máy tính bảng")}`}
                className="home-view-all-btn view-all-btn"
              >
                Xem tất cả <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <FeaturedProducts products={tabletProducts} />
          </div>
        </section>
      )}

      {/* Accessory Products */}
      {accessoryProducts.length > 0 && (
        <section className="home-section home-accessory-section section accessory-section">
          <div className="home-inner-container">
            <div className="home-section-header section-header">
              <h2>Phụ kiện</h2>
              <p>Phụ kiện chính hãng cho thiết bị của bạn</p>
              <Link
                to={`/products?category=${getCategoryId("Phụ kiện")}`}
                className="home-view-all-btn view-all-btn"
              >
                Xem tất cả <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <FeaturedProducts products={accessoryProducts} />
          </div>
        </section>
      )}

      {/* Blog/Tech News Section */}
      <section className="home-section home-blog-section">
        <div className="home-inner-container">
          <div className="home-section-header">
            <h2>Tin tức công nghệ</h2>
            <p>Cập nhật xu hướng và đánh giá sản phẩm mới nhất</p>
            <Link to="/news" className="home-view-all-btn">
              Xem tất cả <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <BlogSection />
        </div>
      </section>

      {/* Trust Signals */}
      <TrustSignals />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default ModernHome;
