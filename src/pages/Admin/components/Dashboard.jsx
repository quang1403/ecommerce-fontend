import React, { useState, useEffect } from "react";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getRevenueByMonth,
  getAllOrdersAdmin,
  getCustomers,
} from "../../../services/Api";
import "../styles/Dashboard.css";
import { getImageProduct } from "../../../shared/utils";
const Dashboard = () => {
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
  const [loading, setLoading] = useState(true);

  // Tính doanh thu theo tháng từ orders
  const calculateMonthlyRevenue = (orders) => {
    const monthlyData = {};
    const currentYear = new Date().getFullYear();

    // Khởi tạo 12 tháng với doanh thu = 0
    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, "0");
      monthlyData[month] = {
        month: `Tháng ${i}`,
        revenue: 0,
        orderCount: 0,
      };
    }

    // Tính doanh thu từ orders của năm hiện tại
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.updatedAt);
      if (orderDate.getFullYear() === currentYear) {
        const month = (orderDate.getMonth() + 1).toString().padStart(2, "0");
        if (monthlyData[month]) {
          const revenue = order.total || order.totalAmount || 0;
          monthlyData[month].revenue += revenue;
          monthlyData[month].orderCount += 1;
        }
      }
    });

    // Lấy 6 tháng gần nhất (bao gồm cả tháng không có dữ liệu)
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const result = [];

    for (let i = 5; i >= 0; i--) {
      let monthNum = currentMonth - i;
      let year = currentYear;

      // Xử lý tháng âm (năm trước)
      if (monthNum <= 0) {
        monthNum = 12 + monthNum;
        year = currentYear - 1;
      }

      const monthKey = monthNum.toString().padStart(2, "0");
      const monthName = `Tháng ${monthNum}`;

      // Luôn thêm tháng vào result, dù có dữ liệu hay không
      const monthData = {
        month: monthName,
        revenue: 0,
        orderCount: 0,
      };

      // Nếu tháng này thuộc năm hiện tại và có dữ liệu
      if (year === currentYear && monthlyData[monthKey]) {
        monthData.revenue = monthlyData[monthKey].revenue;
        monthData.orderCount = monthlyData[monthKey].orderCount;
      }

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
          console.error("❌ getAllOrdersAdmin for revenue failed:", err);
          return { data: null };
        }),
        // Thêm API lấy customers
        getCustomers().catch((err) => {
          console.error("❌ getCustomers failed:", err);
          return { data: null };
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
      if (revenueResponse?.data) {
        const orders = Array.isArray(revenueResponse.data)
          ? revenueResponse.data
          : revenueResponse.data?.orders || [];

        if (orders.length > 0) {
          const monthlyRevenue = calculateMonthlyRevenue(orders);
          setRevenueData(monthlyRevenue);
        }
      }

      // Xử lý dữ liệu customers
      if (customersResponse?.data) {
        const customersData = Array.isArray(customersResponse.data)
          ? customersResponse.data
          : customersResponse.data?.users || customersResponse.data?.data || [];

        setCustomers(customersData);
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
      <div className="dashboard-header">
        <h1>Bảng Điều Khiển</h1>
        <p>Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Thống kê tổng quan */}
      <div className="stats-grid">
        <div className="stat-card stat-orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Tổng doanh thu</p>
          </div>
        </div>

        <div className="stat-card stat-customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Tổng khách hàng</p>
          </div>
        </div>

        <div className="stat-card stat-products">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Tổng sản phẩm</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Đơn hàng chờ xử lý</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Đơn hàng gần đây */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Đơn Hàng Gần Đây</h2>
            <button className="btn-view-all">Xem tất cả</button>
          </div>
          <div className="recent-orders">
            {recentOrders.length > 0 ? (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Tên khách hàng</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Ngày đặt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{getCustomerDisplayName(order.customerId)}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <span
                            className={`status ${getStatusClass(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Sản phẩm bán chạy */}
      <div style={{ marginTop: 16 }} className="dashboard-section">
        <div className="section-header">
          <h2>Sản Phẩm Bán Chạy</h2>
        </div>
        <div className="top-products">
          {topProducts.length > 0 ? (
            <div className="products-list">
              {topProducts.map((item, index) => (
                <div key={item._id} className="product-item">
                  <div className="product-rank">{index + 1}</div>
                  <div className="product-image">
                    {item.product &&
                    Array.isArray(item.product.images) &&
                    item.product.images.length > 0 ? (
                      <img src={getImageProduct(item.product.images[0])} />
                    ) : (
                      <img
                        src={getImageProduct("/images/default.png")}
                        alt="No image"
                      />
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{item.product?.name || "Sản phẩm không xác định"}</h4>
                    <p>Đã bán: {item.totalQuantity || 0} sản phẩm</p>
                    <span
                      className="product-price"
                      title="Tổng doanh thu từ sản phẩm này"
                    >
                      {formatCurrency(item.totalRevenue || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Chưa có dữ liệu sản phẩm</p>
            </div>
          )}
        </div>
      </div>
      {/* Biểu đồ doanh thu */}
      <div className="dashboard-section full-width">
        <div className="section-header">
          <h2>Doanh Thu Theo Tháng</h2>
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
    </div>
  );
};

export default Dashboard;
