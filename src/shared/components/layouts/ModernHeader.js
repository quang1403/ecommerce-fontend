import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  logOutCustomer,
  getBrands,
  getCategories,
} from "../../../services/Api";
import { logoutSuccess } from "../../../redux-setup/reducers/auth";
import React from "react";
import { clearCart } from "../../../redux-setup/reducers/cart";
import "./ModernHeader.css";

const ModernHeader = () => {
  const [keyword, setKeyword] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const login = useSelector(({ auth }) => auth.login);
  const totalCartItems = useSelector(({ cart }) =>
    (cart.items || []).reduce((total, item) => total + item.quantity, 0)
  );

  // Handle scroll effect with hide/show animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      // Hide header when scrolling down fast, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Fetch brands for mega menu
  useEffect(() => {
    getBrands({})
      .then((res) => {
        setBrands(res.data.data || []);
      })
      .catch((error) => {});

    // Test if server is running by fetching a simple endpoint
    fetch("http://localhost:5000/api/categories")
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {});

    // Fetch categories for navigation
    getCategories({})
      .then((res) => {
        const categoriesData = res.data?.data || res.data || [];
        setCategories(categoriesData);
        setCategoriesLoaded(true); // Set loading state to true after categories are loaded
      })
      .catch((error) => {
        setCategoriesLoaded(true); // Set to true even on error to prevent infinite loading
      });
  }, []);

  // Helper function to get category ID safely
  const getCategoryId = (categoryName) => {
    if (!categoriesLoaded || !categories.length) return "";
    const category = categories.find((cat) => cat.name === categoryName);
    return category?._id || "";
  };

  // Fetch notifications for logged in users
  useEffect(() => {
    const fetchNotifications = async () => {
      if (login?.loggedIn) {
        try {
          // Import API function dynamically
          const { getOrdersByUser } = await import("../../../services/Api");
          const res = await getOrdersByUser();
          const orders = res.data || [];

          // Create notifications from recent order status changes
          const orderNotifications = orders
            .filter((order) => {
              const orderDate = new Date(order.createdAt);
              const daysDiff = (new Date() - orderDate) / (1000 * 60 * 60 * 24);
              return daysDiff <= 7; // Show notifications for orders from last 7 days
            })
            .map((order) => {
              // Check if this is an installment order with finance status
              if (
                order.installment?.isInstallment &&
                order.installment?.financeStatus
              ) {
                const financeStatus = order.installment.financeStatus;
                let message = `Đơn hàng trả góp ${order._id.substring(
                  0,
                  8
                )}...`;

                if (financeStatus === "approved") {
                  message +=
                    " - Hồ sơ đã được duyệt. Vui lòng theo dõi đơn hàng để biết thêm chi tiết.";
                } else if (financeStatus === "rejected") {
                  message +=
                    " - Hồ sơ bị từ chối. Vui lòng kiểm tra lại thông tin hoặc liên hệ hỗ trợ.";
                } else {
                  message += " - Đang chờ xét duyệt từ bộ phận tài chính.";
                }

                return {
                  id: order._id,
                  title: getInstallmentNotificationTitle(financeStatus),
                  message: message,
                  status: financeStatus,
                  type: "installment",
                  createdAt: order.updatedAt || order.createdAt,
                  read: false,
                  orderId: order._id,
                };
              }

              // Regular order notification
              return {
                id: order._id,
                title: getNotificationTitle(order.status),
                message: `Đơn hàng ${order._id.substring(
                  0,
                  8
                )}... - ${formatPrice(order.totalPrice || order.total)}`,
                status: order.status,
                type: "order",
                createdAt: order.updatedAt || order.createdAt,
                read: false,
                orderId: order._id,
              };
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setNotifications(orderNotifications);
          setUnreadCount(orderNotifications.filter((n) => !n.read).length);
        } catch (error) {
          // Error fetching notifications
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, [login?.loggedIn]);

  const getNotificationTitle = (status) => {
    switch (status) {
      case 0:
        return "Đơn hàng chờ xác nhận";
      case 1:
        return "Đơn hàng đã xác nhận";
      case 2:
        return "Đơn hàng đang được giao";
      case 3:
        return "Đơn hàng đã giao thành công";
      case 4:
        return "Đơn hàng đã bị hủy";
      default:
        return "Cập nhật đơn hàng";
    }
  };

  const getInstallmentNotificationTitle = (financeStatus) => {
    switch (financeStatus) {
      case "pending":
        return "Hồ sơ trả góp đang chờ duyệt";
      case "approved":
        return "✅ Hồ sơ trả góp đã được duyệt";
      case "rejected":
        return "❌ Hồ sơ trả góp bị từ chối";
      default:
        return "Cập nhật hồ sơ trả góp";
    }
  };

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()}đ` : "0đ";
  };

  const getNotificationIcon = (status, type) => {
    // For installment notifications
    if (type === "installment") {
      switch (status) {
        case "pending":
          return "fas fa-clock";
        case "approved":
          return "fas fa-check-circle";
        case "rejected":
          return "fas fa-times-circle";
        default:
          return "fas fa-credit-card";
      }
    }

    // For regular order notifications
    switch (status) {
      case 0:
        return "fas fa-clock";
      case 1:
        return "fas fa-check";
      case 2:
        return "fas fa-truck";
      case 3:
        return "fas fa-check-circle";
      case 4:
        return "fas fa-times-circle";
      default:
        return "fas fa-bell";
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setSuggestions([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(
        `/products/search?keyword=${encodeURIComponent(keyword.trim())}`
      );
      setIsSearchActive(false);
      setSuggestions([]);
      setKeyword("");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    // Mock search suggestions (replace with actual API call)
    if (value.length > 2) {
      const mockSuggestions = [
        `iPhone ${value}`,
        `Samsung ${value}`,
        `Xiaomi ${value}`,
        `${value} Pro`,
        `${value} Max`,
      ];
      setSuggestions(mockSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await logOutCustomer(login.currentCustomer?._id);
      dispatch(logoutSuccess());
      dispatch(clearCart());
      setIsUserMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={`modern-header ${isScrolled ? "scrolled" : ""} ${
        !isVisible ? "hidden" : ""
      }`}
    >
      {/* Main Header - Simplified like MobileCity */}
      <div className="header-main">
        <div className="container">
          <div className="header-content mobilecity-style">
            {/* Logo */}
            <div className="header-logo">
              <Link to="/" className="logo-link">
                {isScrolled ? (
                  <img
                    src="/images/logo-compact.svg"
                    alt="Phone Store"
                    className="logo-img compact"
                  />
                ) : (
                  <img
                    src="/images/modern-logo.svg"
                    alt="Phone Store"
                    className="logo-img"
                  />
                )}
              </Link>
            </div>

            {/* Search Bar */}
            <div
              className={`header-search ${isSearchActive ? "active" : ""}`}
              ref={searchRef}
            >
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Tìm kiếm điện thoại, phụ kiện..."
                    value={keyword}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchActive(true)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>

                {/* Search Suggestions */}
                {suggestions.length > 0 && (
                  <div className="search-suggestions">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => {
                          setKeyword(suggestion);
                          navigate(
                            `/products/search?keyword=${encodeURIComponent(
                              suggestion
                            )}`
                          );
                          setIsSearchActive(false);
                          setSuggestions([]);
                        }}
                      >
                        <i className="fas fa-search"></i>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* User Actions */}
            <div className="header-actions">
              {/* Notifications */}
              <div
                className={`action-item notification-item ${
                  isNotificationOpen ? "active" : ""
                }`}
                ref={notificationRef}
                onClick={() =>
                  login?.loggedIn && setIsNotificationOpen(!isNotificationOpen)
                }
              >
                <i className="fas fa-bell"></i>
                <span className="action-text">Thông báo</span>
                {login?.loggedIn && unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
                {isNotificationOpen && login?.loggedIn && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h4>Thông báo đơn hàng</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAllAsRead();
                          }}
                          className="mark-all-read"
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`notification-item-content ${
                              !notification.read ? "unread" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                              navigate(`/OrderList`);
                              setIsNotificationOpen(false);
                            }}
                          >
                            <div className="notification-icon">
                              <i
                                className={getNotificationIcon(
                                  notification.status,
                                  notification.type
                                )}
                              ></i>
                            </div>
                            <div className="notification-content">
                              <div className="notification-title">
                                {notification.title}
                              </div>
                              <div className="notification-message">
                                {notification.message}
                              </div>
                              <div className="notification-time">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString("vi-VN")}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-notifications">
                          <i className="fas fa-bell-slash" />
                          <p>Không có thông báo mới</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 5 && (
                      <div className="notification-footer">
                        <button
                          onClick={() => {
                            navigate("/OrderList");
                            setIsNotificationOpen(false);
                          }}
                        >
                          Xem tất cả thông báo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div
                className={`action-item user-menu ${
                  isUserMenuOpen ? "active" : ""
                }`}
                ref={userMenuRef}
              >
                <button
                  className="user-toggle"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <i className="fas fa-user"></i>
                  <span className="action-text">
                    {login?.loggedIn
                      ? login.currentCustomer?.fullName
                      : "Tài khoản"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    {login?.loggedIn ? (
                      <>
                        <Link to="/UserEdit" className="dropdown-item">
                          <i className="fas fa-user-circle"></i>
                          Thông tin cá nhân
                        </Link>
                        <Link to="/OrderList" className="dropdown-item">
                          <i className="fas fa-clipboard-list"></i>
                          Đơn hàng của tôi
                        </Link>
                        <div
                          className="dropdown-item"
                          onClick={() => navigate("/warranty")}
                        >
                          <i className="fas fa-shield-alt"></i>
                          Tra cứu bảo hành
                        </div>
                        <div className="dropdown-divider"></div>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item logout"
                        >
                          <i className="fas fa-sign-out-alt"></i>
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="dropdown-item">
                          <i className="fas fa-sign-in-alt"></i>
                          Đăng nhập
                        </Link>
                        <Link to="/register" className="dropdown-item">
                          <i className="fas fa-user-plus"></i>
                          Đăng ký
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/Cart" className="action-item cart-item">
                <div className="cart-icon-wrapper">
                  <i className="fas fa-shopping-cart"></i>
                  {totalCartItems > 0 && (
                    <span className="cart-count">{totalCartItems}</span>
                  )}
                </div>
                <span className="action-text">Giỏ hàng</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - MobileCity Style */}
      <nav className="header-nav mobilecity-nav">
        <div className="container">
          <div className="nav-content">
            {/* Secondary Links */}
            <div className="nav-secondary">
              <Link to="/news" className="nav-link">
                <span>TIN TỨC</span>
              </Link>
              <Link to="/deals" className="nav-link">
                <span>KHUYẾN MÃI</span>
              </Link>
              <Link to="/warranty" className="nav-link">
                <span>TRA CỨU BH</span>
              </Link>
            </div>

            {/* Main Categories with Icons */}
            <div className="nav-categories-icons horizontal">
              <div className="category-dropdown">
                <button className="category-btn">
                  <i className="fas fa-mobile-alt"></i>
                  <span>Điện thoại</span>
                  <i className="fas fa-chevron-down"></i>
                </button>
                <div className="category-mega-menu">
                  <div className="mega-menu-content grouped simple-text">
                    {/* Nhóm Điện thoại */}
                    <div className="category-group">
                      <div className="group-title">Điện thoại</div>
                      <ul className="category-list">
                        {/* Nút Xem tất cả */}
                        {categoriesLoaded && getCategoryId("Điện thoại") && (
                          <li>
                            <Link
                              to={`/products?category=${getCategoryId(
                                "Điện thoại"
                              )}`}
                              className="category-link view-all"
                            >
                              <i class="fa fa-th-large" aria-hidden="true"></i>
                              Xem tất cả điện thoại
                            </Link>
                          </li>
                        )}
                        {brands
                          .filter((b) =>
                            [
                              "Apple",
                              "Samsung",
                              "Xiaomi",
                              "Oppo",
                              "Vivo",
                              "OnePlus",
                              "Realme",
                              "Nokia",
                              "Asus",
                            ].includes(b.name)
                          )
                          .map((brand) => (
                            <li key={brand._id}>
                              <Link
                                to={`/category/${
                                  brand._id
                                }?categoryId=${getCategoryId("Điện thoại")}`}
                                className="category-link"
                              >
                                {brand.name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet category dropdown - similar to phone */}
              {categoriesLoaded && getCategoryId("Máy tính bảng") && (
                <div className="category-dropdown">
                  <button className="category-btn">
                    <i className="fas fa-tablet-alt"></i>
                    <span>Máy tính bảng</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div className="category-mega-menu">
                    <div className="mega-menu-content grouped simple-text">
                      {/* Nhóm Máy tính bảng */}
                      <div className="category-group">
                        <div className="group-title">Máy tính bảng</div>
                        <ul className="category-list">
                          {/* Nút Xem tất cả */}
                          <li>
                            <Link
                              to={`/products?category=${getCategoryId(
                                "Máy tính bảng"
                              )}`}
                              className="category-link view-all"
                            >
                              <i className="fas fa-th-large"></i>
                              Xem tất cả máy tính bảng
                            </Link>
                          </li>
                          {brands
                            .filter((b) =>
                              [
                                "Apple",
                                "Samsung",
                                "Xiaomi",
                                "Lenovo",
                                "Huawei",
                                "Oppo",
                                "Nokia",
                              ].includes(b.name)
                            )
                            .map((brand) => (
                              <li key={brand._id}>
                                <Link
                                  to={`/category/${
                                    brand._id
                                  }?categoryId=${getCategoryId(
                                    "Máy tính bảng"
                                  )}`}
                                  className="category-link"
                                >
                                  {brand.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Accessory category - only render when categories are loaded */}
              {categoriesLoaded && getCategoryId("Phụ kiện") && (
                <Link
                  to={`/products?category=${getCategoryId("Phụ kiện")}`}
                  className="category-btn"
                >
                  <i className="fas fa-headphones"></i>
                  <span>Phụ kiện</span>
                </Link>
              )}

              <Link to="/support" className="category-btn">
                <i className="fas fa-tools"></i>
                <span>Sửa chữa</span>
              </Link>
            </div>

            {/* Hotline */}
            <div className="nav-hotline">
              <div className="hotline-content">
                <div className="hotline-text">
                  <span className="hotline-label">Hotline</span>
                  <span className="hotline-number">1900 1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="mobile-menu-content">
              <ul className="mobile-nav-list">
                <li>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Điện thoại
                  </Link>
                </li>
                {/* Tablet category - conditional render */}
                {categoriesLoaded && getCategoryId("Máy tính bảng") && (
                  <li>
                    <Link
                      to={`/products?category=${getCategoryId(
                        "Máy tính bảng"
                      )}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Máy tính bảng
                    </Link>
                  </li>
                )}
                {/* Accessory category - conditional render */}
                {categoriesLoaded && getCategoryId("Phụ kiện") && (
                  <li>
                    <Link
                      to={`/products?category=${getCategoryId("Phụ kiện")}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Phụ kiện
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)}>
                    Khuyến mãi
                  </Link>
                </li>
                <li>
                  <Link to="/news" onClick={() => setIsMobileMenuOpen(false)}>
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Hỗ trợ
                  </Link>
                </li>
              </ul>

              <div className="mobile-brands">
                <h4>Thương hiệu</h4>
                <div className="mobile-brands-grid">
                  {brands.map((brand) => (
                    <Link
                      key={brand._id}
                      to={`/category/${brand._id}?categoryId=${getCategoryId(
                        "Điện thoại"
                      )}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ModernHeader;
