import "./TrustSignals.css";

const TrustSignals = () => {
  const trustItems = [
    {
      icon: "fas fa-medal",
      title: "Sản phẩm chính hãng 100%",
      description:
        "Cam kết bán hàng chính hãng, có tem niêm phong và hóa đơn VAT",
    },
    {
      icon: "fas fa-shipping-fast",
      title: "Giao hàng nhanh toàn quốc",
      description:
        "Giao hàng trong 2-24h tại Hà Nội, HCM. Miễn phí ship với đơn từ 500k",
    },
    {
      icon: "fas fa-phone-alt",
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng mọi lúc mọi nơi",
    },
  ];

  return (
    <section className="trust-signals">
      <div className="container">
        <div className="section-header text-center">
          <h2>Tại sao chọn chúng tôi?</h2>
          <p>Những cam kết và dịch vụ tốt nhất dành cho khách hàng</p>
        </div>

        <div className="trust-grid">
          {trustItems.map((item, index) => (
            <div key={index} className="trust-item">
              <div className="trust-icon">
                <i className={item.icon}></i>
              </div>
              <div className="trust-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="trust-stats">
          <div className="stat">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Khách hàng tin tưởng</div>
          </div>
          <div className="stat">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Sản phẩm đã bán</div>
          </div>
          <div className="stat">
            <div className="stat-number">99%</div>
            <div className="stat-label">Khách hàng hài lòng</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Hỗ trợ không ngừng</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
