import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  updateUser,
  getUserInfo,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../../services/Api";
import AddressModal from "../../shared/components/AddressModal/AddressModal";
import Http from "../../services/Http";

const Toast = ({ message, type, onClose }) => (
  <div className={`user-toast user-toast-${type}`}>
    {message}
    <span className="user-toast-close" onClick={onClose}>
      &times;
    </span>
  </div>
);

const UserEdit = () => {
  const login = useSelector(({ auth }) => auth.login);
  const navigate = useNavigate();
  const user = login.currentCustomer || {};
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
    email: user.email || "",
    address: user.address || "",
  });
  // Tab quản lý
  const [activeTab, setActiveTab] = useState("info");
  // Địa chỉ
  const [userAddresses, setUserAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  // Trả góp
  const [installmentOrders, setInstallmentOrders] = useState([]);
  const [loadingInstallment, setLoadingInstallment] = useState(true);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  // Load địa chỉ khi vào tab Sổ địa chỉ
  useEffect(() => {
    if (activeTab === "address") {
      loadUserAddresses();
    } else if (activeTab === "installment") {
      loadInstallmentOrders();
    }
  }, [activeTab]);

  const loadUserAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await getUserInfo();
      const addresses = response.data.addresses || [];
      setUserAddresses(addresses);
    } catch (error) {
      setUserAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const loadInstallmentOrders = async () => {
    try {
      setLoadingInstallment(true);
      // Sử dụng đúng endpoint chuẩn từ BE
      const response = await Http.get("/orders?isInstallment=true");
      const orders = response.data || [];
      setInstallmentOrders(orders);
    } catch (error) {
      console.error("Lỗi load đơn hàng trả góp:", error);
      setInstallmentOrders([]);
    } finally {
      setLoadingInstallment(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      const response = await addAddress(addressData);
      if (response.data.addresses) {
        setUserAddresses(response.data.addresses);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      alert("Không thể thêm địa chỉ. Vui lòng thử lại!");
    }
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      const response = await updateAddress(editingAddress._id, addressData);
      if (response.data.addresses) {
        setUserAddresses(response.data.addresses);
      }
      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (error) {
      alert("Không thể cập nhật địa chỉ. Vui lòng thử lại!");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        const response = await deleteAddress(addressId);
        if (response.data.addresses) {
          setUserAddresses(response.data.addresses);
        }
      } catch (error) {
        alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
      }
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await handleUpdateAddress({ ...address, isDefault: true });
    } catch {}
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };
  const [message, setMessage] = useState("");
  // State cho đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  // Validate phone (Vietnam 10-11 số, bắt đầu bằng 0)
  const validatePhone = (phone) => {
    return /^0\d{9,10}$/.test(phone);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      showToast("Email không hợp lệ!", "error");
      return;
    }
    if (!validatePhone(form.phone)) {
      showToast(
        "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 số, bắt đầu bằng 0.",
        "error"
      );
      return;
    }
    try {
      await updateUser(user._id, form);
      showToast("Cập nhật thành công!", "success");
      setMessage("");
    } catch (err) {
      showToast("Cập nhật thất bại!", "error");
      setMessage("");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showToast("Vui lòng nhập đầy đủ thông tin!", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Mật khẩu mới không khớp!", "error");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      await Http.put(
        "/users/change-password",
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast("Đổi mật khẩu thành công!", "success");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (err) {
      showToast("Đổi mật khẩu thất bại!", "error");
    }
  };

  return (
    <div className="user-edit-main">
      {/* Sidebar trái */}
      <aside className="user-edit-sidebar">
        <div className="user-avatar">
          <i className="fas fa-user"></i>
        </div>
        <div className="user-name">{user.fullName}</div>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setActiveTab("info")}
          >
            Thông tin khách hàng
          </li>
          <li
            className={activeTab === "address" ? "active" : ""}
            onClick={() => setActiveTab("address")}
          >
            Sổ địa chỉ
          </li>
          <li
            className={activeTab === "installment" ? "active" : ""}
            onClick={() => setActiveTab("installment")}
          >
            Thông tin trả góp
          </li>
          <li style={{ color: "#aaa", cursor: "not-allowed" }}>Đơn đặt hàng</li>
          <li
            style={{ color: "#4a90e2", cursor: "pointer" }}
            onClick={() => navigate("/warranty")}
          >
            Tra cứu bảo hành
          </li>
          <li
            style={{ color: "#e74c3c", marginTop: 16, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Thoát
          </li>
        </ul>
      </aside>
      {/* Content phải */}
      <div className="user-edit-content">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        {activeTab === "info" && (
          <>
            <h2>Thông tin tài khoản</h2>
            <form className="user-edit-form" onSubmit={handleSubmit}>
              <label>Họ và tên</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
              />
              <label>Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <button type="submit">Cập nhật</button>
              {message && <div className="user-edit-message">{message}</div>}
            </form>
            <hr style={{ margin: "32px 0" }} />
            <button
              className="btn btn-outline-primary"
              style={{ width: "100%", marginBottom: 12 }}
              onClick={() => setShowChangePassword((v) => !v)}
            >
              {showChangePassword ? "Đóng đổi mật khẩu" : "Đổi mật khẩu"}
            </button>
            {showChangePassword && (
              <form className="user-edit-form" onSubmit={handlePasswordSubmit}>
                <label>Mật khẩu hiện tại</label>
                <input
                  name="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <label>Mật khẩu mới</label>
                <input
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <label>Xác nhận mật khẩu mới</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <button type="submit">Xác nhận đổi mật khẩu</button>
                {passwordMessage && (
                  <div className="user-edit-message">{passwordMessage}</div>
                )}
              </form>
            )}
          </>
        )}
        {activeTab === "address" && (
          <div className="user-address-book">
            <h2>Sổ địa chỉ</h2>
            <button
              className="btn btn-primary"
              style={{ float: "right", marginBottom: 12 }}
              onClick={openAddModal}
            >
              Thêm địa chỉ mới
            </button>
            {loadingAddresses ? (
              <div>Đang tải địa chỉ...</div>
            ) : userAddresses.length === 0 ? (
              <div>Chưa có địa chỉ nào.</div>
            ) : (
              <table className="address-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Địa chỉ</th>
                    <th>Điện thoại</th>
                    <th>Mặc định</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {userAddresses.map((addr) => (
                    <tr
                      key={addr._id}
                      className={addr.isDefault ? "default" : ""}
                    >
                      <td>{user.fullName}</td>
                      <td>{addr.address}</td>
                      <td>{addr.phone}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={!!addr.isDefault}
                          readOnly
                        />
                        {!addr.isDefault && (
                          <button
                            className="btn btn-link"
                            style={{ marginLeft: 8 }}
                            onClick={() => handleSetDefault(addr)}
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-link"
                          onClick={() => openEditModal(addr)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-link text-danger"
                          onClick={() => handleDeleteAddress(addr._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <AddressModal
              isOpen={showAddressModal}
              onClose={() => setShowAddressModal(false)}
              onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
              editingAddress={editingAddress}
              title={editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
            />
          </div>
        )}
        {activeTab === "installment" && (
          <div className="user-installment-info">
            <h2>Thông tin trả góp</h2>
            {loadingInstallment ? (
              <div>Đang tải thông tin trả góp...</div>
            ) : installmentOrders.length === 0 ? (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#999" }}
              >
                Bạn chưa có đơn hàng trả góp nào.
              </div>
            ) : (
              <table className="installment-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Hình thức</th>
                    <th>Trả hàng tháng</th>
                    <th>Số kỳ hạn</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {installmentOrders.map((order) => {
                    const { installment } = order;
                    const statusLabels = {
                      pending: "Chờ duyệt",
                      approved: "Đã duyệt",
                      rejected: "Đã từ chối",
                    };
                    const statusColors = {
                      pending: "#f39c12",
                      approved: "#27ae60",
                      rejected: "#e74c3c",
                    };

                    return (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-8)}</td>
                        <td>
                          {installment.type === "creditCard"
                            ? "💳 Thẻ tín dụng"
                            : "🏦 Công ty TC"}
                        </td>
                        <td style={{ fontWeight: "bold", color: "#e74c3c" }}>
                          {installment.monthlyPayment?.toLocaleString()} đ
                        </td>
                        <td>{installment.months} tháng</td>
                        <td>
                          <span
                            className="installment-status-badge"
                            style={{
                              backgroundColor:
                                statusColors[installment.financeStatus],
                            }}
                          >
                            {statusLabels[installment.financeStatus]}
                          </span>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-view-detail"
                            onClick={() => {
                              setSelectedInstallment(order);
                              setShowInstallmentModal(true);
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Modal chi tiết */}
            {showInstallmentModal && selectedInstallment && (
              <div
                className="installment-modal-overlay"
                onClick={() => setShowInstallmentModal(false)}
              >
                <div
                  className="installment-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="installment-modal-header">
                    <h3>Chi tiết đơn hàng trả góp</h3>
                    <button
                      className="installment-modal-close"
                      onClick={() => setShowInstallmentModal(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="installment-modal-body">
                    {/* Thông tin sản phẩm */}
                    <section className="modal-section">
                      <h4>Thông tin sản phẩm</h4>
                      {selectedInstallment.items?.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <div className="product-info">
                            <strong>
                              {item.productId?.name || "Sản phẩm"}
                            </strong>
                            <div className="product-variant">
                              {item.variant?.color && (
                                <span>Màu: {item.variant.color}</span>
                              )}
                              {item.variant?.storage && (
                                <span> | Bộ nhớ: {item.variant.storage}</span>
                              )}
                              {item.variant?.condition && (
                                <span>
                                  {" "}
                                  | Tình trạng: {item.variant.condition}
                                </span>
                              )}
                            </div>
                            <div className="product-price">
                              Số lượng: {item.quantity} | Giá:{" "}
                              {item.price?.toLocaleString()} đ
                            </div>
                          </div>
                        </div>
                      ))}
                    </section>

                    {/* Thông tin trả góp */}
                    <section className="modal-section">
                      <h4>Thông tin trả góp</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <strong>Hình thức:</strong>
                          <span>
                            {selectedInstallment.installment?.type ===
                            "creditCard"
                              ? "💳 Thẻ tín dụng"
                              : "🏦 Công ty tài chính"}
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Trả trước:</strong>
                          <span>
                            {selectedInstallment.installment?.upfront?.toLocaleString()}{" "}
                            đ
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Số kỳ hạn:</strong>
                          <span>
                            {selectedInstallment.installment?.months} tháng
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Lãi suất:</strong>
                          <span>
                            {selectedInstallment.installment?.interestRate}
                            %/tháng
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Trả hàng tháng:</strong>
                          <span
                            style={{ color: "#e74c3c", fontWeight: "bold" }}
                          >
                            {selectedInstallment.installment?.monthlyPayment?.toLocaleString()}{" "}
                            đ
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Tổng phải trả:</strong>
                          <span
                            style={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            {selectedInstallment.installment?.totalPayment?.toLocaleString()}{" "}
                            đ
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Trạng thái:</strong>
                          <span
                            className="installment-status-badge"
                            style={{
                              backgroundColor: {
                                pending: "#f39c12",
                                approved: "#27ae60",
                                rejected: "#e74c3c",
                              }[selectedInstallment.installment?.financeStatus],
                            }}
                          >
                            {
                              {
                                pending: "Chờ duyệt",
                                approved: "Đã duyệt",
                                rejected: "Đã từ chối",
                              }[selectedInstallment.installment?.financeStatus]
                            }
                          </span>
                        </div>
                        {selectedInstallment.installment?.transactionId && (
                          <div className="info-item">
                            <strong>Mã giao dịch:</strong>
                            <span style={{ fontFamily: "monospace" }}>
                              {selectedInstallment.installment?.transactionId}
                            </span>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Thông tin đơn hàng */}
                    <section className="modal-section">
                      <h4>Thông tin đơn hàng</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <strong>Mã đơn:</strong>
                          <span>{selectedInstallment._id}</span>
                        </div>
                        <div className="info-item">
                          <strong>Ngày tạo:</strong>
                          <span>
                            {new Date(
                              selectedInstallment.createdAt
                            ).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        <div className="info-item">
                          <strong>Địa chỉ:</strong>
                          <span>{selectedInstallment.address}</span>
                        </div>
                        <div className="info-item">
                          <strong>SĐT:</strong>
                          <span>{selectedInstallment.phone}</span>
                        </div>
                        {selectedInstallment.note && (
                          <div
                            className="info-item"
                            style={{ gridColumn: "1 / -1" }}
                          >
                            <strong>Ghi chú:</strong>
                            <span>{selectedInstallment.note}</span>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                  <div className="installment-modal-footer">
                    <button
                      className="btn-close-modal"
                      onClick={() => setShowInstallmentModal(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserEdit;
