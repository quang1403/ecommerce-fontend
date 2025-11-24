import React from "react";
import "./Support.css";

const Support = () => {
  return (
    <div className="support-page-container">
      <div className="support-hero">
        <i className="fas fa-tools support-hero-icon"></i>
        <h1>Dịch vụ sửa chữa điện thoại</h1>
        <p>
          Chúng tôi cung cấp dịch vụ sửa chữa, bảo trì và thay thế linh kiện cho
          các dòng điện thoại phổ biến với đội ngũ kỹ thuật viên chuyên nghiệp,
          linh kiện chính hãng, giá cả minh bạch.
        </p>
      </div>
      <div className="support-content">
        <h2>Các dịch vụ nổi bật</h2>
        <ul className="support-services-list">
          <li>
            <i className="fas fa-mobile-alt"></i> Thay màn hình, pin, camera,
            loa, mic
          </li>
          <li>
            <i className="fas fa-bug"></i> Sửa lỗi phần mềm, cập nhật hệ điều
            hành
          </li>
          <li>
            <i className="fas fa-shield-alt"></i> Vệ sinh, bảo trì, chống nước
          </li>
          <li>
            <i className="fas fa-sync-alt"></i> Khôi phục dữ liệu, backup
          </li>
        </ul>
        <h2>Quy trình tiếp nhận & sửa chữa</h2>
        <ol className="support-process-list">
          <li>Tiếp nhận yêu cầu và kiểm tra thiết bị</li>
          <li>Báo giá, xác nhận dịch vụ</li>
          <li>Tiến hành sửa chữa</li>
          <li>Bàn giao thiết bị, bảo hành dịch vụ</li>
        </ol>
        <div className="support-contact-box">
          <h3>Liên hệ tư vấn & đặt lịch sửa chữa</h3>
          <p>
            Hotline: <a href="tel:19001234">1900 1234</a>
          </p>
          <p>Hoặc đến trực tiếp các cửa hàng của chúng tôi trên toàn quốc.</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
