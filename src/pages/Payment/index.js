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
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#fff",
        padding: 24,
        borderRadius: 8,
      }}
    >
      <h3>Sản phẩm</h3>
      <table style={{ width: "100%", marginBottom: 24 }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ textAlign: "left", padding: 8 }}>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: 8,
                }}
              >
                <img
                  src={getImageProduct(item.productId?.images?.[0])}
                  alt={item.productId?.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <span>{item.productId?.name}</span>
                {isHeadphoneProduct(item.productId) ? (
                  // Headphone variant display - only color
                  <>
                    {item.variant?.color && (
                      <span
                        style={{ marginLeft: 8, color: "#555", fontSize: 13 }}
                      >
                        Màu: {item.variant.color}
                      </span>
                    )}
                  </>
                ) : (
                  // Phone variant display
                  <>
                    {item.variant ? (
                      <span
                        style={{ marginLeft: 8, color: "#555", fontSize: 13 }}
                      >
                        RAM: {item.variant.ram}GB, Bộ nhớ:{" "}
                        {item.variant.storage}GB
                      </span>
                    ) : (
                      <>
                        {item.ram && (
                          <span
                            style={{
                              marginLeft: 8,
                              color: "#555",
                              fontSize: 13,
                            }}
                          >
                            RAM: {item.ram}GB
                          </span>
                        )}
                        {item.storage && (
                          <span
                            style={{
                              marginLeft: 8,
                              color: "#555",
                              fontSize: 13,
                            }}
                          >
                            Bộ nhớ: {item.storage}GB
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
              </td>
              <td style={{ color: "#d32f2f", fontWeight: "bold" }}>
                {(
                  item.variant?.price ||
                  item.price ||
                  item.productId?.price ||
                  0
                ).toLocaleString()}{" "}
                đ
              </td>
              <td>{item.quantity}</td>
              <td style={{ color: "#d32f2f", fontWeight: "bold" }}>
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

      <div
        style={{
          background: "#f5f5f5",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h4 style={{ color: "#4a90e2" }}>Cách thức nhận hàng</h4>
        <label style={{ marginRight: 24 }}>
          <input
            type="radio"
            checked={deliveryMethod === "home"}
            onChange={() => setDeliveryMethod("home")}
          />{" "}
          Giao hàng tận nơi
        </label>
        <label>
          <input
            type="radio"
            checked={deliveryMethod === "store"}
            onChange={() => setDeliveryMethod("store")}
          />{" "}
          Nhận hàng tại cửa hàng
        </label>
        <h4 style={{ color: "#4a90e2", marginTop: 16 }}>
          Phương thức thanh toán
        </h4>
        <label style={{ marginRight: 24 }}>
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />{" "}
          Thanh toán khi nhận hàng
        </label>
        <label>
          <input
            type="radio"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />{" "}
          Chuyển khoản online
        </label>
        {/* Address Management Section */}
        <h4 style={{ color: "#4a90e2", marginTop: 16 }}>Địa chỉ nhận hàng</h4>
        {loadingAddresses ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <i className="fas fa-spinner fa-spin"></i> Đang tải địa chỉ...
          </div>
        ) : (
          <div className="address-section">
            {userAddresses.length === 0 ? (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#666",
                  border: "1px dashed #ddd",
                  borderRadius: "8px",
                }}
              >
                <p>Chưa có địa chỉ nào</p>
                <button
                  onClick={openAddModal}
                  style={{
                    background: "#4a90e2",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <i className="fas fa-plus"></i> Thêm địa chỉ
                </button>
              </div>
            ) : (
              <>
                <div
                  className="address-list"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {userAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`address-item ${
                        selectedAddressId === addr._id ? "selected" : ""
                      }`}
                      style={{
                        border:
                          selectedAddressId === addr._id
                            ? "2px solid #4a90e2"
                            : "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "8px",
                        cursor: "pointer",
                        background:
                          selectedAddressId === addr._id ? "#f0f7ff" : "white",
                        transition: "all 0.2s",
                      }}
                      onClick={() => setSelectedAddressId(addr._id)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                background: "#4a90e2",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                              }}
                            >
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span
                                style={{
                                  background: "#28a745",
                                  color: "white",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "11px",
                                }}
                              >
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#333",
                              marginBottom: "4px",
                            }}
                          >
                            {addr.address}
                          </div>
                          {addr.phone && (
                            <div style={{ fontSize: "13px", color: "#666" }}>
                              SĐT: {addr.phone}
                            </div>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(addr);
                            }}
                            style={{
                              background: "none",
                              border: "1px solid #ddd",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr._id);
                            }}
                            style={{
                              background: "none",
                              border: "1px solid #e74c3c",
                              color: "#e74c3c",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={openAddModal}
                  style={{
                    background: "#4a90e2",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "12px",
                    width: "100%",
                  }}
                >
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

      <div style={{ marginBottom: 24 }}>
        <h4 style={{ color: "#4a90e2" }}>Ghi chú:</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: "100%",
            minHeight: 80,
            borderRadius: 8,
            border: "1px solid #ccc",
            padding: 8,
          }}
          placeholder="Nhập ghi chú..."
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div>
          <div>
            Tổng tiền sản phẩm: <b>{total.toLocaleString()} đ</b>
          </div>
          <div>
            Tổng giảm giá: <b>0 đ</b>
          </div>
          <div style={{ color: "#4a90e2", fontWeight: "bold", fontSize: 18 }}>
            Tổng thanh toán: {total.toLocaleString()} đ
          </div>
        </div>
        <button
          onClick={handleOrder}
          style={{
            background: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
          disabled={isOrdering}
        >
          {isOrdering ? "Đang đặt hàng..." : "ĐẶT HÀNG"}
        </button>
      </div>
      {/* Hiển thị QR khi chọn chuyển khoản online và đã đặt hàng */}
      {showQR && paymentMethod === "online" && (
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <h3>Quét mã QR để chuyển khoản</h3>
          <img
            src={getVietQRUrl(total, orderId || "Thanh toan don hang")}
            alt="QR chuyển khoản MB Bank"
            style={{ width: 260, height: 260, margin: "0 auto" }}
          />
          <div style={{ marginTop: 16 }}>
            <b>Ngân hàng:</b> MB Bank
            <br />
            <b>Số tài khoản:</b> {bankAccount}
            <br />
            <b>Số tiền:</b> {total.toLocaleString()} đ<br />
            <b>Nội dung chuyển khoản:</b> {orderId || "Thanh toan don hang"}
          </div>
          <div style={{ marginTop: 16, color: "#d32f2f" }}>
            Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống xác nhận
            đơn hàng!
          </div>
          <button
            style={{
              marginTop: 24,
              background: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 32px",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={handleConfirmPayment}
          >
            Xác nhận đã thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
