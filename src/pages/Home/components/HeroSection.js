import ModernHeroSlider from "../../../shared/components/ModernHeroSlider/ModernHeroSlider";
import VideoSection from "../../../shared/components/VideoSection/VideoSection";
import "./HeroSection.css";

const HeroSection = () => {
  // ModernHeroSlider will handle fetching sliders from API
  // No need to fetch here anymore
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-main-content">
          <div className="hero-slider-wrapper">
            <ModernHeroSlider autoPlay={true} autoPlayInterval={5000} />
          </div>
          <div className="hero-video-wrapper">
            <VideoSection />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
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
