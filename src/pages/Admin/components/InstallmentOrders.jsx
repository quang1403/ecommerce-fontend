import React, { useState, useEffect } from "react";
import {
  getInstallmentOrdersAdmin,
  updateInstallmentStatus,
} from "../../../services/Api";
import "../styles/InstallmentOrders.css";

const InstallmentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [imageZoomLevel, setImageZoomLevel] = useState(1);

  // Helper function để tạo full URL cho ảnh
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  const handleImageZoom = (imageUrl, imageName) => {
    setZoomedImage({ url: imageUrl, name: imageName });
    setImageZoomLevel(1);
  };

  const handleZoomIn = () => {
    setImageZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
    setImageZoomLevel(1);
  };

  useEffect(() => {
    fetchInstallmentOrders();
  }, [filterStatus]);

  const fetchInstallmentOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const statusParam = filterStatus === "all" ? "" : filterStatus;
      const res = await getInstallmentOrdersAdmin(statusParam);
      setOrders(res.data.orders || []);
    } catch (err) {
      setError("Lỗi tải danh sách đơn trả góp");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, financeStatus) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn ${
          financeStatus === "approved" ? "DUYỆT" : "TỪ CHỐI"
        } hồ sơ này?`
      )
    ) {
      return;
    }

    try {
      await updateInstallmentStatus(orderId, financeStatus);
      alert(
        `${
          financeStatus === "approved" ? "Duyệt" : "Từ chối"
        } hồ sơ thành công!`
      );
      fetchInstallmentOrders();
      setShowDetailModal(false);
    } catch (err) {
      alert("Lỗi cập nhật trạng thái: " + err.response?.data?.error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  if (loading) {
    return <div className="installment-loading">Đang tải...</div>;
  }

  return (
    <div className="installment-orders-container">
      <div className="installment-orders-header">
        <h2>Quản lý đơn hàng trả góp</h2>
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="installment-orders-table">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Hình thức</th>
              <th>Số tiền/tháng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Không có đơn hàng trả góp nào
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                // Lấy thông tin khách hàng từ các nguồn khác nhau
                const customerName =
                  order.user?.fullName ||
                  order.user?.name ||
                  order.customerId?.fullName ||
                  order.customerId?.name ||
                  order.customer?.fullName ||
                  order.customer?.name ||
                  "N/A";

                const customerEmail =
                  order.user?.email ||
                  order.customerId?.email ||
                  order.customer?.email ||
                  "";

                return (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>
                      {customerName}
                      <br />
                      <small>{customerEmail}</small>
                    </td>
                    <td>
                      {order.installment?.type === "creditCard"
                        ? "💳 Thẻ tín dụng"
                        : "🏦 Công ty tài chính"}
                    </td>
                    <td>{formatCurrency(order.installment?.monthlyPayment)}</td>
                    <td>{formatCurrency(order.total)}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.installment?.financeStatus
                        )}`}
                      >
                        {getStatusLabel(order.installment?.financeStatus)}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => openDetailModal(order)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showDetailModal && selectedOrder && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Chi tiết đơn hàng trả góp</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {/* Thông tin đơn hàng */}
              <section className="detail-section">
                <h4>Thông tin đơn hàng</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Mã đơn:</strong> {selectedOrder._id}
                  </div>
                  <div className="info-item">
                    <strong>Ngày tạo:</strong>{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </div>
                  <div className="info-item">
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      className={`status-badge ${getStatusClass(
                        selectedOrder.installment?.financeStatus
                      )}`}
                    >
                      {getStatusLabel(selectedOrder.installment?.financeStatus)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Thông tin trả góp */}
              <section className="detail-section">
                <h4>Thông tin trả góp</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>Hình thức:</strong>{" "}
                    {selectedOrder.installment?.type === "creditCard"
                      ? "Thẻ tín dụng"
                      : "Công ty tài chính"}
                  </div>
                  <div className="info-item">
                    <strong>Trả trước:</strong>{" "}
                    {formatCurrency(selectedOrder.installment?.upfront)}
                  </div>
                  <div className="info-item">
                    <strong>Số tháng:</strong>{" "}
                    {selectedOrder.installment?.months} tháng
                  </div>
                  <div className="info-item">
                    <strong>Lãi suất:</strong>{" "}
                    {selectedOrder.installment?.interestRate}%/tháng
                  </div>
                  <div className="info-item">
                    <strong>Trả hàng tháng:</strong>{" "}
                    {formatCurrency(selectedOrder.installment?.monthlyPayment)}
                  </div>
                  <div className="info-item">
                    <strong>Tổng phải trả:</strong>{" "}
                    {formatCurrency(selectedOrder.installment?.totalPayment)}
                  </div>
                  {selectedOrder.installment?.transactionId && (
                    <div className="info-item">
                      <strong>Mã giao dịch:</strong>{" "}
                      {selectedOrder.installment?.transactionId}
                    </div>
                  )}
                </div>
              </section>

              {/* Thông tin khách hàng */}
              <section className="detail-section">
                <h4>Thông tin khách hàng</h4>
                <div className="info-grid">
                  {selectedOrder.installment?.type === "creditCard" ? (
                    <>
                      <div className="info-item">
                        <strong>Chủ thẻ:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.cardHolder}
                      </div>
                      <div className="info-item">
                        <strong>Số thẻ:</strong> ****{" "}
                        {selectedOrder.installment?.customerInfo?.cardNumber?.slice(
                          -4
                        )}
                      </div>
                      <div className="info-item">
                        <strong>Ngân hàng:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.bank}
                      </div>
                      <div className="info-item">
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.address}
                      </div>
                      <div className="info-item">
                        <strong>SĐT:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.phone}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-item">
                        <strong>Họ tên:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.fullName}
                      </div>
                      <div className="info-item">
                        <strong>CMND/CCCD:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.idNumber}
                      </div>
                      <div className="info-item">
                        <strong>SĐT:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.phone}
                      </div>
                      <div className="info-item">
                        <strong>Email:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.email}
                      </div>
                      <div className="info-item">
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.installment?.customerInfo?.address}
                      </div>
                      <div className="info-item">
                        <strong>Thu nhập/tháng:</strong>{" "}
                        {formatCurrency(
                          selectedOrder.installment?.customerInfo?.monthlyIncome
                        )}
                      </div>
                      <div className="info-item">
                        <strong>SĐT người thân 1:</strong>{" "}
                        {
                          selectedOrder.installment?.customerInfo
                            ?.relativePhone1
                        }
                      </div>
                      <div className="info-item">
                        <strong>SĐT người thân 2:</strong>{" "}
                        {
                          selectedOrder.installment?.customerInfo
                            ?.relativePhone2
                        }
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Giấy tờ upload (cho công ty tài chính) */}
              {selectedOrder.installment?.type === "financeCompany" &&
                selectedOrder.installment?.uploadedDocuments && (
                  <section className="detail-section">
                    <h4>Giấy tờ đã upload</h4>
                    <div className="documents-grid">
                      {selectedOrder.installment.uploadedDocuments
                        .idCardFront && (
                        <div className="document-card">
                          <div className="document-label">
                            📄 CMND/CCCD (Mặt trước)
                          </div>
                          <div className="document-preview">
                            <img
                              src={getImageUrl(
                                selectedOrder.installment.uploadedDocuments
                                  .idCardFront
                              )}
                              alt="CMND/CCCD Mặt trước"
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .idCardFront
                                  ),
                                  "CMND/CCCD (Mặt trước)"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="document-actions">
                            <button
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .idCardFront
                                  ),
                                  "CMND/CCCD (Mặt trước)"
                                )
                              }
                              className="btn-view-doc"
                            >
                              🔍 Xem ảnh
                            </button>
                          </div>
                        </div>
                      )}
                      {selectedOrder.installment.uploadedDocuments
                        .idCardBack && (
                        <div className="document-card">
                          <div className="document-label">
                            📄 CMND/CCCD (Mặt sau)
                          </div>
                          <div className="document-preview">
                            <img
                              src={getImageUrl(
                                selectedOrder.installment.uploadedDocuments
                                  .idCardBack
                              )}
                              alt="CMND/CCCD Mặt sau"
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .idCardBack
                                  ),
                                  "CMND/CCCD (Mặt sau)"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="document-actions">
                            <button
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .idCardBack
                                  ),
                                  "CMND/CCCD (Mặt sau)"
                                )
                              }
                              className="btn-view-doc"
                            >
                              🔍 Xem ảnh
                            </button>
                          </div>
                        </div>
                      )}
                      {selectedOrder.installment.uploadedDocuments
                        .householdBook && (
                        <div className="document-card">
                          <div className="document-label">📄 Sổ hộ khẩu</div>
                          <div className="document-preview">
                            <img
                              src={getImageUrl(
                                selectedOrder.installment.uploadedDocuments
                                  .householdBook
                              )}
                              alt="Sổ hộ khẩu"
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .householdBook
                                  ),
                                  "Sổ hộ khẩu"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="document-actions">
                            <button
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .householdBook
                                  ),
                                  "Sổ hộ khẩu"
                                )
                              }
                              className="btn-view-doc"
                            >
                              🔍 Xem ảnh
                            </button>
                          </div>
                        </div>
                      )}
                      {selectedOrder.installment.uploadedDocuments
                        .incomeProof && (
                        <div className="document-card">
                          <div className="document-label">
                            📄 Giấy tờ thu nhập
                          </div>
                          <div className="document-preview">
                            <img
                              src={getImageUrl(
                                selectedOrder.installment.uploadedDocuments
                                  .incomeProof
                              )}
                              alt="Giấy tờ thu nhập"
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .incomeProof
                                  ),
                                  "Giấy tờ thu nhập"
                                )
                              }
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <div className="document-actions">
                            <button
                              onClick={() =>
                                handleImageZoom(
                                  getImageUrl(
                                    selectedOrder.installment.uploadedDocuments
                                      .incomeProof
                                  ),
                                  "Giấy tờ thu nhập"
                                )
                              }
                              className="btn-view-doc"
                            >
                              🔍 Xem ảnh
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

              {/* Sản phẩm */}
              <section className="detail-section">
                <h4>Sản phẩm</h4>
                <div className="products-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="product-item">
                      <div>
                        <strong>{item.productId?.name || "N/A"}</strong>
                        <br />
                        <small>
                          Số lượng: {item.quantity} - Giá:{" "}
                          {formatCurrency(item.price)}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="modal-footer">
              {selectedOrder.installment?.financeStatus === "pending" && (
                <>
                  <button
                    className="btn-reject"
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, "rejected")
                    }
                  >
                    Từ chối
                  </button>
                  <button
                    className="btn-approve"
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, "approved")
                    }
                  >
                    Duyệt hồ sơ
                  </button>
                </>
              )}
              {selectedOrder.installment?.financeStatus !== "pending" && (
                <button
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="image-zoom-modal" onClick={handleCloseZoom}>
          <div
            className="zoom-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="zoom-header">
              <h3>{zoomedImage.name}</h3>
              <button className="zoom-close-btn" onClick={handleCloseZoom}>
                ✕
              </button>
            </div>
            <div className="zoom-controls">
              <button onClick={handleZoomOut} className="zoom-btn">
                ➖ Thu nhỏ
              </button>
              <span className="zoom-level">
                {Math.round(imageZoomLevel * 100)}%
              </span>
              <button onClick={handleZoomIn} className="zoom-btn">
                ➕ Phóng to
              </button>
            </div>
            <div className="zoom-image-container">
              <img
                src={zoomedImage.url}
                alt={zoomedImage.name}
                style={{ transform: `scale(${imageZoomLevel})` }}
                className="zoomed-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentOrders;
