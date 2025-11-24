import React, { useState, useEffect } from "react";
import "./AddressModal.css";

const AddressModal = ({
  isOpen,
  onClose,
  onSave,
  editingAddress = null,
  title = "Thêm địa chỉ mới",
}) => {
  const [formData, setFormData] = useState({
    label: "Nhà riêng",
    address: "",
    phone: "",
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        label: editingAddress.label || "Nhà riêng",
        address: editingAddress.address || "",
        phone: editingAddress.phone || "",
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      setFormData({
        label: "Nhà riêng",
        address: "",
        phone: "",
        isDefault: false,
      });
    }
    setErrors({});
  }, [editingAddress, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div
        className="address-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="address-modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nhãn địa chỉ</label>
            <select
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="Nhà riêng">Nhà riêng</option>
              <option value="Công ty">Công ty</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>Địa chỉ chi tiết *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              className={`form-input ${errors.address ? "error" : ""}`}
              rows="3"
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại nhận hàng"
              className={`form-input ${errors.phone ? "error" : ""}`}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              {editingAddress ? "Cập nhật" : "Thêm địa chỉ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
