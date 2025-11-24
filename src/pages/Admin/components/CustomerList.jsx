import React, { useEffect, useState } from "react";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../../services/Api";
import "../styles/CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addresses: [{ address: "" }],
    isActive: true,
    isAdmin: false,
  });

  // Lấy danh sách khách hàng từ API
  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      // Map lại dữ liệu nếu BE trả về mảng user ở res.data hoặc res.data.data
      let users = [];
      if (Array.isArray(res.data?.data)) users = res.data.data;
      else if (Array.isArray(res.data)) users = res.data;
      else if (Array.isArray(res.users)) users = res.users;
      setCustomers(users);
    } catch (err) {
      setCustomers([]);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Mở drawer thêm/sửa
  const openDrawerAdd = () => {
    setEditId(null);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      addresses: [{ address: "" }],
      isActive: true,
      isAdmin: false,
    });
    setDrawerOpen(true);
  };
  const openDrawerEdit = (cus) => {
    setEditId(cus._id);
    setForm({
      fullName: cus.fullName || "",
      email: cus.email || "",
      phone: cus.phone || "",
      addresses:
        Array.isArray(cus.addresses) && cus.addresses.length > 0
          ? cus.addresses
          : [{ address: "" }],
      isActive: typeof cus.isActive === "boolean" ? cus.isActive : true,
      isAdmin: typeof cus.isAdmin === "boolean" ? cus.isAdmin : false,
    });
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  // Xử lý submit thêm/sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn hóa addresses: chỉ lấy các địa chỉ không rỗng
      const submitForm = {
        ...form,
        addresses: form.addresses.filter(
          (addr) => addr.address && addr.address.trim()
        ),
      };
      if (editId) {
        await updateCustomer(editId, submitForm);
      } else {
        await addCustomer(submitForm);
      }
      setDrawerOpen(false);
      fetchCustomers();
    } catch (err) {
      alert("Có lỗi xảy ra!\n" + (err?.response?.data?.message || ""));
    }
  };

  // Xử lý xóa
  const handleDelete = async (_id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      try {
        await deleteCustomer(_id);
        fetchCustomers();
      } catch (err) {
        let msg = "Xóa thất bại!";
        if (err?.response?.data?.message)
          msg += "\n" + err.response.data.message;
        else if (err?.message) msg += "\n" + err.message;
        alert(msg);
      }
    }
  };

  return (
    <div className="CustomerList">
      <h2>Quản lý khách hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Quyền</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cus) => (
            <tr key={cus._id}>
              <td>{cus.fullName}</td>
              <td>{cus.email}</td>
              <td>{cus.phone || ""}</td>
              <td>
                {Array.isArray(cus.addresses) && cus.addresses.length > 0 ? (
                  <div>
                    {cus.addresses.map((addr, idx) => (
                      <div
                        key={addr._id || idx}
                        style={{
                          marginBottom: 6,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div>
                          <b>Label:</b> {addr.label}
                        </div>
                        <div>
                          <b>Địa chỉ:</b> {addr.address}
                        </div>
                        <div>
                          <b>SĐT:</b> {addr.phone}
                        </div>
                        <div>
                          <b>Mặc định:</b> {addr.isDefault ? "Có" : "Không"}
                        </div>
                        <div>
                          <b>ID:</b> {addr._id}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </td>
              <td>{cus.isActive === false ? "Khóa" : "Hoạt động"}</td>
              <td>{cus.isAdmin ? "Admin" : "Khách hàng"}</td>
              <td>{new Date(cus.createdAt).toLocaleString()}</td>
              <td>{new Date(cus.updatedAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => openDrawerEdit(cus)}
                >
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(cus._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Drawer/Side panel thêm/sửa khách hàng */}
      {drawerOpen && (
        <>
          <div className="drawer-bg" onClick={closeDrawer}></div>
          <div className="drawer-panel">
            <form onSubmit={handleSubmit}>
              <h3>{editId ? "Sửa khách hàng" : "Thêm khách hàng mới"}</h3>
              <label>Họ tên</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label>Số điện thoại</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <label>Địa chỉ</label>
              {form.addresses.map((addr, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 4,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <input
                    value={addr.label || ""}
                    onChange={(e) => {
                      const newAddresses = [...form.addresses];
                      newAddresses[idx].label = e.target.value;
                      setForm({ ...form, addresses: newAddresses });
                    }}
                    placeholder="Label"
                    style={{ width: 90 }}
                  />
                  <input
                    value={addr.address || ""}
                    onChange={(e) => {
                      const newAddresses = [...form.addresses];
                      newAddresses[idx].address = e.target.value;
                      setForm({ ...form, addresses: newAddresses });
                    }}
                    placeholder={`Địa chỉ ${idx + 1}`}
                    style={{ flex: 1 }}
                  />
                  <input
                    value={addr.phone || ""}
                    onChange={(e) => {
                      const newAddresses = [...form.addresses];
                      newAddresses[idx].phone = e.target.value;
                      setForm({ ...form, addresses: newAddresses });
                    }}
                    placeholder="SĐT"
                    style={{ width: 110 }}
                  />
                  <label style={{ fontSize: 12, margin: "0 4px" }}>
                    <input
                      type="checkbox"
                      checked={!!addr.isDefault}
                      onChange={(e) => {
                        const newAddresses = [...form.addresses];
                        newAddresses[idx].isDefault = e.target.checked;
                        setForm({ ...form, addresses: newAddresses });
                      }}
                    />{" "}
                    Mặc định
                  </label>
                  {form.addresses.length > 1 && (
                    <button
                      type="button"
                      className="btn-delete"
                      style={{ padding: "0 8px" }}
                      onClick={() => {
                        setForm({
                          ...form,
                          addresses: form.addresses.filter((_, i) => i !== idx),
                        });
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                style={{ marginBottom: 8 }}
                onClick={() =>
                  setForm({
                    ...form,
                    addresses: [...form.addresses, { address: "" }],
                  })
                }
              >
                Thêm địa chỉ
              </button>
              <label>Trạng thái</label>
              <select
                value={form.isActive ? "active" : "blocked"}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.value === "active" })
                }
              >
                <option value="active">Hoạt động</option>
                <option value="blocked">Khóa</option>
              </select>
              <label>Quyền</label>
              <select
                value={form.isAdmin ? "admin" : "user"}
                onChange={(e) =>
                  setForm({ ...form, isAdmin: e.target.value === "admin" })
                }
              >
                <option value="user">Khách hàng</option>
                <option value="admin">Admin</option>
              </select>
              <div className="drawer-actions">
                <button type="submit" className="btn-add">
                  {editId ? "Lưu" : "Thêm"}
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={closeDrawer}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerList;
