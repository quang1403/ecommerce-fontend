import { Link } from "react-router-dom";
import "./ModernFooter.css";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert("Đăng ký nhận tin thành công!");
      e.target.reset();
    }
  };

  return (
    <footer className="modern-footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Đăng ký nhận tin khuyến mãi</h3>
              <p>
                Nhận thông báo về những sản phẩm mới nhất và ưu đãi đặc biệt
              </p>
            </div>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  required
                />
                <button type="submit">
                  <i className="fas fa-paper-plane"></i>
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-column company-info">
              <div className="footer-logo">
                <img src="/images/logo.png" alt="Phone Store" />
                <span>PhoneStore</span>
              </div>
              <p className="company-desc">
                Chuyên cung cấp điện thoại di động chính hãng với giá tốt nhất
                thị trường. Uy tín - Chất lượng - Bảo hành tận tâm.
              </p>

              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Nguyễn Văn Linh, Hoàng Mai, Hà Nội</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>support@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <span>8:00 - 22:00 (Tất cả các ngày)</span>
                </div>
              </div>

              <div className="social-links">
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <a
                  href="https://tiktok.com"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
                <a
                  href="https://zalo.me"
                  aria-label="Zalo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-comment"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4>Liên kết nhanh</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">Trang chủ</Link>
                </li>
                <li>
                  <Link to="/products">Sản phẩm</Link>
                </li>
                <li>
                  <Link to="/deals">Khuyến mãi</Link>
                </li>
                <li>
                  <Link to="/news">Tin tức</Link>
                </li>
                <li>
                  <Link to="/about">Về chúng tôi</Link>
                </li>
                <li>
                  <Link to="/contact">Liên hệ</Link>
                </li>
                <li>
                  <Link to="/careers">Tuyển dụng</Link>
                </li>
                <li>
                  <Link to="/store-locations">Hệ thống cửa hàng</Link>
                </li>
              </ul>
            </div>

            {/* Product Categories */}
            <div className="footer-column">
              <h4>Danh mục sản phẩm</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/category/iphone">iPhone</Link>
                </li>
                <li>
                  <Link to="/category/samsung">Samsung</Link>
                </li>
                <li>
                  <Link to="/category/xiaomi">Xiaomi</Link>
                </li>
                <li>
                  <Link to="/category/oppo">OPPO</Link>
                </li>
                <li>
                  <Link to="/category/vivo">Vivo</Link>
                </li>
                <li>
                  <Link to="/category/realme">Realme</Link>
                </li>
                <li>
                  <Link to="/accessories">Phụ kiện</Link>
                </li>
                <li>
                  <Link to="/tablets">Máy tính bảng</Link>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div className="footer-column">
              <h4>Hỗ trợ khách hàng</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/warranty">Chính sách bảo hành</Link>
                </li>
                <li>
                  <Link to="/shipping">Chính sách giao hàng</Link>
                </li>
                <li>
                  <Link to="/return-policy">Đổi trả - Hoàn tiền</Link>
                </li>
                <li>
                  <Link to="/privacy">Bảo mật thông tin</Link>
                </li>
                <li>
                  <Link to="/terms">Điều khoản sử dụng</Link>
                </li>
                <li>
                  <Link to="/payment-guide">Hướng dẫn thanh toán</Link>
                </li>
                <li>
                  <Link to="/size-guide">Hướng dẫn chọn size</Link>
                </li>
                <li>
                  <Link to="/faq">Câu hỏi thường gặp</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Certifications */}
      <div className="footer-trust">
        <div className="container">
          <div className="trust-content">
            <div className="payment-methods">
              <h5>Phương thức thanh toán</h5>
              <div className="payment-icons">
                <img src="/images/visa.png" alt="Visa" />
                <img src="/images/mastercard.png" alt="Mastercard" />
                <img src="/images/momo.png" alt="MoMo" />
                <img src="/images/vnpay.png" alt="VNPay" />
                <img src="/images/zalopay.png" alt="ZaloPay" />
              </div>
            </div>

            <div className="shipping-partners">
              <h5>Đối tác vận chuyển</h5>
              <div className="shipping-icons">
                <img src="/images/ghn.png" alt="Giao hàng nhanh" />
                <img src="/images/ghtk.png" alt="Giao hàng tiết kiệm" />
                <img src="/images/vnpost.png" alt="VNPost" />
                <img src="/images/j-t.png" alt="J&T Express" />
              </div>
            </div>

            <div className="certifications">
              <h5>Chứng nhận</h5>
              <div className="cert-icons">
                <img src="/images/dmca.png" alt="DMCA Protected" />
                <img src="/images/bct.png" alt="Bộ Công Thương" />
                <img src="/images/ssl.png" alt="SSL Secured" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="container">
          <div className="bottom-content">
            <div className="copyright">
              <p>© {currentYear} PhoneStore. Tất cả quyền được bảo lưu.</p>
              <p>
                Giấy CNĐKDN: 0123456789 do Sở KH&ĐT TP.Hà Nội cấp ngày 01/01/2020
              </p>
            </div>

            <div className="footer-policies">
              <Link to="/privacy">Chính sách bảo mật</Link>
              <Link to="/terms">Điều khoản dịch vụ</Link>
              <Link to="/cookies">Chính sách Cookie</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Lên đầu trang"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </footer>
  );
};

export default ModernFooter;
