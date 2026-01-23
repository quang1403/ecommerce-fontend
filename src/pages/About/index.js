import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Về PhoneStore</h1>
            <p className="hero-subtitle">
              Đối tác tin cậy của bạn trong việc mua sắm điện thoại di động và
              công nghệ
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2>Câu chuyện của chúng tôi</h2>
              <p>
                PhoneStore được thành lập vào năm 2020 với sứ mệnh mang đến cho
                khách hàng những sản phẩm điện thoại di động chính hãng, chất
                lượng cao với giá cả cạnh tranh nhất.
              </p>
              <p>
                Khởi đầu từ một cửa hàng nhỏ tại Hà Nội, chúng tôi đã không
                ngừng phát triển và mở rộng để phục vụ hàng triệu khách hàng
                trên toàn quốc. Với đội ngũ nhân viên tận tâm và am hiểu sản
                phẩm, chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng
                đầu.
              </p>
              <p>
                Ngày nay, PhoneStore tự hào là một trong những nhà bán lẻ điện
                thoại di động uy tín nhất tại Việt Nam, với hệ thống cửa hàng
                trải dài khắp cả nước và dịch vụ online tiện lợi.
              </p>
            </div>
            <div className="story-image">
              <img src="/images/story.jpg" alt="PhoneStore Story" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card mission-card">
              <div className="mv-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Sứ mệnh</h3>
              <p>
                Mang đến cho mọi người những sản phẩm công nghệ chất lượng cao,
                giá cả hợp lý và dịch vụ chăm sóc khách hàng tốt nhất. Chúng tôi
                cam kết xây dựng niềm tin và tạo ra giá trị bền vững cho khách
                hàng, đối tác và cộng đồng.
              </p>
            </div>
            <div className="mv-card vision-card">
              <div className="mv-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h3>Tầm nhìn</h3>
              <p>
                Trở thành nhà bán lẻ điện thoại di động hàng đầu Việt Nam, được
                khách hàng tin tưởng và lựa chọn. Chúng tôi không ngừng đổi mới,
                phát triển để mang đến trải nghiệm mua sắm tuyệt vời nhất trong
                lĩnh vực công nghệ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <h2 className="section-title">Giá trị cốt lõi</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4>Uy tín</h4>
              <p>
                100% sản phẩm chính hãng, có nguồn gốc rõ ràng. Chúng tôi cam
                kết không bán hàng giả, hàng nhái.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h4>Chất lượng</h4>
              <p>
                Sản phẩm được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.
                Bảo hành chính hãng toàn diện.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h4>Tận tâm</h4>
              <p>
                Đội ngũ nhân viên luôn sẵn sàng tư vấn nhiệt tình, hỗ trợ khách
                hàng 24/7.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h4>Đổi mới</h4>
              <p>
                Không ngừng cập nhật công nghệ mới, cải thiện dịch vụ để mang
                đến trải nghiệm tốt nhất.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h4>Trách nhiệm</h4>
              <p>
                Cam kết với khách hàng, đối tác và xã hội. Luôn đặt lợi ích
                chung lên hàng đầu.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h4>Giá tốt</h4>
              <p>
                Giá cả cạnh tranh nhất thị trường với nhiều chương trình khuyến
                mãi hấp dẫn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="statistics">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Năm kinh nghiệm</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Cửa hàng toàn quốc</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Khách hàng tin tưởng</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Sản phẩm đa dạng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Tại sao chọn PhoneStore?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h4>Sản phẩm chính hãng 100%</h4>
              <p>
                Cam kết tất cả sản phẩm đều chính hãng, có tem phụ, hóa đơn đầy
                đủ. Hoàn tiền 200% nếu phát hiện hàng giả.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h4>Giao hàng nhanh chóng</h4>
              <p>
                Giao hàng toàn quốc trong 1-2 ngày. Miễn phí vận chuyển cho đơn
                hàng trên 5 triệu đồng.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-undo"></i>
              </div>
              <h4>Đổi trả dễ dàng</h4>
              <p>
                Chính sách đổi trả trong 7 ngày. Hoàn tiền 100% nếu sản phẩm lỗi
                từ nhà sản xuất.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h4>Hỗ trợ 24/7</h4>
              <p>
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc mọi
                nơi qua hotline, chat, email.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h4>Bảo hành tận nơi</h4>
              <p>
                Dịch vụ bảo hành tại nhà miễn phí. Máy thay thế trong quá trình
                bảo hành.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h4>Thanh toán linh hoạt</h4>
              <p>
                Hỗ trợ nhiều hình thức thanh toán: tiền mặt, chuyển khoản, trả
                góp 0% lãi suất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng mua sắm cùng chúng tôi?</h2>
            <p>
              Khám phá hàng ngàn sản phẩm điện thoại di động chính hãng với giá
              tốt nhất thị trường
            </p>
            <div className="cta-buttons">
              <Link to="/products" className="btn btn-primary">
                <i className="fas fa-shopping-bag"></i>
                Mua sắm ngay
              </Link>
              <Link to="/contact" className="btn btn-outline">
                <i className="fas fa-phone"></i>
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
