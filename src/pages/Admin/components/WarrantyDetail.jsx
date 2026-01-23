/**
 * Warranty Detail Page
 * Chi tiết bảo hành và quản lý claims
 */

import React, { useState, useEffect } from "react";
import {
  getWarrantyDetail,
  deleteWarranty,
} from "../../../services/warrantyService";
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatWarrantyStatus,
  formatClaimStatus,
  formatIssueType,
  calculateDaysRemaining,
  printWarrantyCard,
} from "../../../shared/utils/warranty";
import "../styles/WarrantyDetail.css";

const WarrantyDetail = ({ warrantyId, onBack, onCreateClaim, onDelete }) => {
  const id = warrantyId;

  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWarranty();
  }, [id]);

  const fetchWarranty = async () => {
    try {
      setLoading(true);
      const data = await getWarrantyDetail(id);
      setWarranty(data);
      setError("");
    } catch (err) {
      console.error("Error fetching warranty:", err);
      setError(err.message || "Không thể tải thông tin bảo hành");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // Kiểm tra warranty có claims không
    if (warranty.claims && warranty.claims.length > 0) {
      alert(
        "Không thể xóa bảo hành đã có lịch sử claims. Hãy dùng chức năng Void thay thế.",
      );
      return;
    }

    if (!window.confirm(`Xác nhận xóa bảo hành ${warranty.warrantyCode}?`)) {
      return;
    }

    try {
      await deleteWarranty(id);
      alert("Đã xóa bảo hành thành công!");
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handlePrint = () => {
    if (warranty) {
      printWarrantyCard(warranty);
    }
  };

  if (loading) {
    return (
      <div className="warranty-detail">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !warranty) {
    return (
      <div className="warranty-detail">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>{error || "Không tìm thấy bảo hành"}</h2>
          <button className="btn btn-primary" onClick={onBack}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(warranty.endDate);
  const statusInfo = formatWarrantyStatus(warranty.status, daysRemaining);

  return (
    <div className="warranty-detail">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <i className="fas fa-shield-alt"></i> Chi tiết bảo hành
          </h1>
          <p className="warranty-code-display">
            {typeof warranty.warrantyCode === "string"
              ? warranty.warrantyCode
              : String(warranty.warrantyCode || "N/A")}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-print" onClick={handlePrint}>
            <i className="fas fa-print"></i> In phiếu
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onCreateClaim && onCreateClaim(id)}
          >
            <i className="fas fa-plus"></i> Tạo claim
          </button>
          <button className="btn btn-add-slider btn-secondary" onClick={onBack}>
            <i className="fas fa-times"></i> Quay lại
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`status-banner status-${warranty.status}`}
        style={{ borderLeftColor: statusInfo.color }}
      >
        <div className="status-info">
          <i className={`fas fa-${statusInfo.icon}`}></i>
          <div>
            <h3>{statusInfo.label}</h3>
            {warranty.status === "active" && (
              <p>
                Còn lại {daysRemaining} ngày • Hết hạn vào{" "}
                {formatDate(warranty.endDate)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* Thông tin sản phẩm */}
        <div className="detail-card">
          <h3>
            <i className="fas fa-mobile-alt"></i> Thông tin sản phẩm
          </h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Sản phẩm:</span>
              <span className="value">
                {typeof warranty.productName === "string"
                  ? warranty.productName
                  : warranty.productName?.name ||
                    warranty.product?.name ||
                    "N/A"}
              </span>
            </div>
            {warranty.color && (
              <div className="info-item">
                <span className="label">Màu sắc:</span>
                <span className="value">
                  {typeof warranty.color === "string"
                    ? warranty.color
                    : String(warranty.color || "")}
                </span>
              </div>
            )}
            {(warranty.ram || warranty.storage) && (
              <div className="info-item">
                <span className="label">Cấu hình:</span>
                <span className="value">
                  {typeof warranty.ram === "string"
                    ? warranty.ram
                    : String(warranty.ram || "")}{" "}
                  {typeof warranty.storage === "string"
                    ? warranty.storage
                    : String(warranty.storage || "")}
                </span>
              </div>
            )}
            {warranty.imei && (
              <div className="info-item">
                <span className="label">IMEI:</span>
                <span className="value">
                  <code className="imei">
                    {typeof warranty.imei === "string"
                      ? warranty.imei
                      : String(warranty.imei || "N/A")}
                  </code>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="detail-card">
          <h3>
            <i className="fas fa-user"></i> Thông tin khách hàng
          </h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">
                {warranty.customerId?.phone || warranty.customerPhone || "N/A"}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">
                {warranty.customerId?.email || warranty.customerEmail || "N/A"}
              </span>
            </div>
            {(warranty.customerId?.address || warranty.customerAddress) && (
              <div className="info-item">
                <span className="label">Địa chỉ:</span>
                <span className="value">
                  {warranty.customerId?.address || warranty.customerAddress}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin bảo hành */}
        <div className="detail-card">
          <h3>
            <i className="fas fa-calendar-alt"></i> Thông tin bảo hành
          </h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Ngày mua:</span>
              <span className="value">
                {formatDate(warranty.purchaseDate || warranty.startDate)}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Ngày bắt đầu:</span>
              <span className="value">{formatDate(warranty.startDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Ngày hết hạn:</span>
              <span className="value">{formatDate(warranty.endDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Thời gian:</span>
              <span className="value">{warranty.warrantyMonths} tháng</span>
            </div>
            {warranty.notes && (
              <div className="info-item full-width">
                <span className="label">Ghi chú:</span>
                <span className="value">
                  {typeof warranty.notes === "string"
                    ? warranty.notes
                    : String(warranty.notes || "")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="detail-card">
          <h3>
            <i className="fas fa-info-circle"></i> Thông tin khác
          </h3>
          <div className="info-list">
            {warranty.orderId && (
              <>
                <div className="info-item">
                  <span className="label">Đơn hàng:</span>
                  <span className="value">
                    <code>
                      {typeof warranty.orderId === "string"
                        ? warranty.orderId
                        : warranty.orderId?._id || "N/A"}
                    </code>
                  </span>
                </div>
                {typeof warranty.orderId === "object" &&
                  warranty.orderId?.total && (
                    <div className="info-item">
                      <span className="label">Giá trị đơn hàng:</span>
                      <span className="value">
                        {formatCurrency(warranty.orderId.total)}
                      </span>
                    </div>
                  )}
              </>
            )}
            <div className="info-item">
              <span className="label">Tạo lúc:</span>
              <span className="value">
                {formatDateTime(warranty.createdAt)}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Cập nhật:</span>
              <span className="value">
                {formatDateTime(warranty.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Section */}
      <div className="claims-section">
        <div className="section-header">
          <h2>
            <i className="fas fa-tools"></i> Lịch sử Claims (
            {warranty.claims?.length || 0})
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => onCreateClaim && onCreateClaim(id)}
          >
            <i className="fas fa-plus"></i> Tạo claim mới
          </button>
        </div>

        {!warranty.claims || warranty.claims.length === 0 ? (
          <div className="empty-claims">
            <i className="fas fa-clipboard-list"></i>
            <p>Chưa có yêu cầu bảo hành nào</p>
          </div>
        ) : (
          <div className="claims-list">
            {warranty.claims.map((claim, index) => {
              const claimStatusInfo = formatClaimStatus(claim.status);
              return (
                <div key={claim._id || index} className="claim-card">
                  <div className="claim-header">
                    <div className="claim-title">
                      <h4>{formatIssueType(claim.issueType)}</h4>
                      <span
                        className="claim-status"
                        style={{ color: claimStatusInfo.color }}
                      >
                        {claimStatusInfo.label}
                      </span>
                    </div>
                    <div className="claim-date">
                      {formatDateTime(claim.createdAt)}
                    </div>
                  </div>

                  <div className="claim-body">
                    <p className="claim-description">
                      {claim.issueDescription}
                    </p>

                    {claim.serviceProvider && (
                      <div className="claim-info">
                        <strong>Trung tâm:</strong> {claim.serviceProvider}
                      </div>
                    )}

                    {claim.cost !== undefined && claim.cost !== null && (
                      <div className="claim-info">
                        <strong>Chi phí:</strong>{" "}
                        {claim.cost > 0
                          ? formatCurrency(claim.cost)
                          : "Miễn phí"}
                      </div>
                    )}

                    {claim.resolutionNote && (
                      <div className="claim-resolution">
                        <strong>Giải quyết:</strong> {claim.resolutionNote}
                      </div>
                    )}

                    {claim.resolvedAt && (
                      <div className="claim-info">
                        <strong>Hoàn thành:</strong>{" "}
                        {formatDateTime(claim.resolvedAt)}
                      </div>
                    )}
                  </div>

                  <div className="claim-actions">
                    <button
                      className="btn-small btn-edit"
                      onClick={() =>
                        onCreateClaim && onCreateClaim(id, claim._id)
                      }
                    >
                      <i className="fas fa-edit"></i> Cập nhật
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="danger-zone">
        <h3>
          <i className="fas fa-exclamation-triangle"></i> Vùng nguy hiểm
        </h3>
        <p>Xóa bảo hành này vĩnh viễn. Hành động này không thể hoàn tác.</p>
        <button className="btn btn-danger" onClick={handleDelete}>
          <i className="fas fa-trash"></i> Xóa bảo hành
        </button>
      </div>
    </div>
  );
};

export default WarrantyDetail;
