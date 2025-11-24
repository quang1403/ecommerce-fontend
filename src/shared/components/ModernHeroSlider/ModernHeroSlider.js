import React, { useState, useEffect } from "react";
import "./ModernHeroSlider.css";

const ModernHeroSlider = ({
  slidesData = null,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Default hero slides data (fallback)
  const defaultSlides = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      subtitle: "Titanium. Mạnh mẽ. Nhẹ nhàng. Siêu pro.",
      description:
        "Được chế tác từ titanium với chip A17 Pro đột phá, nút Action có thể tùy chỉnh và hệ thống camera iPhone mạnh mẽ nhất từ trước đến nay.",
      price: "Từ 29.990.000₫",
      originalPrice: "34.990.000₫",
      discount: "15%",
      buttonText: "Mua ngay",
      buttonSecondary: "Tìm hiểu thêm",
      image: "/images/banner-iphone15-pro.svg",
      background:
        "linear-gradient(135deg, #001E4A 0%, #0B4D8A 50%, #1E40AF 100%)",
      textColor: "white",
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra",
      subtitle: "Galaxy AI đã có mặt",
      description:
        "Gặp gỡ Galaxy S24 Ultra, phiên bản Galaxy Ultra tối thượng với tất cả tính năng Galaxy AI cộng với trải nghiệm S Pen mang tính biểu tượng.",
      price: "Từ 26.990.000₫",
      originalPrice: "30.990.000₫",
      discount: "13%",
      buttonText: "Đặt hàng",
      buttonSecondary: "So sánh",
      image: "/images/banner-samsung-s24.svg",
      background:
        "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
      textColor: "white",
    },
    {
      id: 3,
      title: "Xiaomi 14 Ultra",
      subtitle: "Photography Redefined",
      description:
        "Hệ thống camera Leica chuyên nghiệp với khẩu độ thay đổi, camera telephoto và ultra-wide 50MP cho khả năng chụp ảnh tuyệt vời.",
      price: "Từ 21.990.000₫",
      originalPrice: "24.990.000₫",
      discount: "12%",
      buttonText: "Khám phá",
      buttonSecondary: "Xem demo",
      image: "/images/banner-xiaomi-14.svg",
      background:
        "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)",
      textColor: "white",
    },
    {
      id: 4,
      title: "OnePlus 12",
      subtitle: "Fast and Smooth",
      description:
        "Snapdragon 8 Gen 3, màn hình ProXDR 120Hz và sạc nhanh SUPERVOOC 100W cho trải nghiệm hiệu suất tối thượng.",
      price: "Từ 18.990.000₫",
      originalPrice: "21.990.000₫",
      discount: "14%",
      buttonText: "Mua ngay",
      buttonSecondary: "Đánh giá",
      image: "/images/banner-oneplus-12.svg",
      background:
        "linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)",
      textColor: "white",
    },
    {
      id: 5,
      title: "Google Pixel 8 Pro",
      subtitle: "AI cho mọi người",
      description:
        "Chip Google Tensor G3 mạnh mẽ với khả năng AI tiên tiến, camera computational photography đỉnh cao và trải nghiệm Android thuần túy.",
      price: "Từ 23.990.000₫",
      originalPrice: "27.990.000₫",
      discount: "14%",
      buttonText: "Đặt trước",
      buttonSecondary: "Tính năng AI",
      image: "/images/banner-pixel-8-pro.svg",
      background:
        "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)",
      textColor: "white",
    },
    {
      id: 6,
      title: "BLACK FRIDAY",
      subtitle: "Giảm đến 50%",
      description:
        "Cơ hội vàng sở hữu những flagship hàng đầu với mức giá không thể tốt hơn. Ưu đãi có thời hạn, số lượng có hạn!",
      price: "Chỉ còn 23:45:12",
      originalPrice: "",
      discount: "50%",
      buttonText: "Mua ngay",
      buttonSecondary: "Xem tất cả",
      image: "/images/banner-black-friday.svg",
      background:
        "linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #67E8F9 100%)",
      textColor: "white",
    },
  ];

  // Use provided slides or default slides
  const slides = slidesData || defaultSlides;

  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, autoPlayInterval]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setIsDragging(false);
    setTouchStart(0);
    setTouchEnd(0);
    setTimeout(() => setIsAutoPlaying(true), 100);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAutoPlaying]);

  return (
    <div
      className="modern-hero-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{
              background: slide.background,
              color: slide.textColor,
            }}
          >
            <div className="container">
              <div className="slide-content">
                <div className="content-left">
                  <div className="slide-badge">
                    <span className="new-badge">NEW</span>
                    <span className="discount-badge">-{slide.discount}</span>
                  </div>

                  <h1 className="slide-title">{slide.title}</h1>

                  <h2 className="slide-subtitle">{slide.subtitle}</h2>

                  <p className="slide-description">{slide.description}</p>

                  <div className="price-section">
                    <div className="current-price">{slide.price}</div>
                    <div className="original-price">{slide.originalPrice}</div>
                  </div>

                  <div className="slide-actions">
                    <button className="btn btn-primary btn-lg">
                      <i className="fas fa-shopping-cart"></i>
                      {slide.buttonText}
                    </button>
                    <button className="btn btn-outline btn-lg">
                      <i className="fas fa-info-circle"></i>
                      {slide.buttonSecondary}
                    </button>
                  </div>

                  <div className="slide-features">
                    <div className="feature">
                      <i className="fas fa-shipping-fast"></i>
                      <span>Miễn phí vận chuyển</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-shield-alt"></i>
                      <span>Bảo hành chính hãng</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-sync-alt"></i>
                      <span>Đổi trả 30 ngày</span>
                    </div>
                  </div>
                </div>

                <div className="content-right">
                  <div className="slide-image">
                    <img src={slide.image} alt={slide.title} />
                    <div className="image-effects">
                      <div className="floating-element element-1">
                        <i className="fas fa-camera"></i>
                      </div>
                      <div className="floating-element element-2">
                        <i className="fas fa-bolt"></i>
                      </div>
                      <div className="floating-element element-3">
                        <i className="fas fa-wifi"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="nav-arrow nav-prev"
        onClick={goToPrev}
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button
        className="nav-arrow nav-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Slide Indicators */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="indicator-line"></span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Auto Play Control */}
      <button
        className="autoplay-toggle"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        aria-label={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
      >
        <i className={`fas fa-${isAutoPlaying ? "pause" : "play"}`}></i>
      </button>
    </div>
  );
};

export default ModernHeroSlider;
