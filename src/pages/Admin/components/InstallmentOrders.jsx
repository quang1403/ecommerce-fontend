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
    console.log("Selected order data:", order);
    console.log("Customer info:", order.installment?.customerInfo);
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
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8)}</td>
                  <td>
                    {order.customerId?.name || "N/A"}
                    <br />
                    <small>{order.customerId?.email || ""}</small>
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
              ))
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
                    <div className="documents-list">
                      {selectedOrder.installment.uploadedDocuments
                        .idCardFront && (
                        <div className="document-item">
                          <span className="document-icon">📄</span>
                          <span className="document-name">
                            CMND/CCCD (Mặt trước):{" "}
                            {
                              selectedOrder.installment.uploadedDocuments
                                .idCardFront
                            }
                          </span>
                        </div>
                      )}
                      {selectedOrder.installment.uploadedDocuments
                        .idCardBack && (
                        <div className="document-item">
                          <span className="document-icon">📄</span>
                          <span className="document-name">
                            CMND/CCCD (Mặt sau):{" "}
                            {
                              selectedOrder.installment.uploadedDocuments
                                .idCardBack
                            }
                          </span>
                        </div>
                      )}
                      {selectedOrder.installment.uploadedDocuments
                        .householdBook && (
                        <div className="document-item">
                          <span className="document-icon">📄</span>
                          <span className="document-name">
                            Sổ hộ khẩu:{" "}
                            {
                              selectedOrder.installment.uploadedDocuments
                                .householdBook
                            }
                          </span>
                        </div>
                      )}
                      {selectedOrder.installment.uploadedDocuments
                        .incomeProof && (
                        <div className="document-item">
                          <span className="document-icon">📄</span>
                          <span className="document-name">
                            Giấy tờ thu nhập:{" "}
                            {
                              selectedOrder.installment.uploadedDocuments
                                .incomeProof
                            }
                          </span>
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
    </div>
  );
};

export default InstallmentOrders;
