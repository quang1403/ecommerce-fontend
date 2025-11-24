import { useState } from "react";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
      }, 500);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Đăng ký nhận thông tin mới nhất</h2>
            <p>
              Nhận thông báo về sản phẩm mới, khuyến mãi và tin tức công nghệ
              hàng tuần
            </p>
          </div>

          <div className="newsletter-form">
            {!subscribed ? (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit">
                    Đăng ký
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            ) : (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <span>Cảm ơn bạn đã đăng ký!</span>
              </div>
            )}
          </div>
        </div>

        <div className="newsletter-benefits">
          <div className="benefit-item">
            <i className="fas fa-gift"></i>
            <span>Ưu đãi độc quyền</span>
          </div>
          <div className="benefit-item">
            <i className="fas fa-bell"></i>
            <span>Thông báo sản phẩm mới</span>
          </div>
          <div className="benefit-item">
            <i className="fas fa-newspaper"></i>
            <span>Tin tức công nghệ</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
