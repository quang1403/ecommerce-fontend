import React from "react";
import "./News.css";

const News = () => {
  return (
    <div className="news-container">
      <h1>Tin tức công nghệ</h1>
      <div className="news-list">
        <div className="news-item">
          <h2>iPhone 16 ra mắt với nhiều cải tiến vượt trội</h2>
          <p>
            Apple vừa công bố iPhone 16 với camera AI, pin lâu hơn và thiết kế
            mới.
          </p>
        </div>
        <div className="news-item">
          <h2>Samsung Galaxy Tab S9 chính thức lên kệ</h2>
          <p>
            Máy tính bảng cao cấp của Samsung đã có mặt tại Việt Nam với nhiều
            ưu đãi.
          </p>
        </div>
        <div className="news-item">
          <h2>Xiaomi ra mắt dòng phụ kiện thông minh</h2>
          <p>
            Bộ sưu tập phụ kiện mới của Xiaomi hỗ trợ kết nối IoT và sạc nhanh.
          </p>
        </div>
      </div>
    </div>
  );
};

export default News;
