import { useState, useEffect } from "react";
import { getBrands } from "../../../services/Api";
import "./ModernSidebar.css";

const ModernSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isExpanded, setIsExpanded] = useState({
    brands: true,
    price: true,
    features: true,
    promotions: true,
  });

  // Features list
  const features = [
    { id: "camera", name: "Camera tốt", icon: "fas fa-camera" },
    { id: "battery", name: "Pin trâu", icon: "fas fa-battery-full" },
    { id: "gaming", name: "Gaming", icon: "fas fa-gamepad" },
    { id: "waterproof", name: "Chống nước", icon: "fas fa-shield-alt" },
    {
      id: "wireless-charging",
      name: "Sạc không dây",
      icon: "fas fa-charging-station",
    },
    { id: "face-id", name: "Face ID", icon: "fas fa-user-shield" },
    { id: "5g", name: "Hỗ trợ 5G", icon: "fas fa-signal" },
    { id: "dual-sim", name: "2 SIM", icon: "fas fa-sim-card" },
  ];

  // Price ranges
  const priceRanges = [
    { label: "Dưới 5 triệu", min: 0, max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
    { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
    { label: "Trên 30 triệu", min: 30000000, max: 50000000 },
  ];

  useEffect(() => {
    // Fetch brands
    getBrands({})
      .then((res) => setBrands(res.data.data || []))
      .catch((error) => console.log(error));
  }, []);

  // Handle filter changes
  useEffect(() => {
    const filters = {
      brands: selectedBrands,
      priceRange,
      features: selectedFeatures,
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [selectedBrands, priceRange, selectedFeatures, onFilterChange]);

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleFeatureChange = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handlePriceRangeSelect = (min, max) => {
    setPriceRange([min, max]);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setPriceRange([0, 50000000]);
  };

  const toggleSection = (section) => {
    setIsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <div className="modern-sidebar">
      {/* Filter Header */}
      <div className="sidebar-header">
        <h3>
          <i className="fas fa-filter"></i>
          Bộ lọc sản phẩm
        </h3>
        {(selectedBrands.length > 0 ||
          selectedFeatures.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 50000000) && (
          <button className="clear-filters" onClick={clearFilters}>
            <i className="fas fa-times"></i>
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Active Filters */}
      {(selectedBrands.length > 0 || selectedFeatures.length > 0) && (
        <div className="active-filters">
          <h4>Đã chọn:</h4>
          <div className="filter-tags">
            {selectedBrands.map((brandId) => {
              const brand = brands.find((b) => b._id === brandId);
              return brand ? (
                <span key={brandId} className="filter-tag">
                  {brand.name}
                  <button onClick={() => handleBrandChange(brandId)}>
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ) : null;
            })}
            {selectedFeatures.map((featureId) => {
              const feature = features.find((f) => f.id === featureId);
              return feature ? (
                <span key={featureId} className="filter-tag">
                  {feature.name}
                  <button onClick={() => handleFeatureChange(featureId)}>
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("price")}>
          <h4>
            <i className="fas fa-dollar-sign"></i>
            Khoảng giá
          </h4>
          <i
            className={`fas fa-chevron-${isExpanded.price ? "up" : "down"}`}
          ></i>
        </div>

        {isExpanded.price && (
          <div className="section-content">
            <div className="price-ranges">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  className={`price-range-btn ${
                    priceRange[0] === range.min && priceRange[1] === range.max
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handlePriceRangeSelect(range.min, range.max)}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="custom-range">
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ])
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value) || 50000000,
                    ])
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="filter-section">
        <div className="section-header" onClick={() => toggleSection("brands")}>
          <h4>
            <i className="fas fa-tags"></i>
            Thương hiệu
          </h4>
          <i
            className={`fas fa-chevron-${isExpanded.brands ? "up" : "down"}`}
          ></i>
        </div>

        {isExpanded.brands && (
          <div className="section-content">
            <div className="brand-list">
              {brands.map((brand) => (
                <label key={brand._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand._id)}
                    onChange={() => handleBrandChange(brand._id)}
                  />
                  <span className="checkmark"></span>
                  <span className="brand-name">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Filter */}
      <div className="filter-section">
        <div
          className="section-header"
          onClick={() => toggleSection("features")}
        >
          <h4>
            <i className="fas fa-star"></i>
            Tính năng nổi bật
          </h4>
          <i
            className={`fas fa-chevron-${isExpanded.features ? "up" : "down"}`}
          ></i>
        </div>

        {isExpanded.features && (
          <div className="section-content">
            <div className="features-grid">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  className={`feature-btn ${
                    selectedFeatures.includes(feature.id) ? "active" : ""
                  }`}
                  onClick={() => handleFeatureChange(feature.id)}
                >
                  <i className={feature.icon}></i>
                  <span>{feature.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Promotions Banner */}
      <div className="filter-section">
        <div
          className="section-header"
          onClick={() => toggleSection("promotions")}
        >
          <h4>
            <i className="fas fa-gift"></i>
            Khuyến mãi hot
          </h4>
          <i
            className={`fas fa-chevron-${
              isExpanded.promotions ? "up" : "down"
            }`}
          ></i>
        </div>

        {isExpanded.promotions && (
          <div className="section-content">
            <div className="promotion-banners">
              <div className="promo-banner flash-sale">
                <div className="promo-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="promo-content">
                  <h5>Flash Sale</h5>
                  <p>Giảm đến 50%</p>
                  <div className="countdown">
                    <span>02:45:30</span>
                  </div>
                </div>
              </div>

              <div className="promo-banner new-arrival">
                <div className="promo-icon">
                  <i className="fas fa-sparkles"></i>
                </div>
                <div className="promo-content">
                  <h5>Hàng mới về</h5>
                  <p>iPhone 15 Series</p>
                </div>
              </div>

              <div className="promo-banner trade-in">
                <div className="promo-icon">
                  <i className="fas fa-recycle"></i>
                </div>
                <div className="promo-content">
                  <h5>Thu cũ đổi mới</h5>
                  <p>Trợ giá thêm 2 triệu</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Contact */}
      <div className="sidebar-contact">
        <div className="contact-card">
          <div className="contact-icon">
            <i className="fas fa-headset"></i>
          </div>
          <div className="contact-info">
            <h4>Cần hỗ trợ?</h4>
            <p>Tư vấn miễn phí</p>
            <a href="tel:19001234" className="contact-btn">
              <i className="fas fa-phone"></i>
              1900 1234
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
