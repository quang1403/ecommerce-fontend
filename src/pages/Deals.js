import React from "react";
import "./Deals.css";

const Deals = () => {
  return (
    <div className="deals-container">
      <h1>Khuyến mãi nổi bật</h1>
      <div className="deals-list">
        <div className="deals-item">
          <h2>Giảm giá 20% cho iPhone 15 Pro</h2>
          <p>Áp dụng đến hết tháng 10/2025. Số lượng có hạn!</p>
        </div>
        <div className="deals-item">
          <h2>Mua Samsung Galaxy tặng tai nghe Bluetooth</h2>
          <p>Chương trình áp dụng cho Galaxy S24 và S24 Ultra.</p>
        </div>
        <div className="deals-item">
          <h2>Phụ kiện đồng giá 99.000đ</h2>
          <p>Áp dụng cho các sản phẩm sạc, cáp, ốp lưng.</p>
        </div>
      </div>
    </div>
  );
};

export default Deals;
