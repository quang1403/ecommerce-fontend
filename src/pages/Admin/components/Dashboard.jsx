import React, { useState, useEffect } from "react";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getRevenueByMonth,
  getAllOrdersAdmin,
  getCustomers,
  getCommentsProduct,
  getProducts,
} from "../../../services/Api";
import "../styles/Dashboard.css";
import { getImageProduct } from "../../../shared/utils";

const Dashboard = ({ onNavigateToOrders }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    ordersByStatus: [],
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format thời gian relative (từ Updates.jsx)
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Tạo activities từ đơn hàng (Logic giống Updates.jsx)
  const generateActivities = (orders, users = [], latestComment = null) => {
    const activities = [];

    // Thêm comment mới nhất nếu có
    if (latestComment) {
      activities.push({
        id: `comment-${latestComment._id}`,
        icon: "💬",
        iconClass: "comment-icon",
        text: `${
          latestComment.userId?.fullName ||
          latestComment.userId?.name ||
          latestComment.name ||
          "Khách hàng"
        } đã bình luận về sản phẩm "${
          latestComment.product?.name || "Sản phẩm"
        }"`,
        time: latestComment.createdAt,
      });
    }

    // Lấy tối đa 4 đơn hàng (hoặc 3 nếu có comment)
    const maxOrders = latestComment ? 3 : 4;
    const recentOrders = orders.slice(0, maxOrders);

    recentOrders.forEach((order) => {
      const customerId =
        order.customerId?._id || order.customerId || order.customer?._id;
      const matchedUser = users.find((user) => user._id === customerId);

      const customerName =
        matchedUser?.fullName ||
        matchedUser?.name ||
        order.customer?.fullName ||
        order.customer?.name ||
        order.customerInfo?.fullName ||
        order.customerInfo?.name ||
        order.shippingInfo?.fullName ||
        `Khách hàng #${String(customerId || order._id).slice(-6)}`;

      let message = "";
      let icon = "📦";
      let iconClass = "order-icon";

      switch (order.status) {
        case 0:
          message = "vừa đặt đơn hàng mới";
          icon = "🛒";
          iconClass = "user-icon";
          break;
        case 1:
          message = "đơn hàng đã được xác nhận";
          icon = "✅";
          iconClass = "order-icon";
          break;
        case 2:
          message = "đơn hàng đang được giao";
          icon = "🚚";
          iconClass = "order-icon";
          break;
        case 3:
          message = "đã nhận hàng thành công";
          icon = "📦";
          iconClass = "order-icon";
          break;
        case 4:
          message = "đã hủy đơn hàng";
          icon = "❌";
          iconClass = "order-icon";
          break;
        default:
          message = "có cập nhật đơn hàng";
          icon = "📋";
          iconClass = "order-icon";
      }

      // Format text: "{customerName} {message}"
      activities.push({
        id: order._id,
        icon,
        iconClass,
        text: `${customerName} ${message}`,
        time: order.updatedAt || order.createdAt,
      });
    });

    return activities;
  };

  // Tính doanh thu theo tháng từ orders
  const calculateMonthlyRevenue = (orders) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const result = [];

    // Tạo danh sách 6 tháng gần nhất (bao gồm năm trước nếu cần)
    for (let i = 5; i >= 0; i--) {
      let monthNum = currentMonth - i;
      let year = currentYear;

      // Xử lý tháng âm (năm trước)
      if (monthNum <= 0) {
        monthNum = 12 + monthNum;
        year = currentYear - 1;
      }

      const monthData = {
        month: `Tháng ${monthNum}`,
        revenue: 0,
        orderCount: 0,
      };

      // Tính doanh thu từ orders của tháng này
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt || order.updatedAt);
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1;

        // Chỉ tính các orders thuộc tháng và năm hiện tại đang xét
        if (orderYear === year && orderMonth === monthNum) {
          const revenue = order.total || order.totalAmount || 0;
          monthData.revenue += revenue;
          monthData.orderCount += 1;
        }
      });

      result.push(monthData);
    }

    return result;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Gọi các API thật từ backend
      const [
        statsResponse,
        ordersResponse,
        productsResponse,
        revenueResponse,
        customersResponse,
        allProductsResponse,
      ] = await Promise.all([
        getDashboardStats().catch((err) => {
          console.error(err);
          return { data: null };
        }),
        getRecentOrders(3).catch((err) => {
          console.error(err);
          return { data: null };
        }),
        getTopProducts(3).catch((err) => {
          console.error(err);
          return { data: null };
        }),
        // Sử dụng getAllOrdersAdmin thay vì getRevenueByMonth
        getAllOrdersAdmin().catch((err) => {
          console.error(err);
          return { data: null };
        }),
        // Thêm API lấy customers
        getCustomers().catch((err) => {
          console.error( err);
          return { data: null };
        }),
        // Lấy tất cả products để fetch comments
        getProducts().catch((err) => {
          console.error(err);
          return { data: { data: [] } };
        }),
      ]);

      // Kiểm tra nếu có dữ liệu thật từ API
      if (statsResponse?.data) {
        const statsData = statsResponse.data;
        const pendingOrders =
          statsData.ordersByStatus?.find((item) => item._id === 0)?.count || 0;

        setStats({
          ...statsData,
          pendingOrders,
        });
      }

      if (ordersResponse?.data) {
        setRecentOrders(
          ordersResponse.data?.recentOrders || ordersResponse.data || []
        );
      }

      if (productsResponse?.data) {
        // Xử lý cấu trúc dữ liệu: data.topProducts hoặc data trực tiếp
        const productsData =
          productsResponse.data.topProducts || productsResponse.data || [];
        setTopProducts(productsData);
      }

      // Xử lý dữ liệu doanh thu từ orders
      let ordersForRevenue = [];
      if (revenueResponse?.data) {
        ordersForRevenue = Array.isArray(revenueResponse.data)
          ? revenueResponse.data
          : revenueResponse.data?.orders || [];

        if (ordersForRevenue.length > 0) {
          const monthlyRevenue = calculateMonthlyRevenue(ordersForRevenue);
          setRevenueData(monthlyRevenue);
        }
      }

      // Xử lý dữ liệu customers
      let customersData = [];
      if (customersResponse?.data) {
        customersData = Array.isArray(customersResponse.data)
          ? customersResponse.data
          : customersResponse.data?.users || customersResponse.data?.data || [];

        setCustomers(customersData);
      }

      // Xử lý activities từ orders và comments (Logic từ Updates.jsx)
      if (ordersForRevenue.length > 0) {
        // Sắp xếp orders theo thời gian mới nhất
        const sortedOrders = [...ordersForRevenue].sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        // Lấy bình luận mới nhất từ products
        let latestComment = null;
        const products = Array.isArray(allProductsResponse.data?.data)
          ? allProductsResponse.data.data
          : [];

        for (const product of products.slice(0, 10)) {
          try {
            const res = await getCommentsProduct(product._id);
            const comments = Array.isArray(res.data?.data) ? res.data.data : [];
            if (comments.length > 0) {
              const newest = comments.reduce((a, b) =>
                new Date(a.createdAt) > new Date(b.createdAt) ? a : b
              );
              if (
                !latestComment ||
                new Date(newest.createdAt) > new Date(latestComment.createdAt)
              ) {
                latestComment = { ...newest, product };
              }
            }
          } catch (error) {
            // Bỏ qua lỗi khi lấy comments
          }
        }

        // Tạo activities từ orders và comments
        const activitiesData = generateActivities(
          sortedOrders,
          customersData,
          latestComment
        );
        setActivities(activitiesData);

        // Tính doanh số theo category từ orders và products
        const categoryMap = {};
        // Sử dụng lại biến products đã khai báo ở trên

        sortedOrders.forEach((order) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item) => {
              const product = products.find(
                (p) => p._id === item.productId || p._id === item.productId?._id
              );
              if (product && product.category) {
                const categoryName =
                  typeof product.category === "string"
                    ? product.category
                    : product.category.name || "Khác";

                if (!categoryMap[categoryName]) {
                  categoryMap[categoryName] = 0;
                }
                categoryMap[categoryName] += item.price * item.quantity;
              }
            });
          }
        });

        // Convert to array và sort theo revenue
        const categoryArray = Object.entries(categoryMap)
          .map(([name, revenue]) => ({ name, revenue }))
          .sort((a, b) => b.revenue - a.revenue);

        setCategorySales(categoryArray);
      }

      // Nếu không có dữ liệu nào từ API, dùng fallback
      if (
        !statsResponse?.data &&
        !ordersResponse?.data &&
        !productsResponse?.data &&
        !revenueResponse?.data
      ) {
        throw new Error("Tất cả API đều thất bại");
      }
    } catch (error) {
      console.error("❌ Lỗi tải dữ liệu dashboard:", error);
      console.error("❌ Error details:", error.response?.data);

      // Fallback về dữ liệu mẫu nếu API lỗi
      setStats({
        totalOrders: 1245,
        totalRevenue: 125000000,
        totalUsers: 892,
        totalProducts: 150,
        pendingOrders: 23,
        ordersByStatus: [
          { _id: 0, count: 23 },
          { _id: 1, count: 45 },
          { _id: 3, count: 89 },
          { _id: 4, count: 12 },
        ],
      });

      setRecentOrders([
        {
          _id: "68ce7d37ab4ea50a1dacaddf",
          customerId: {
            _id: "68c9714f670b62ffbd0c2b0f",
            email: "customer1@example.com",
          },
          total: 2500000,
          status: 0,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "68ce8e62d29f82834c89d112",
          customerId: {
            _id: "68cf6a4a062ac74480b07230",
            email: "customer2@example.com",
          },
          total: 1800000,
          status: 1,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: "68ce9f73e40g93945d90e223",
          customerId: {
            _id: "68cf6a4a062ac74480b07231",
            email: "customer3@example.com",
          },
          total: 3200000,
          status: 3,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);

      setTopProducts([
        {
          _id: "68b159a1cbdf49701bb80939",
          name: "iPhone 15 Pro Max 256GB",
          image: "/images/product-1.png",
          totalQuantity: 125,
          totalRevenue: 3125000000,
          price: 25000000, // Giá gốc để fallback
        },
        {
          _id: "68c57181e792d40753d5225d",
          name: "Samsung Galaxy S24 Ultra",
          image: "/images/product-2.png",
          totalQuantity: 98,
          totalRevenue: 2940200000,
          price: 30000000,
        },
        {
          _id: "68b159c8cbdf49701bb8093f",
          name: "Xiaomi 14 Pro",
          image: "/images/product-3.png",
          totalQuantity: 87,
          totalRevenue: 1740000000,
          price: 20000000,
        },
      ]);

      setRevenueData([
        { month: "T1", revenue: 45000000 },
        { month: "T2", revenue: 52000000 },
        { month: "T3", revenue: 38000000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: "Chờ xác nhận",
      1: "Đã xác nhận",
      2: "Đang giao",
      3: "Hoàn thành",
      4: "Đã hủy",
    };
    return statusMap[status] || "Không xác định";
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      0: "status-pending",
      1: "status-confirmed",
      2: "status-shipping",
      3: "status-completed",
      4: "status-cancelled",
    };
    return statusClasses[status] || "status-unknown";
  };

  const getCustomerDisplayName = (customerId) => {
    if (!customerId) return "Khách hàng";

    // Xử lý trường hợp customerId là object với _id
    let customerIdValue = customerId;
    if (typeof customerId === "object" && customerId._id) {
      // Nếu đã có thông tin customer trong object - chỉ dùng fullName
      if (customerId.fullName) return customerId.fullName;
      customerIdValue = customerId._id;
    }

    // Tìm trong danh sách customers đã load từ API
    if (customers.length > 0) {
      const customerData = customers.find(
        (customer) => customer._id === customerIdValue
      );
      if (customerData) {
        // Chỉ dùng fullName, không fallback sang name hay email
        if (customerData.fullName) return customerData.fullName;
      } else {
        console.log("❌ Không tìm thấy customer với ID:", customerIdValue);
      }
    } else {
      console.log("📋 Customers list empty:", customers.length);
    }

    return "Khách hàng";
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header với Welcome Message */}
      <div className="dashboard-header">
        <div>
          <h1>Bảng điều khiển</h1>
          <p>Chào mừng trở lại! Đây là tình hình hôm nay.</p>
        </div>
      </div>

      {/* Thống kê tổng quan - 4 cards */}
      <div className="stats-grid-nexus">
        <div className="stat-card-nexus stat-revenue">
          <div className="stat-header-nexus">
            <span className="stat-label">Tổng doanh thu</span>
            <span className="stat-icon-nexus">💵</span>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-trend positive"></div>
          <div className="stat-progress">
            <div className="progress-bar revenue-bar"></div>
          </div>
        </div>

        <div className="stat-card-nexus stat-users">
          <div className="stat-header-nexus">
            <span className="stat-label">Người dùng hoạt động</span>
            <span className="stat-icon-nexus">👥</span>
          </div>
          <div className="stat-value">
            {stats.totalUsers?.toLocaleString() || "8,549"}
          </div>
          <div className="stat-trend positive"></div>
          <div className="stat-progress">
            <div className="progress-bar users-bar"></div>
          </div>
        </div>

        <div className="stat-card-nexus stat-orders">
          <div className="stat-header-nexus">
            <span className="stat-label">Tổng đơn hàng</span>
            <span className="stat-icon-nexus">🛍</span>
          </div>
          <div className="stat-value">
            {stats.totalOrders?.toLocaleString() || "2,847"}
          </div>

          <div className="stat-progress">
            <div className="progress-bar orders-bar"></div>
          </div>
        </div>

        <div className="stat-card-nexus stat-pageviews">
          <div className="stat-header-nexus">
            <span className="stat-label">Lượt xem trang</span>
            <span className="stat-icon-nexus">👁️</span>
          </div>
          <div className="stat-value">45,892</div>

          <div className="stat-progress">
            <div className="progress-bar pageviews-bar"></div>
          </div>
        </div>
      </div>

      {/* 2 cột: Revenue Overview và Sales by Category */}
      <div className="dashboard-grid-2col">
        {/* Revenue Overview - Chart */}
        <div className="dashboard-section revenue-overview">
          <div className="section-header">
            <div>
              <h2>Doanh thu theo tháng</h2>
              <p className="section-subtitle">6 tháng gần nhất</p>
            </div>
          </div>

          <div className="revenue-chart">
            {revenueData.length > 0 ? (
              <div className="chart-container">
                {revenueData.map((item, index) => {
                  const maxRevenue = Math.max(
                    ...revenueData.map((d) => d.revenue)
                  );
                  const barHeight =
                    maxRevenue === 0
                      ? 20
                      : Math.max(5, (item.revenue / maxRevenue) * 200);

                  const tooltipText = `${item.month}: ${formatCurrency(
                    item.revenue
                  )} (${item.orderCount} đơn hàng)`;

                  return (
                    <div
                      key={`${item.month}-${index}`}
                      className="chart-bar"
                      data-tooltip={tooltipText}
                      title={tooltipText}
                    >
                      <div
                        className="bar"
                        style={{
                          height: `${barHeight}px`,
                          minHeight: "5px",
                        }}
                      ></div>
                      <div className="bar-label">
                        <span className="month">{item.month}</span>
                        <span className="amount">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </div>

        {/* Sales by Category - Pie Chart */}
        <div className="dashboard-section sales-category">
          <div className="section-header">
            <div>
              <h2>Doanh số theo danh mục</h2>
              <p className="section-subtitle">Phân phối sản phẩm</p>
            </div>
          </div>

          <div className="pie-chart-container">
            {categorySales.length > 0 ? (
              <>
                <div className="pie-chart">
                  <svg viewBox="0 0 100 100" className="donut">
                    {(() => {
                      const totalRevenue = categorySales.reduce(
                        (sum, cat) => sum + cat.revenue,
                        0
                      );
                      const colors = [
                        "#667eea",
                        "#8b5cf6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#06b6d4",
                      ];
                      const circumference = 2 * Math.PI * 40;
                      let currentOffset = 0;

                      return categorySales.slice(0, 6).map((cat, index) => {
                        const percentage = (cat.revenue / totalRevenue) * 100;
                        const dashArray = (percentage / 100) * circumference;
                        const circle = (
                          <circle
                            key={cat.name}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={colors[index % colors.length]}
                            strokeWidth="20"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={-currentOffset}
                            transform="rotate(-90 50 50)"
                          ></circle>
                        );
                        currentOffset += dashArray;
                        return circle;
                      });
                    })()}
                  </svg>
                </div>

                <div className="category-legend">
                  {(() => {
                    const totalRevenue = categorySales.reduce(
                      (sum, cat) => sum + cat.revenue,
                      0
                    );
                    const colors = [
                      "#667eea",
                      "#8b5cf6",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                      "#06b6d4",
                    ];

                    return categorySales.slice(0, 6).map((cat, index) => {
                      const percentage = (
                        (cat.revenue / totalRevenue) *
                        100
                      ).toFixed(1);
                      return (
                        <div key={cat.name} className="legend-row">
                          <span
                            className="legend-dot"
                            style={{
                              background: colors[index % colors.length],
                            }}
                          ></span>
                          <span className="legend-label">{cat.name}</span>
                          <span className="legend-value">{percentage}%</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu danh mục</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 2 sections: Recent Orders và Activity Feed */}
      <div className="dashboard-grid-2col">
        {/* Recent Orders */}
        <div className="dashboard-section recent-orders-nexus">
          <div className="section-header">
            <h2>Đơn hàng gần đây</h2>
            <button className="btn-view-all-nexus" onClick={onNavigateToOrders}>
              Xem tất cả
            </button>
          </div>

          <div className="orders-table-nexus">
            {recentOrders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{getCustomerDisplayName(order.customerId)}</td>
                      <td>Sản phẩm</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span
                          className={`status-badge-nexus ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="dashboard-section activity-feed">
          <div className="section-header">
            <h2>Hoạt động gần đây</h2>
          </div>

          <div className="activity-list">
            {activities.length === 0 ? (
              <div className="no-activities">
                <span>Không có hoạt động nào</span>
              </div>
            ) : (
              activities.map((activity) => (
                <div className="activity-item" key={activity.id}>
                  <div className={`activity-icon ${activity.iconClass}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{activity.text}</strong>
                    </p>
                    <span className="activity-time">
                      {formatTimeAgo(activity.time)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
