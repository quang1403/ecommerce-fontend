import React, { useState, useEffect } from "react";
import { getWarrantyLookup } from "../../services/Api";
import "./warranty.css";

const Warranty = () => {
  const [warrantyItems, setWarrantyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWarrantyData();
  }, []);

  const fetchWarrantyData = async () => {
    try {
      setLoading(true);
      const response = await getWarrantyLookup();

      if (response.data.success) {
        // Filter only products from completed orders (status = 3)
        const completedOrderItems = response.data.data || [];
        setWarrantyItems(completedOrderItems);
      } else {
        setError("Không thể tải dữ liệu bảo hành");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu bảo hành");
      console.error("Error fetching warranty data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    return status === "Còn hạn" ? "valid" : "expired";
  };

  const calculateDaysRemaining = (expiredDate) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="warranty-container">
        <div className="warranty-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin bảo hành...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="warranty-container">
        <div className="warranty-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={fetchWarrantyData} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="warranty-container">
      <div className="warranty-header">
        <h1>
          <i className="fas fa-shield-alt"></i>
          Tra cứu bảo hành
        </h1>
        <p>Thông tin bảo hành các sản phẩm từ đơn hàng đã giao thành công</p>
      </div>

      {warrantyItems.length === 0 ? (
        <div className="warranty-empty">
          <i className="fas fa-box-open"></i>
          <h3>Chưa có sản phẩm bảo hành</h3>
          <p>
            Chỉ những sản phẩm từ đơn hàng đã giao thành công mới được bảo hành.
          </p>
          <p>Vui lòng kiểm tra lại đơn hàng của bạn.</p>
        </div>
      ) : (
        <div className="warranty-list">
          {warrantyItems.map((item, index) => {
            const daysRemaining = calculateDaysRemaining(item.expiredDate);

            return (
              <div key={index} className="warranty-item">
                <div className="warranty-product">
                  <div className="product-info">
                    <h3>{item.productName}</h3>
                    <p className="order-id">Đơn hàng: #{item.orderId}</p>
                    <p className="order-status">✅ Đã giao thành công</p>
                  </div>
                  <div
                    className={`warranty-status ${getStatusColor(item.status)}`}
                  >
                    <i
                      className={`fas ${
                        item.status === "Còn hạn"
                          ? "fa-check-circle"
                          : "fa-times-circle"
                      }`}
                    ></i>
                    <span>{item.status}</span>
                  </div>
                </div>

                <div className="warranty-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <div>
                        <label>Ngày mua</label>
                        <span>{formatDate(item.purchaseDate)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <div>
                        <label>Thời gian bảo hành</label>
                        <span>{item.warrantyMonths} tháng</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <i className="fas fa-calendar-times"></i>
                      <div>
                        <label>Ngày hết hạn</label>
                        <span>{formatDate(item.expiredDate)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-hourglass-half"></i>
                      <div>
                        <label>Thời gian còn lại</label>
                        <span
                          className={
                            daysRemaining > 30
                              ? "remaining-long"
                              : daysRemaining > 0
                              ? "remaining-short"
                              : "expired"
                          }
                        >
                          {daysRemaining > 0
                            ? `${daysRemaining} ngày`
                            : "Đã hết hạn"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {item.status === "Còn hạn" &&
                  daysRemaining <= 30 &&
                  daysRemaining > 0 && (
                    <div className="warranty-warning">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>
                        Bảo hành sắp hết hạn trong {daysRemaining} ngày
                      </span>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}

      <div className="warranty-footer">
        <div className="warranty-note">
          <h4>Điều kiện bảo hành:</h4>
          <ul>
            <li>Chỉ áp dụng cho sản phẩm từ đơn hàng đã giao thành công</li>
            <li>Bảo hành chỉ áp dụng cho các lỗi do nhà sản xuất</li>
            <li>Sản phẩm phải còn nguyên tem bảo hành</li>
            <li>Không bảo hành cho các lỗi do người dùng gây ra</li>
            <li>Sản phẩm không được bảo hành nếu có dấu hiệu tháo lắp</li>
            <li>Liên hệ hotline: 1900-xxxx để được hỗ trợ bảo hành</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Warranty;
