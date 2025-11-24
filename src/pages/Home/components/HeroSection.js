import { useState, useEffect } from "react";
import ModernHeroSlider from "../../../shared/components/ModernHeroSlider/ModernHeroSlider";
import BannerApi from "../../../services/BannerApi";
import "./HeroSection.css";

const HeroSection = () => {
  const [slidesData, setSlidesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch banner data from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await BannerApi.getActiveBanners();
        const transformedSlides = BannerApi.transformToSliderData(response.data);
        setSlidesData(transformedSlides);
      } catch (error) {
        console.log("Failed to load banners, using default slides:", error);
        // Will use default slides in ModernHeroSlider
        setSlidesData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <section className="hero-section loading">
        <div className="hero-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      {/* Modern Hero Slider */}
      <ModernHeroSlider 
        slidesData={slidesData}
        autoPlay={true}
        autoPlayInterval={5000}
      />
      
      {/* Quick Stats - Moved outside slider */}
      <div className="hero-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <div className="stat-content">
                <h4>Miễn phí vận chuyển</h4>
                <p>Cho đơn hàng từ 500k</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="stat-content">
                <h4>Bảo hành chính hãng</h4>
                <p>12 tháng toàn quốc</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <div className="stat-content">
                <h4>Đổi trả 7 ngày</h4>
                <p>Miễn phí đổi trả</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="stat-content">
                <h4>Hỗ trợ 24/7</h4>
                <p>Tư vấn nhiệt tình</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;