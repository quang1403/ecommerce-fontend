/**
 * Claim Management Form
 * Tạo và cập nhật claims
 */

import React, { useState, useEffect } from "react";
import {
  createClaim,
  updateClaim,
  getWarrantyDetail,
} from "../../../services/warrantyService";
import {
  formatIssueType,
  formatClaimStatus,
} from "../../../shared/utils/warranty";
import "../styles/ClaimForm.css";

const ClaimForm = ({ warrantyId, claimId, onBack, onSuccess }) => {
  const id = warrantyId;
  const isEdit = !!claimId;

  const [warranty, setWarranty] = useState(null);
  const [formData, setFormData] = useState({
    issueType: "",
    issueDescription: "",
    serviceProvider: "",
    cost: 0,
    status: "pending",
    resolutionNote: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchWarranty();
  }, [id]);

  const fetchWarranty = async () => {
    try {
      const data = await getWarrantyDetail(id);
      setWarranty(data);

      // If editing, populate form
      if (isEdit && data.claims) {
        const claim = data.claims.find((c) => c._id === claimId);
        if (claim) {
          setFormData({
            issueType: claim.issueType || "",
            issueDescription: claim.issueDescription || "",
            serviceProvider: claim.serviceProvider || "",
            cost: claim.cost || 0,
            status: claim.status || "pending",
            resolutionNote: claim.resolutionNote || "",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching warranty:", err);
      alert("Không thể tải thông tin bảo hành");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.issueType) {
      newErrors.issueType = "Vui lòng chọn loại lỗi";
    }

    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = "Vui lòng mô tả chi tiết vấn đề";
    }

    if (
      isEdit &&
      formData.status === "resolved" &&
      !formData.resolutionNote.trim()
    ) {
      newErrors.resolutionNote = "Vui lòng nhập ghi chú giải quyết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      setLoading(true);

      const data = {
        issueType: formData.issueType,
        issueDescription: formData.issueDescription.trim(),
        serviceProvider: formData.serviceProvider.trim() || undefined,
        cost: parseInt(formData.cost) || 0,
      };

      if (isEdit) {
        // Update claim
        const updateData = {
          ...data,
          status: formData.status,
          resolutionNote: formData.resolutionNote.trim() || undefined,
        };
        await updateClaim(id, claimId, updateData);
        alert("✅ Cập nhật claim thành công!");
      } else {
        // Create new claim
        await createClaim(id, data);
        alert("✅ Tạo claim thành công!");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving claim:", error);
      alert("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-form-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <i className="fas fa-tools"></i>{" "}
            {isEdit ? "Cập nhật Claim" : "Tạo Claim mới"}
          </h1>
          {warranty && (
            <p className="warranty-info">
              Bảo hành: <strong>{warranty.warrantyCode}</strong> -{" "}
              {warranty.productName}
            </p>
          )}
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="claim-form">
        <div className="form-section">
          <h3>
            <i className="fas fa-exclamation-circle"></i> Thông tin vấn đề
          </h3>

          <div className="form-group">
            <label>
              Loại lỗi <span className="required">*</span>
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className={errors.issueType ? "error" : ""}
              required
            >
              <option value="">-- Chọn loại lỗi --</option>
              <option value="screen">🖥️ Màn hình</option>
              <option value="battery">🔋 Pin</option>
              <option value="camera">📷 Camera</option>
              <option value="speaker">🔊 Loa</option>
              <option value="button">🎮 Nút bấm</option>
              <option value="charging">⚡ Sạc</option>
              <option value="software">💻 Phần mềm</option>
              <option value="water_damage">💧 Vào nước</option>
              <option value="other">❓ Khác</option>
            </select>
            {errors.issueType && (
              <span className="error-message">{errors.issueType}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              Mô tả chi tiết <span className="required">*</span>
            </label>
            <textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleChange}
              placeholder="Mô tả chi tiết vấn đề gặp phải..."
              rows="5"
              className={errors.issueDescription ? "error" : ""}
              required
            />
            {errors.issueDescription && (
              <span className="error-message">{errors.issueDescription}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>
            <i className="fas fa-wrench"></i> Thông tin xử lý
          </h3>

          <div className="form-group">
            <label>Trung tâm bảo hành / Nơi sửa chữa</label>
            <input
              type="text"
              name="serviceProvider"
              value={formData.serviceProvider}
              onChange={handleChange}
              placeholder="VD: Trung tâm bảo hành Apple, Cửa hàng..."
            />
          </div>

          <div className="form-group">
            <label>Chi phí (nếu có)</label>
            <div className="input-with-unit">
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min="0"
                step="1000"
                placeholder="0"
              />
              <span className="unit">₫</span>
            </div>
            <small className="helper-text">
              Nhập 0 nếu sửa chữa miễn phí theo bảo hành
            </small>
          </div>

          {isEdit && (
            <>
              <div className="form-group">
                <label>
                  Trạng thái <span className="required">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">⏳ Đang chờ</option>
                  <option value="in_progress">🔧 Đang xử lý</option>
                  <option value="resolved">✅ Đã giải quyết</option>
                  <option value="rejected">❌ Từ chối</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Ghi chú giải quyết
                  {formData.status === "resolved" && (
                    <span className="required">*</span>
                  )}
                </label>
                <textarea
                  name="resolutionNote"
                  value={formData.resolutionNote}
                  onChange={handleChange}
                  placeholder="Ghi chú về cách giải quyết, kết quả..."
                  rows="4"
                  className={errors.resolutionNote ? "error" : ""}
                  required={formData.status === "resolved"}
                />
                {errors.resolutionNote && (
                  <span className="error-message">{errors.resolutionNote}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            <i className="fas fa-times"></i> Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>{" "}
                {isEdit ? "Cập nhật" : "Tạo claim"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimForm;
