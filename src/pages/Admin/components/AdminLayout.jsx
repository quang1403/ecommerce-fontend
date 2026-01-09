import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProductList from "./ProductList";
import CustomerList from "./CustomerList";
import OrderManagement from "./OrderManagement";
import ReviewList from "./ReviewList";
import Statistics from "./Statistics";
import AdminNews from "./AdminNews";
import InstallmentOrders from "./InstallmentOrders";
import SliderManagement from "./SliderManagement";
import Toast from "./Toast";
import { getAllOrdersAdmin, getCommentsProduct } from "../../../services/Api";
import "../styles/AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth <= 768
  );
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const updatesRef = useRef();

  const menuItems = [
    { id: 0, label: "Bảng điều khiển", icon: "📊", badge: "Mới" },
    {
      id: "orders",
      label: "Đơn hàng",
      icon: "🛒",
      submenu: [
        { id: 1, label: "Tất cả đơn hàng", actualTab: 1 },
        { id: 7, label: "Đơn trả góp", actualTab: 7 },
      ],
    },
    { id: 2, label: "Người dùng", icon: "👥", actualTab: 2 },
    { id: 3, label: "Kho hàng", icon: "📦", actualTab: 3 },
    { id: 4, label: "Đánh giá", icon: "⭐", actualTab: 4 },
    { id: 5, label: "Thống kê", icon: "📊", actualTab: 5 },
    { id: 6, label: "Tin tức", icon: "📰", actualTab: 6 },
    {
      id: 9,
      label: "Giao diện",
      icon: "🎨",
      actualTab: 9,
    },
      
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshUpdates = () => {
    if (updatesRef.current) {
      updatesRef.current.refreshUpdates();
    }
  };

  // Fetch notifications count
  const fetchNotifications = async () => {
    try {
      // Lấy đơn hàng chờ xác nhận (status = 0)
      const ordersRes = await getAllOrdersAdmin();
      let orders = [];

      if (ordersRes.data && Array.isArray(ordersRes.data.orders)) {
        orders = ordersRes.data.orders;
      } else if (Array.isArray(ordersRes.orders)) {
        orders = ordersRes.orders;
      } else if (Array.isArray(ordersRes.data)) {
        orders = ordersRes.data;
      } else if (Array.isArray(ordersRes)) {
        orders = ordersRes;
      }

      // Đếm đơn hàng chờ xác nhận
      const pendingOrders = orders.filter((order) => order.status === 0).length;

      setNotificationCount(pendingOrders);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Refresh mỗi 30 giây
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Mobile: sidebar hidden by default
        setSidebarCollapsed(true);
      } else {
        // Desktop/Tablet: sidebar visible
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    showToast("Đăng xuất thành công!", "success");
    setTimeout(() => navigate("/"), 1500);
  };

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      setTab(item.actualTab !== undefined ? item.actualTab : item.id);
      // Close sidebar on mobile after selecting a menu item
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    }
  };

  const handleNotificationClick = () => {
    // Chuyển về tab Dashboard
    setTab(0);

    // Scroll đến phần hoạt động gần đây sau khi render
    setTimeout(() => {
      const activitySection = document.querySelector(
        ".recent-activity, .activity-feed, .nexus-updates"
      );
      if (activitySection) {
        activitySection.scrollIntoView({ behavior: "smooth", block: "start" });
        // Highlight effect
        activitySection.style.animation = "highlight-pulse 2s ease-out";
      }
    }, 100);
  };

  const isActive = (item) => {
    if (item.submenu) {
      return item.submenu.some((sub) => sub.actualTab === tab);
    }
    return (item.actualTab !== undefined ? item.actualTab : item.id) === tab;
  };

  const handleNavigateToOrders = () => {
    setTab(1); // Chuyển đến tab Tất cả đơn hàng
  };

  let mainContent;
  if (tab === 0)
    mainContent = (
      <Dashboard
        refreshUpdates={refreshUpdates}
        onNavigateToOrders={handleNavigateToOrders}
      />
    );
  else if (tab === 1)
    mainContent = (
      <OrderManagement showToast={showToast} refreshUpdates={refreshUpdates} />
    );
  else if (tab === 2) mainContent = <CustomerList />;
  else if (tab === 3) mainContent = <ProductList />;
  else if (tab === 4) mainContent = <ReviewList />;
  else if (tab === 5) mainContent = <Statistics />;
  else if (tab === 6) mainContent = <AdminNews />;
  else if (tab === 7) mainContent = <InstallmentOrders />;
  else if (tab === 9) mainContent = <SliderManagement />;
  else
    mainContent = (
      <div style={{ padding: "2rem" }}>Chức năng đang phát triển...</div>
    );

  return (
    <div className="nexus-admin-layout">
      {/* Backdrop overlay for mobile */}
      {!sidebarCollapsed && window.innerWidth <= 768 && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`nexus-sidebar ${sidebarCollapsed ? "collapsed" : "show"}`}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">P</div>
            {!sidebarCollapsed && <span className="logo-text">PS Admin</span>}
          </div>
          {!sidebarCollapsed && (
            <span className="admin-badge">Quản trị viên</span>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                className={`nav-item ${isActive(item) ? "active" : ""}`}
                onClick={() => handleMenuClick(item)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`nav-badge ${
                          item.badge === "Mới" ? "new" : ""
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <span className="nav-arrow">
                        {expandedMenu === item.id ? "▼" : "▶"}
                      </span>
                    )}
                  </>
                )}
              </button>
              {item.submenu &&
                expandedMenu === item.id &&
                !sidebarCollapsed && (
                  <div className="submenu">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        className={`submenu-item ${
                          tab === subItem.actualTab ? "active" : ""
                        }`}
                        onClick={() => {
                          setTab(subItem.actualTab);
                          // Close sidebar on mobile after selecting a submenu item
                          if (window.innerWidth <= 768) {
                            setSidebarCollapsed(true);
                          }
                        }}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span className="nav-label">Đăng xuất</span>}
          </button>
        </nav>

        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? "→" : "←"}
        </button>
      </aside>

      {/* Main Content */}
      <div className="nexus-main-content">
        {/* Header */}
        <header className="nexus-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>
          </div>

          <div className="header-right">
            <button
              className="header-icon-btn notifications"
              onClick={handleNotificationClick}
              title={`${notificationCount} đơn hàng chờ xác nhận`}
            >
              🔔
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            <div className="user-profile">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=667eea&color=fff"
                alt="User"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{mainContent}</main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
