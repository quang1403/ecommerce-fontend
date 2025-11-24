import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const menu = [
  { ten: "Bảng điều khiển" },
  {
    ten: "Đơn hàng",
    submenu: [
      { ten: "Tất cả đơn hàng", tab: 1 },
      { ten: "Đơn hàng trả góp", tab: 7 },
    ],
  },
  { ten: "Khách hàng" },
  { ten: "Sản phẩm" },
  { ten: "Đánh giá sản phẩm" },
  { ten: "Thống kê" },
  { ten: "Quản lý tin tức" },
];

const Sidebar = ({ tab, setTab, showToast }) => {
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = () => {
    // Xóa token và user info khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Hiển thị thông báo bằng Toast
    showToast("Đăng xuất thành công! Đang chuyển hướng...", "success");

    // Delay redirect để user thấy toast
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <span>Quản trị cửa hàng</span>
      </div>
      <div className="menu">
        {menu.map((item, idx) => (
          <div key={idx}>
            {item.submenu ? (
              <div>
                <div
                  className={
                    tab === 1 || tab === 7 ? "menuItem active" : "menuItem"
                  }
                  onClick={() =>
                    setExpandedMenu(expandedMenu === idx ? null : idx)
                  }
                >
                  <span>{item.ten}</span>
                  <i
                    className={`fas fa-chevron-${
                      expandedMenu === idx ? "down" : "right"
                    }`}
                    style={{ marginLeft: "auto", fontSize: "12px" }}
                  ></i>
                </div>
                {expandedMenu === idx && (
                  <div className="submenu">
                    {item.submenu.map((subItem, subIdx) => (
                      <div
                        key={subIdx}
                        className={
                          tab === subItem.tab
                            ? "submenuItem active"
                            : "submenuItem"
                        }
                        onClick={() => setTab(subItem.tab)}
                      >
                        <span>{subItem.ten}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={tab === idx ? "menuItem active" : "menuItem"}
                onClick={() => setTab(idx)}
              >
                <span>{item.ten}</span>
              </div>
            )}
          </div>
        ))}
        <div className="menuItem" onClick={handleLogout}>
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
