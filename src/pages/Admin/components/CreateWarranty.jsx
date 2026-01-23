/**
 * Create New Warranty Form
 * Form tạo bảo hành thủ công cho admin
 */

import React, { useState } from "react";
import { createWarranty, searchUser } from "../../../services/warrantyService";
import {
  validatePhone,
  validateIMEI,
  validateEmail,
  printWarrantyCard,
} from "../../../shared/utils/warranty";
import "../styles/CreateWarranty.css";

const CreateWarranty = ({ onBack, onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    // Khách hàng
    customerPhone: "",
    customerName: "",
    customerEmail: "",

    // Sản phẩm
    serviceType: "",
    productName: "",
    color: "",
    ram: "",
    storage: "",
    imei: "",

    // Bảo hành
    warrantyMonths: 12,
    customMonths: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [customerFound, setCustomerFound] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [errors, setErrors] = useState({});

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleServiceTypeChange = (e) => {
    const serviceType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      serviceType,
      productName: getProductNameFromServiceType(serviceType),
      warrantyMonths: getDefaultWarrantyMonths(serviceType),
    }));
  };

  const getProductNameFromServiceType = (type) => {
    const names = {
      new_phone: "",
      screen_replacement: "Thay màn hình",
      battery_replacement: "Thay pin",
      camera_repair: "Sửa camera",
      speaker_repair: "Sửa loa",
      button_repair: "Sửa nút bấm",
      other: "",
    };
    return names[type] || "";
  };

  const getDefaultWarrantyMonths = (type) => {
    if (type === "new_phone") return 12;
    if (
      ["screen_replacement", "battery_replacement", "camera_repair"].includes(
        type,
      )
    )
      return 6;
    return 3;
  };

  const handleLookupCustomer = async () => {
    const phone = formData.customerPhone.trim();

    if (!phone) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    if (!validatePhone(phone)) {
      setErrors((prev) => ({
        ...prev,
        customerPhone: "Số điện thoại không hợp lệ",
      }));
      return;
    }

    try {
      setSearchingCustomer(true);
      const result = await searchUser(phone);

      if (result.success && result.data) {
        setCustomerFound(result.data);
        setFormData((prev) => ({
          ...prev,
          customerName: result.data.name || "",
          customerEmail: result.data.email || "",
        }));
      } else {
        setCustomerFound(null);
        alert("ℹ️ Chưa tìm thấy khách hàng. Vui lòng nhập thông tin thủ công.");
      }
    } catch (error) {
      console.error("Error searching customer:", error);
      setCustomerFound(null);
      alert("ℹ️ Chưa tìm thấy khách hàng. Vui lòng nhập thông tin thủ công.");
    } finally {
      setSearchingCustomer(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate phone
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Số điện thoại là bắt buộc";
    } else if (!validatePhone(formData.customerPhone)) {
      newErrors.customerPhone = "Số điện thoại không hợp lệ";
    }

    // Validate name (optional but recommended)
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Tên khách hàng là bắt buộc";
    }

    // Validate email (optional)
    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = "Email không hợp lệ";
    }

    // Validate product name
    if (!formData.productName.trim()) {
      newErrors.productName = "Tên sản phẩm là bắt buộc";
    }

    // Validate IMEI (optional)
    if (formData.imei && !validateIMEI(formData.imei)) {
      newErrors.imei = "IMEI phải là 15 chữ số";
    }

    // Validate warranty months
    const months =
      formData.warrantyMonths === "custom"
        ? parseInt(formData.customMonths)
        : parseInt(formData.warrantyMonths);

    if (!months || months < 1 || months > 60) {
      newErrors.warrantyMonths = "Thời gian bảo hành phải từ 1-60 tháng";
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

      const warrantyMonths =
        formData.warrantyMonths === "custom"
          ? parseInt(formData.customMonths)
          : parseInt(formData.warrantyMonths);

      const data = {
        customerPhone: formData.customerPhone.trim(),
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        productName: formData.productName.trim(),
        color: formData.color.trim() || undefined,
        ram: formData.ram.trim() || undefined,
        storage: formData.storage.trim() || undefined,
        imei: formData.imei.trim() || undefined,
        warrantyMonths,
        purchaseDate: formData.purchaseDate,
        notes: formData.notes.trim() || undefined,
      };

      const warranty = await createWarranty(data);

      alert(`✅ Tạo bảo hành thành công!\nMã: ${warranty.warrantyCode}`);

      // Print warranty card
      if (window.confirm("Bạn có muốn in phiếu bảo hành không?")) {
        printWarrantyCard(warranty);
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(warranty._id);
      }
    } catch (error) {
      console.error("Error creating warranty:", error);
      alert("❌ Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-warranty">
      <div className="page-header">
        <div>
          <h1>
            <i className="fas fa-plus-circle"></i> Tạo bảo hành mới
          </h1>
          <p>Tạo phiếu bảo hành cho khách mua tại cửa hàng hoặc sửa chữa</p>
        </div>
        <button className="btn btn-add-slider btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="warranty-form">
        {/* Khách hàng */}
        <div className="form-section">
          <h3>
            <i className="fas fa-user"></i> Thông tin khách hàng
          </h3>

          <div className="form-row">
            <div className="form-group flex-2">
              <label>
                Số điện thoại <span className="required">*</span>
              </label>
              <div className="input-group">
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="0901234567"
                  className={errors.customerPhone ? "error" : ""}
                  required
                />
                <button
                  type="button"
                  className="btn btn-search-inline"
                  onClick={handleLookupCustomer}
                  disabled={searchingCustomer}
                >
                  {searchingCustomer ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <i className="fas fa-search"></i> Tra cứu
                    </>
                  )}
                </button>
              </div>
              {errors.customerPhone && (
                <span className="error-message">{errors.customerPhone}</span>
              )}
              {customerFound && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i>
                  Tìm thấy: {customerFound.name}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Tên khách hàng <span className="required">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={errors.customerName ? "error" : ""}
                required
              />
              {errors.customerName && (
                <span className="error-message">{errors.customerName}</span>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="email@example.com"
                className={errors.customerEmail ? "error" : ""}
              />
              {errors.customerEmail && (
                <span className="error-message">{errors.customerEmail}</span>
              )}
            </div>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="form-section">
          <h3>
            <i className="fas fa-mobile-alt"></i> Thông tin sản phẩm
          </h3>

          <div className="form-group">
            <label>Loại dịch vụ</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleServiceTypeChange}
            >
              <option value="">-- Chọn loại --</option>
              <optgroup label="📱 Sản phẩm mới">
                <option value="new_phone">Điện thoại mới</option>
              </optgroup>
              <optgroup label="🔧 Dịch vụ sửa chữa">
                <option value="screen_replacement">Thay màn hình</option>
                <option value="battery_replacement">Thay pin</option>
                <option value="camera_repair">Sửa camera</option>
                <option value="speaker_repair">Sửa loa</option>
                <option value="button_repair">Sửa nút bấm</option>
              </optgroup>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              Tên sản phẩm <span className="required">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="VD: iPhone 15 Pro Max, Samsung Galaxy S24..."
              className={errors.productName ? "error" : ""}
              required
            />
            {errors.productName && (
              <span className="error-message">{errors.productName}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Màu sắc</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="VD: Đen Titan, Xanh Dương..."
              />
            </div>

            <div className="form-group">
              <label>RAM</label>
              <input
                type="text"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="VD: 8GB, 12GB..."
              />
            </div>

            <div className="form-group">
              <label>Bộ nhớ</label>
              <input
                type="text"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="VD: 256GB, 512GB..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>IMEI (15 số)</label>
            <input
              type="text"
              name="imei"
              value={formData.imei}
              onChange={handleChange}
              placeholder="353234567890123"
              maxLength="15"
              className={errors.imei ? "error" : ""}
            />
            {errors.imei && (
              <span className="error-message">{errors.imei}</span>
            )}
          </div>
        </div>

        {/* Bảo hành */}
        <div className="form-section">
          <h3>
            <i className="fas fa-shield-alt"></i> Thời gian bảo hành
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>
                Thời hạn bảo hành <span className="required">*</span>
              </label>
              <select
                name="warrantyMonths"
                value={formData.warrantyMonths}
                onChange={handleChange}
              >
                <option value="3">3 tháng</option>
                <option value="6">6 tháng</option>
                <option value="12">12 tháng (1 năm)</option>
                <option value="24">24 tháng (2 năm)</option>
                <option value="36">36 tháng (3 năm)</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>

            {formData.warrantyMonths === "custom" && (
              <div className="form-group">
                <label>Số tháng</label>
                <input
                  type="number"
                  name="customMonths"
                  value={formData.customMonths}
                  onChange={handleChange}
                  min="1"
                  max="60"
                  placeholder="Nhập số tháng (1-60)"
                />
              </div>
            )}

            <div className="form-group">
              <label>Ngày mua</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Ghi chú thêm về sản phẩm hoặc bảo hành..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            <i className="fas fa-times"></i> Hủy
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Đang tạo...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i> Tạo bảo hành
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateWarranty;
