import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getImageProduct } from "../../shared/utils";
import {
  createOrder,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserInfo,
} from "../../services/Api";
import { clearCartApi } from "../../services/Api";
import { clearCart } from "../../redux-setup/reducers/cart";
import { updateUserAddresses } from "../../redux-setup/reducers/auth";
import AddressModal from "../../shared/components/AddressModal/AddressModal";

// Helper function to determine if product is headphone
const isHeadphoneProduct = (product) => {
  if (!product) return false;

  const categoryName = product.category?.name?.toLowerCase() || "";

  // Check category name
  if (
    categoryName.includes("tai nghe") ||
    categoryName.includes("headphone") ||
    categoryName.includes("earphone") ||
    categoryName.includes("earbud") ||
    categoryName.includes("phụ kiện")
  ) {
    return true;
  }

  // Check specs for headphone-specific fields
  if (
    product.specs &&
    Object.keys(product.specs).some((key) =>
      [
        "connectionType",
        "driverSize",
        "impedance",
        "frequency",
        "noiseReduction",
        "batteryLife",
      ].includes(key)
    )
  ) {
    return true;
  }

  return false;
};

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const login = useSelector(({ auth }) => auth.login);

  // State variables
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [note, setNote] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [countdown, setCountdown] = useState(269); // 4 phút 29 giây

  const phone = login.currentCustomer?.phone || login.phone || "";

  // Load user addresses when component mounts
  useEffect(() => {
    loadUserAddresses();
  }, []);

  // Auto-select default address
  useEffect(() => {
    const defaultAddress = userAddresses.find((addr) => addr.isDefault);
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress._id);
    } else if (userAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(userAddresses[0]._id);
    }
  }, [userAddresses, selectedAddressId]);

  // Countdown timer for QR payment
  useEffect(() => {
    let timer;
    if (showQR && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQR, countdown]);

  const loadUserAddresses = async () => {
    try {
      setLoadingAddresses(true);

      // Gọi API để lấy thông tin user và addresses
      const response = await getUserInfo();
      const addresses = response.data.addresses || [];
      setUserAddresses(addresses);
      dispatch(updateUserAddresses(addresses));
    } catch (error) {
      console.error("Lỗi tải địa chỉ:", error);
      // Fallback: Sử dụng thông tin từ Redux store nếu API lỗi
      if (login.currentCustomer?.addresses) {
        setUserAddresses(login.currentCustomer.addresses);
      } else {
        setUserAddresses([]);
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleConfirmPayment = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    await clearCartApi();
    dispatch(clearCart());
    navigate("/OrderList");
  };

  const total = items.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.variant?.price || item.price || item.productId?.price || 0),
    0
  );

  // Số tài khoản MB Bank
  const bankAccount = "0362782295";
  // Tên ngân hàng (MB)
  const bankCode = "MB";
  // Tên chủ tài khoản (nếu muốn hiển thị)
  const bankName = "Nguyễn Minh Quang";

  // Hàm tạo link QR VietQR
  const getVietQRUrl = (amount, info) => {
    return `https://img.vietqr.io/image/${bankCode}-${bankAccount}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
      info
    )}`;
  };

  const handleOrder = async () => {
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    const selectedAddress = userAddresses.find(
      (addr) => addr._id === selectedAddressId
    );
    if (!selectedAddress) {
      alert("Địa chỉ không hợp lệ!");
      return;
    }

    setIsOrdering(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          variant: item.variant,
          color: item.color || item.variant?.color,
          price:
            item.variant?.price || item.price || item.productId?.price || 0,
        })),
        address: selectedAddress.address,
        phone: selectedAddress.phone || phone,
        note,
        paymentMethod,
        total,
      };
      console.log("[CREATE ORDER] Payload FE gửi lên:", orderData);

      // Gọi API tạo đơn hàng thông thường (không kiểm tra tồn kho)
      const res = await createOrder(orderData);
      console.log("[Payment] Order API response:", res.data);

      const newOrderId = Array.isArray(res.data)
        ? res.data[0]._id
        : res.data._id;
      setOrderId(newOrderId);
      if (paymentMethod === "online") {
        setShowQR(true);
        setCountdown(269); // Reset countdown khi mở QR
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        await clearCartApi();
        dispatch(clearCart());
        navigate("/OrderList");
      }
    } catch (err) {
      console.error("[Payment] Order error:", err);
      if (err.response) {
        console.error("[Payment] Lỗi chi tiết từ API:", err.response.data);
      }
      alert("Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setIsOrdering(false);
    }
  };

  // Address management functions
  const handleAddAddress = async (addressData) => {
    try {
      const response = await addAddress(addressData);
      console.log("✅ Thêm địa chỉ thành công:", response.data);

      // Cập nhật danh sách địa chỉ từ response
      if (response.data.addresses) {
        setUserAddresses(response.data.addresses);
        dispatch(updateUserAddresses(response.data.addresses));
      }

      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Lỗi thêm địa chỉ:", error);
      alert("Không thể thêm địa chỉ. Vui lòng thử lại!");
    }
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      const response = await updateAddress(editingAddress._id, addressData);
      console.log("✅ Cập nhật địa chỉ thành công:", response.data);

      // Cập nhật danh sách địa chỉ từ response
      if (response.data.addresses) {
        setUserAddresses(response.data.addresses);
        dispatch(updateUserAddresses(response.data.addresses));
      }

      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Lỗi cập nhật địa chỉ:", error);
      alert("Không thể cập nhật địa chỉ. Vui lòng thử lại!");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        const response = await deleteAddress(addressId);
        console.log("✅ Xóa địa chỉ thành công:", response.data);

        // Cập nhật danh sách địa chỉ từ response
        if (response.data.addresses) {
          setUserAddresses(response.data.addresses);
          dispatch(updateUserAddresses(response.data.addresses));
        }

        if (selectedAddressId === addressId) {
          setSelectedAddressId("");
        }
      } catch (error) {
        console.error("Lỗi xóa địa chỉ:", error);
        alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
      }
    }
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  return (
    <div className="payment-container">
      <h3>Sản phẩm</h3>
      <table className="payment-product-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="payment-product-cell">
                  <img
                    src={getImageProduct(item.productId?.images?.[0])}
                    alt={item.productId?.name}
                    className="payment-product-image"
                  />
                  <span>{item.productId?.name}</span>
                  {isHeadphoneProduct(item.productId) ? (
                    // Headphone variant display - only color
                    <>
                      {item.variant?.color && (
                        <span className="payment-variant-info">
                          Màu: {item.variant.color}
                        </span>
                      )}
                    </>
                  ) : (
                    // Phone variant display
                    <>
                      {item.variant ? (
                        <span className="payment-variant-info">
                          RAM: {item.variant.ram}GB, Bộ nhớ:{" "}
                          {item.variant.storage}GB
                        </span>
                      ) : (
                        <>
                          {item.ram && (
                            <span className="payment-variant-info">
                              RAM: {item.ram}GB
                            </span>
                          )}
                          {item.storage && (
                            <span className="payment-variant-info">
                              Bộ nhớ: {item.storage}GB
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </td>
              <td className="payment-price">
                {(
                  item.variant?.price ||
                  item.price ||
                  item.productId?.price ||
                  0
                ).toLocaleString()}{" "}
                đ
              </td>
              <td>{item.quantity}</td>
              <td className="payment-price">
                {(
                  item.quantity *
                  (item.variant?.price ||
                    item.price ||
                    item.productId?.price ||
                    0)
                ).toLocaleString()}{" "}
                đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="payment-options-section">
        <h4>Cách thức nhận hàng</h4>
        <label className="payment-radio-label">
          <input
            type="radio"
            checked={deliveryMethod === "home"}
            onChange={() => setDeliveryMethod("home")}
          />{" "}
          Giao hàng tận nơi
        </label>
        <label className="payment-radio-label">
          <input
            type="radio"
            checked={deliveryMethod === "store"}
            onChange={() => setDeliveryMethod("store")}
          />{" "}
          Nhận hàng tại cửa hàng
        </label>
        <h4>Phương thức thanh toán</h4>
        <label className="payment-radio-label">
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />{" "}
          Thanh toán khi nhận hàng
        </label>
        <label className="payment-radio-label">
          <input
            type="radio"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />{" "}
          Chuyển khoản online
        </label>
        {/* Address Management Section */}
        <h4>Địa chỉ nhận hàng</h4>
        {loadingAddresses ? (
          <div className="address-loading">
            <i className="fas fa-spinner fa-spin"></i> Đang tải địa chỉ...
          </div>
        ) : (
          <div className="address-section">
            {userAddresses.length === 0 ? (
              <div className="address-empty">
                <p>Chưa có địa chỉ nào</p>
                <button
                  onClick={openAddModal}
                  className="address-add-btn-inline"
                >
                  <i className="fas fa-plus"></i> Thêm địa chỉ
                </button>
              </div>
            ) : (
              <>
                <div className="address-list">
                  {userAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`address-item ${
                        selectedAddressId === addr._id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAddressId(addr._id)}
                    >
                      <div className="address-item-content">
                        <div className="address-item-info">
                          <div className="address-item-labels">
                            <span className="address-label">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="address-default-badge">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="address-text">{addr.address}</div>
                          {addr.phone && (
                            <div className="address-phone">
                              SĐT: {addr.phone}
                            </div>
                          )}
                        </div>
                        <div className="address-item-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(addr);
                            }}
                            className="address-action-btn"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr._id);
                            }}
                            className="address-action-btn delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={openAddModal} className="address-add-btn">
                  <i className="fas fa-plus"></i> Thêm địa chỉ mới
                </button>
              </>
            )}
          </div>
        )}
        {/* Address Modal */}
        <AddressModal
          isOpen={showAddressModal}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
          editingAddress={editingAddress}
          title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        />
      </div>

      <div className="payment-note-section">
        <h4>Ghi chú:</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="payment-note-textarea"
          placeholder="Nhập ghi chú..."
        />
      </div>

      <div className="payment-summary">
        <div className="payment-summary-info">
          <div>
            Tổng tiền sản phẩm: <b>{total.toLocaleString()} đ</b>
          </div>
          <div>
            Tổng giảm giá: <b>0 đ</b>
          </div>
          <div className="payment-summary-total">
            Tổng thanh toán: {total.toLocaleString()} đ
          </div>
        </div>
        <button
          onClick={handleOrder}
          className="payment-order-btn"
          disabled={isOrdering}
        >
          {isOrdering ? "Đang đặt hàng..." : "ĐẶT HÀNG"}
        </button>
      </div>
      {/* Hiển thị QR Modal khi chọn chuyển khoản online và đã đặt hàng */}
      {showQR && paymentMethod === "online" && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div
            className="qr-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="qr-modal-header">
              <div className="qr-modal-icon">
                <i className="fas fa-credit-card-alt"></i>
              </div>
              <h2 className="qr-modal-title">Thanh toán chuyển khoản</h2>
            </div>

            {/* Body */}
            <div className="qr-modal-body">
              {/* Left side - Instructions */}
              <div className="qr-modal-left">
                <div className="qr-info-section">
                  <p className="qr-info-text">
                    Đơn hàng #{orderId?.slice(-8) || "XXXXXXXX"}
                  </p>
                  <p className="qr-info-subtext">
                    Vui lòng hoàn tất thanh toán trong thời gian quy định để đơn
                    hàng được xử lý nhanh chóng. Sau khi thanh toán thành công,
                    đơn hàng sẽ được chuẩn bị và giao đến bạn.
                  </p>
                </div>

                <div className="qr-money-section">
                  <div className="qr-money-icon">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="qr-money-info">
                    <h3 className="qr-money-amount">
                      {total.toLocaleString()} VND
                    </h3>
                    <p className="qr-money-date">
                      Đơn hàng tạo ngày {new Date().toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="qr-instructions">
                  <h4 className="qr-instructions-title">
                    Hướng dẫn thanh toán:
                  </h4>
                  <ol className="qr-instructions-list">
                    <li>
                      <strong>Mở ứng dụng ngân hàng</strong> hoặc{" "}
                      <strong>ứng dụng MoMo</strong> trên điện thoại
                    </li>
                    <li>
                      Chọn <strong>"Quét mã QR"</strong> và hướng camera vào mã
                      QR bên phải
                    </li>
                    <li>
                      Kiểm tra thông tin và chọn <strong>"Xác nhận"</strong> để
                      hoàn tất thanh toán
                    </li>
                  </ol>
                </div>

                <div className="qr-countdown">
                  <span>Mã QR hết hạn sau: </span>
                  <strong className="countdown-time">
                    {Math.floor(countdown / 60)}:
                    {String(countdown % 60).padStart(2, "0")}
                  </strong>
                </div>

                <div className="qr-banks">
                  <p className="qr-banks-title">
                    Hỗ trợ <strong>50+ ngân hàng</strong> và ví điện tử
                  </p>
                  <div className="qr-banks-logos">
                    <div className="bank-logo">
                      <img
                        src="https://api.vietqr.io/img/ICB.png"
                        alt="VietinBank"
                      />
                    </div>
                    <div className="bank-logo">
                      <img
                        src="https://api.vietqr.io/img/VCB.png"
                        alt="Vietcombank"
                      />
                    </div>
                    <div className="bank-logo">
                      <img
                        src="https://api.vietqr.io/img/MB.png"
                        alt="MB Bank"
                      />
                    </div>
                    <div className="bank-logo">
                      <img
                        src="https://api.vietqr.io/img/TCB.png"
                        alt="Techcombank"
                      />
                    </div>
                    <div className="bank-logo">
                      <img src="https://api.vietqr.io/img/ACB.png" alt="ACB" />
                    </div>
                    <div className="bank-logo">
                      <span>...</span>
                    </div>
                  </div>
                  <a href="#" className="qr-banks-link">
                    Xem tất cả ngân hàng hỗ trợ
                  </a>
                </div>

                <div className="qr-note">
                  <div className="qr-note-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="qr-note-content">
                    <h5>Lưu ý quan trọng</h5>
                    <p>
                      Vui lòng chuyển khoản{" "}
                      <strong>đúng số tiền và nội dung</strong> để hệ thống tự
                      động xác nhận đơn hàng. Nếu cần hỗ trợ, liên hệ{" "}
                      <a href="tel:19001234">Hotline: 1900 1234</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - QR Code */}
              <div className="qr-modal-right">
                <div className="qr-code-section">
                  <p className="qr-instruction-text">
                    Quét mã QR bằng <strong>ứng dụng ngân hàng</strong> hoặc{" "}
                    <strong>ví MoMo</strong> để thanh toán
                  </p>
                  <div className="qr-code-container">
                    <img
                      src={getVietQRUrl(
                        total,
                        orderId || "Thanh toan don hang"
                      )}
                      alt="QR chuyển khoản"
                      className="qr-code-image"
                    />
                  </div>
                  <div className="qr-payment-info">
                    <div className="qr-payment-row">
                      <span>Ngân hàng:</span>
                      <strong>MB Bank</strong>
                    </div>
                    <div className="qr-payment-row">
                      <span>Số tài khoản:</span>
                      <strong>{bankAccount}</strong>
                    </div>
                    <div className="qr-payment-row">
                      <span>Chủ tài khoản:</span>
                      <strong>{bankName}</strong>
                    </div>
                    <div className="qr-payment-row">
                      <span>Số tiền:</span>
                      <strong className="amount-text">
                        {total.toLocaleString()} đ
                      </strong>
                    </div>
                    <div className="qr-payment-row">
                      <span>Nội dung:</span>
                      <strong>{orderId || "Thanh toan don hang"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="qr-modal-footer">
              <button
                className="qr-modal-btn qr-modal-btn-secondary"
                onClick={() => setShowQR(false)}
              >
                Đóng
              </button>
              <button
                className="qr-modal-btn qr-modal-btn-primary"
                onClick={handleConfirmPayment}
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
