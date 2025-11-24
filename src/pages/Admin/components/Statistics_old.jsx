import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  getDashboardStats,
  getRevenueByMonth,
  getRevenueAnalytics,
  getTopProducts,
  getAllOrdersAdmin,
  getCustomers,
  getTrendAnalytics,
  getProductAnalytics,
  getCustomerBehaviorAnalytics,
} from "../../../services/Api";
import "../styles/Statistics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("month");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    ordersByStatus: [],
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState({});
  const [orderStatusTrendData, setOrderStatusTrendData] = useState(null);
  const [productAnalytics, setProductAnalytics] = useState([]);
  const [customerBehavior, setCustomerBehavior] = useState(null);
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' or 'cards'
  const [productDisplayLimit, setProductDisplayLimit] = useState(10);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [monthlyGrowth, setMonthlyGrowth] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
  });

  const processOrderStatusTrend = (trendArr) => {
    const statusLabels = {
      0: "Chờ xử lý",
      1: "Đang xử lý",
      2: "Đã gửi",
      3: "Đã giao",
      4: "Đã hủy",
    };

    const monthsSet = new Set();
    trendArr.forEach((item) => {
      if (item._id && item._id.month && item._id.year) {
        monthsSet.add(`${item._id.year}-${item._id.month}`);
      }
    });
    const monthsArr = Array.from(monthsSet).sort();

    const statusKeys = [0, 1, 2, 3, 4];
    const datasets = statusKeys.map((status) => ({
      label: statusLabels[status],
      data: monthsArr.map((monthStr) => {
        const found = trendArr.find(
          (item) =>
            `${item._id.year}-${item._id.month}` === monthStr &&
            item._id.status === status
        );
        return found ? found.count : 0;
      }),
      backgroundColor:
        status === 0
          ? "#FF6384"
          : status === 1
          ? "#36A2EB"
          : status === 2
          ? "#FFCE56"
          : status === 3
          ? "#4BC0C0"
          : status === 4
          ? "#FF9F40"
          : "#ccc",
      stack: "orderStatus",
    }));

    return {
      labels: monthsArr.map((m) => {
        const [year, month] = m.split("-");
        return `Tháng ${month}/${year}`;
      }),
      datasets,
    };
  };

  useEffect(() => {
    fetchStatisticsData();
  }, [timeFilter]);

  const fetchStatisticsData = async () => {
    let trendsResponse = { data: {} };
    try {
      trendsResponse = await getTrendAnalytics({ months: 6 });
    } catch (err) {
      console.error("❌ getTrendAnalytics error:", err);
    }

    if (
      trendsResponse.data &&
      Array.isArray(trendsResponse.data.orderStatusTrend)
    ) {
      setOrderStatusTrendData(
        processOrderStatusTrend(trendsResponse.data.orderStatusTrend)
      );
    } else {
      setOrderStatusTrendData(null);
    }

    try {
      setLoading(true);

      const [
        dashboardResponse,
        revenueResponse,
        analyticsResponse,
        topProductsResponse,
        ordersResponse,
        customersResponse,
        productAnalyticsResponse,
        customerBehaviorResponse,
      ] = await Promise.all([
        getDashboardStats().catch(() => ({ data: null })),
        getRevenueByMonth().catch(() => ({ data: [] })),
        getRevenueAnalytics().catch(() => ({ data: null })),
        getTopProducts(10).catch(() => ({ data: [] })),
        getAllOrdersAdmin().catch(() => ({ data: [] })),
        getCustomers().catch(() => ({ data: [] })),
        getProductAnalytics({
          startDate: selectedDateRange.startDate,
          endDate: selectedDateRange.endDate,
        }).catch(() => ({ data: [] })),
        getCustomerBehaviorAnalytics().catch(() => ({ data: null })),
      ]);

      const analyticsData = analyticsResponse.data?.revenueAnalytics || [];
      const totalAnalyticsRevenue = analyticsData.reduce(
        (sum, item) => sum + (item.totalRevenue || 0),
        0
      );
      const totalAnalyticsOrders = analyticsData.reduce(
        (sum, item) => sum + (item.orderCount || 0),
        0
      );

      if (dashboardResponse.data) {
        setStats({
          totalOrders:
            totalAnalyticsOrders || dashboardResponse.data.totalOrders || 0,
          totalRevenue:
            totalAnalyticsRevenue || dashboardResponse.data.totalRevenue || 0,
          totalUsers:
            dashboardResponse.data.totalUsers ||
            customersResponse.data?.length ||
            0,
          totalProducts: dashboardResponse.data.totalProducts || 0,
          ordersByStatus: dashboardResponse.data.ordersByStatus || [],
        });
      }

      processRevenueData(
        analyticsResponse.data?.revenueAnalytics || revenueResponse.data || [],
        ordersResponse.data || []
      );

      setTopProducts(
        Array.isArray(topProductsResponse.data) ? topProductsResponse.data : []
      );

      setProductAnalytics(
        Array.isArray(productAnalyticsResponse.data?.productConversion)
          ? productAnalyticsResponse.data.productConversion
          : []
      );

      setCustomerBehavior(customerBehaviorResponse.data || null);

      processOrderStatusData(
        Array.isArray(ordersResponse.data) ? ordersResponse.data : []
      );

      calculateGrowthRates(
        Array.isArray(ordersResponse.data) ? ordersResponse.data : [],
        Array.isArray(customersResponse.data) ? customersResponse.data : []
      );
    } catch (error) {
      console.error("🚨 Lỗi khi tải dữ liệu thống kê:", error);
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        ordersByStatus: [],
      });
      setRevenueData([]);
      setTopProducts([]);
      setOrderStatusData({});
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (apiRevenueData, orders) => {
    const monthlyData = {};
    const currentYear = new Date().getFullYear();

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        month: `Tháng ${i}`,
        revenue: 0,
        orderCount: 0,
      };
    }

    if (apiRevenueData && apiRevenueData.length > 0) {
      apiRevenueData.forEach((item) => {
        if (item._id && item._id.year === currentYear) {
          const month = item._id.month;
          monthlyData[month] = {
            month: `Tháng ${month}`,
            revenue: item.totalRevenue || 0,
            orderCount: item.orderCount || 0,
          };
        }
      });
    } else {
      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt || order.updatedAt);
        if (
          orderDate.getFullYear() === currentYear &&
          order.status === "delivered"
        ) {
          const month = orderDate.getMonth() + 1;
          monthlyData[month].revenue += order.total || order.totalAmount || 0;
          monthlyData[month].orderCount += 1;
        }
      });
    }
    setRevenueData(Object.values(monthlyData));
  };

  const processOrderStatusData = (orders) => {
    const statusCounts = {};
    const statusLabels = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đã gửi",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };

    orders.forEach((order) => {
      const status = order.status || "pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    setOrderStatusData({
      labels: Object.keys(statusCounts).map(
        (status) => statusLabels[status] || status
      ),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF9F40",
          ],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    });
  };

  const calculateGrowthRates = (orders, customers) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const deliveredThisMonth = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear &&
        order.status === "delivered"
      );
    });
    const thisMonthRevenue = deliveredThisMonth.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const thisMonthOrders = deliveredThisMonth.length;

    const deliveredLastMonth = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        orderDate.getMonth() === lastMonth &&
        orderDate.getFullYear() === lastMonthYear &&
        order.status === "delivered"
      );
    });

    const lastMonthRevenue = deliveredLastMonth.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );
    const lastMonthOrders = deliveredLastMonth.length;

    const customersThisMonth = customers.filter((customer) => {
      const createdDate = new Date(customer.createdAt);
      return (
        createdDate.getMonth() === currentMonth &&
        createdDate.getFullYear() === currentYear
      );
    }).length;

    const customersLastMonth = customers.filter((customer) => {
      const createdDate = new Date(customer.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return (
        createdDate.getMonth() === lastMonth &&
        createdDate.getFullYear() === lastMonthYear
      );
    }).length;

    const revenueGrowth =
      lastMonthRevenue === 0
        ? 100
        : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    const ordersGrowth =
      lastMonthOrders === 0
        ? 100
        : ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
    const customersGrowth =
      customersLastMonth === 0
        ? 100
        : ((customersThisMonth - customersLastMonth) / customersLastMonth) *
          100;

    setMonthlyGrowth({
      revenue: Math.round(revenueGrowth * 10) / 10,
      orders: Math.round(ordersGrowth * 10) / 10,
      customers: Math.round(customersGrowth * 10) / 10,
    });
  };

  const getPerformanceClass = (performance) => {
    if (!performance || performance === "unknown") return "neutral";
    if (performance === "excellent" || performance === "good")
      return "positive";
    if (performance === "poor" || performance === "very_poor")
      return "negative";
    return "neutral";
  };

  const getPerformanceText = (performance) => {
    switch (performance) {
      case "excellent":
        return "🌟 Xuất sắc";
      case "good":
        return "👍 Tốt";
      case "average":
        return "📊 Trung bình";
      case "poor":
        return "📉 Kém";
      case "very_poor":
        return "❌ Rất kém";
      default:
        return "❓ Chưa đánh giá";
    }
  };

  const getSegmentName = (segment) => {
    switch (segment) {
      case "vip":
        return "🌟 VIP";
      case "loyal":
        return "💎 Khách hàng thân thiết";
      case "regular":
        return "👤 Khách hàng thường xuyên";
      case "new":
        return "🆕 Khách hàng mới";
      case "inactive":
        return "😴 Không hoạt động";
      case "at_risk":
        return "⚠️ Có nguy cơ rời bỏ";
      default:
        return segment;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const revenueChartData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData.map((item) => item.revenue),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topProductsChartData = {
    labels: Array.isArray(topProducts)
      ? topProducts.slice(0, 5).map((product) => product.name)
      : [],
    datasets: [
      {
        label: "Số lượng bán",
        data: Array.isArray(topProducts)
          ? topProducts.slice(0, 5).map((product) => product.soldQuantity)
          : [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#FF9F40",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="statistics-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu thống kê...</p>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      {/* Header */}
      <div className="statistics-header">
        <h1>📊 Thống kê & Báo cáo</h1>
        <div className="time-filter">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="statistics-kpi-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h3>Tổng doanh thu</h3>
            <p className="kpi-value">{formatCurrency(stats.totalRevenue)}</p>
            <span
              className={`kpi-growth ${
                monthlyGrowth.revenue >= 0 ? "positive" : "negative"
              }`}
            >
              {monthlyGrowth.revenue >= 0 ? "↗" : "↘"}{" "}
              {Math.abs(monthlyGrowth.revenue)}%
            </span>
          </div>
        </div>

        <div className="kpi-card orders">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <h3>Đơn hàng</h3>
            <p className="kpi-value">{stats.totalOrders}</p>
            <span
              className={`kpi-growth ${
                monthlyGrowth.orders >= 0 ? "positive" : "negative"
              }`}
            >
              {monthlyGrowth.orders >= 0 ? "↗" : "↘"}{" "}
              {Math.abs(monthlyGrowth.orders)}%
            </span>
          </div>
        </div>

        <div className="kpi-card customers">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>Khách hàng</h3>
            <p className="kpi-value">{stats.totalUsers}</p>
            <span
              className={`kpi-growth ${
                monthlyGrowth.customers >= 0 ? "positive" : "negative"
              }`}
            >
              {monthlyGrowth.customers >= 0 ? "↗" : "↘"}{" "}
              {Math.abs(monthlyGrowth.customers)}%
            </span>
          </div>
        </div>

        <div className="kpi-card products">
          <div className="kpi-icon">📱</div>
          <div className="kpi-content">
            <h3>Sản phẩm</h3>
            <p className="kpi-value">{stats.totalProducts}</p>
            <span className="kpi-growth neutral">— 0%</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="statistics-charts-grid">
        {/* Biểu đồ doanh thu */}
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3>📈 Doanh thu theo tháng</h3>
          </div>
          <div className="chart-content">
            {revenueData && revenueData.length > 0 ? (
              <Line
                data={revenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `Doanh thu: ${formatCurrency(context.parsed.y || 0)}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value || 0),
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="no-data">
                {loading ? "Đang tải..." : "Không có dữ liệu doanh thu"}
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ trạng thái đơn hàng */}
        <div className="chart-card order-status-chart">
          <div className="chart-header">
            <h3>📊 Trạng thái đơn hàng</h3>
          </div>
          <div className="chart-content">
            {orderStatusData && orderStatusData.labels?.length > 0 ? (
              <Doughnut
                data={orderStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.label}: ${context.parsed} đơn`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="no-data">
                Không có dữ liệu trạng thái đơn hàng
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ trạng thái đơn hàng theo tháng */}
        <div className="chart-card order-status-trend-chart">
          <div className="chart-header">
            <h3>🔄 Trạng thái đơn hàng theo tháng</h3>
          </div>
          <div className="chart-content">
            {orderStatusTrendData ? (
              <Bar
                data={orderStatusTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {},
                  },
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true },
                  },
                }}
              />
            ) : (
              <div className="no-data">
                {loading
                  ? "Đang tải..."
                  : "Không có dữ liệu trạng thái đơn hàng"}
              </div>
            )}
          </div>
        </div>

        {/* Top sản phẩm bán chạy */}
        <div className="chart-card top-products-chart">
          <div className="chart-header">
            <h3>🏆 Top sản phẩm bán chạy</h3>
          </div>
          <div className="chart-content">
            {Array.isArray(topProducts) && topProducts.length > 0 ? (
              <Bar
                data={topProductsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            ) : (
              <div className="no-data">Không có dữ liệu sản phẩm</div>
            )}
          </div>
        </div>

        {/* Thống kê sản phẩm bán chạy */}
        <div className="chart-card product-analytics">
          <div className="chart-header">
            <h3>📊 Thống kê sản phẩm bán chạy</h3>
          </div>
          <div className="chart-content">
            {Array.isArray(topProducts) && topProducts.length > 0 ? (
              <div className="row">
                {topProducts.slice(0, 6).map((item, idx) => (
                  <div
                    className="col-md-4 col-12 mb-3"
                    key={item.productId || idx}
                  >
                    <div className="card h-100 border-info">
                      <div className="card-body d-flex flex-column align-items-center">
                        <img
                          src={item.imageUrl || "/images/product-1.png"}
                          alt={item.productName || item.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                            marginBottom: 10,
                          }}
                        />
                        <h6 className="card-title text-center mb-2">
                          {item.productName || item.name}
                        </h6>
                        <div className="mb-1">
                          <strong>Đã bán:</strong> {item.soldQuantity || 0}
                        </div>
                        <div className="mb-1">
                          <strong>Doanh thu:</strong>{" "}
                          {formatCurrency(item.revenue || 0)}
                        </div>
                        <div className="mb-1">
                          <strong>Giá bán:</strong>{" "}
                          {formatCurrency(item.price || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted">
                Không có dữ liệu sản phẩm bán chạy.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phân tích chi tiết sản phẩm */}
      <div className="statistics-detailed-analysis">
        <div className="detailed-analysis-header">
          <h2>🔍 Phân tích chi tiết sản phẩm</h2>
          <div className="analysis-controls">
            <div className="date-filter-controls">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={selectedDateRange.startDate}
                onChange={(e) =>
                  setSelectedDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="date-input"
              />
              <label>Đến ngày:</label>
              <input
                type="date"
                value={selectedDateRange.endDate}
                onChange={(e) =>
                  setSelectedDateRange((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="date-input"
              />
              <button onClick={fetchStatisticsData} className="btn btn-primary">
                🔄 Cập nhật
              </button>
            </div>
            <div className="view-controls">
              <select 
                value={productDisplayLimit} 
                onChange={(e) => setProductDisplayLimit(Number(e.target.value))}
                className="limit-select"
              >
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
                <option value={-1}>Tất cả</option>
              </select>
              <button 
                onClick={() => setProductViewMode(productViewMode === 'table' ? 'cards' : 'table')}
                className="btn btn-secondary"
              >
                {productViewMode === 'table' ? '📊 Xem dạng thẻ' : '📋 Xem dạng bảng'}
              </button>
            </div>
          </div>
        </div>

        {Array.isArray(productAnalytics) && productAnalytics.length > 0 ? (
          <div className="product-analytics-content">
            {productViewMode === 'table' ? (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Doanh thu</th>
                      <th>Đã bán</th>
                      <th>Giá</th>
                      <th>Kho</th>
                      <th>Đánh giá</th>
                      <th>Nổi bật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(productDisplayLimit === -1 ? productAnalytics : productAnalytics.slice(0, productDisplayLimit))
                      .map((product, index) => (
                      <tr key={product._id || index}>
                        <td>
                          <img
                            src={product.images && product.images[0] ? product.images[0] : "/images/product-1.png"}
                            alt={product.name}
                            className="table-product-image"
                          />
                        </td>
                        <td>
                          <div className="table-product-info">
                            <span className="table-product-name">{product.name}</span>
                            <span className="table-product-brand">{product.brand || "N/A"}</span>
                          </div>
                        </td>
                        <td className="revenue-cell">{formatCurrency(product.totalRevenue || 0)}</td>
                        <td className="quantity-cell">{product.totalSold || product.sold || 0}</td>
                        <td className="price-cell">{formatCurrency(product.price || 0)}</td>
                        <td className="stock-cell">{product.stock || 0}</td>
                        <td className="rating-cell">
                          {product.rating ? (
                            <span className="rating-stars">
                              {'⭐'.repeat(Math.floor(product.rating))} {product.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="no-rating">Chưa có</span>
                          )}
                        </td>
                        <td className="featured-cell">
                          <span className={`featured-badge ${product.featured ? 'featured' : 'not-featured'}`}>
                            {product.featured ? '✅' : '❌'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="detailed-products-grid">
                {(productDisplayLimit === -1 ? productAnalytics : productAnalytics.slice(0, productDisplayLimit))
                  .map((product, index) => (
                  <div key={product._id || index} className="detailed-product-card compact">
                    <div className="product-header">
                      <img
                        src={product.images && product.images[0] ? product.images[0] : "/images/product-1.png"}
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-category">{product.brand || "Không phân loại"}</p>
                      </div>
                    </div>
                    <div className="product-metrics compact">
                      <div className="metric-row">
                        <span className="metric-label">💰 Doanh thu:</span>
                        <span className="metric-value revenue">{formatCurrency(product.totalRevenue || 0)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">📦 Đã bán:</span>
                        <span className="metric-value quantity">{product.totalSold || product.sold || 0}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">💰 Giá:</span>
                        <span className="metric-value price">{formatCurrency(product.price || 0)}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">⭐ Đánh giá:</span>
                        <span className="metric-value rating">
                          {product.rating ? `${product.rating}/5` : "Chưa có"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {productDisplayLimit !== -1 && productAnalytics.length > productDisplayLimit && (
              <div className="products-pagination">
                <p className="pagination-info">
                  Hiển thị {productDisplayLimit} / {productAnalytics.length} sản phẩm
                </p>
                <button 
                  onClick={() => setProductDisplayLimit(-1)}
                  className="btn btn-outline"
                >
                  Xem tất cả ({productAnalytics.length} sản phẩm)
                </button>
              </div>
            )}
          </div>
              <div key={product._id || index} className="detailed-product-card">
                <div className="product-header">
                  <img
                    src={
                      product.images && product.images[0]
                        ? product.images[0]
                        : "/images/product-1.png"
                    }
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">
                      {product.brand || "Không phân loại"}
                    </p>
                  </div>
                </div>

                <div className="product-metrics">
                  <div className="metric-row">
                    <span className="metric-label">💰 Tổng doanh thu:</span>
                    <span className="metric-value revenue">
                      {formatCurrency(product.totalRevenue || 0)}
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">📦 Số lượng bán:</span>
                    <span className="metric-value quantity">
                      {product.totalSold || product.sold || 0}
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">� Giá gốc:</span>
                    <span className="metric-value price">
                      {formatCurrency(product.price || 0)}
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">� Còn lại:</span>
                    <span className="metric-value stock">
                      {product.stock || 0}
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">⭐ Đánh giá TB:</span>
                    <span className="metric-value rating">
                      {product.rating ? `${product.rating}/5` : "Chưa có"}
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">🏷️ Giảm giá:</span>
                    <span className="metric-value discount">
                      {product.discount ? `${product.discount}%` : "Không"}
                    </span>
                  </div>

                  <div className="metric-row">
                    <span className="metric-label">� Nổi bật:</span>
                    <span
                      className={`metric-value featured ${
                        product.featured ? "positive" : "neutral"
                      }`}
                    >
                      {product.featured ? "✅ Có" : "❌ Không"}
                    </span>
                  </div>
                </div>

                {product.variants && product.variants.length > 0 && (
                  <div className="product-variants">
                    <h5>� Phiên bản có sẵn</h5>
                    <div className="variants-list">
                      {product.variants.map((variant, idx) => (
                        <div key={idx} className="variant-item">
                          <span className="variant-specs">
                            {variant.ram}GB RAM / {variant.storage}GB
                          </span>
                          <span className="variant-price">
                            {formatCurrency(variant.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(product.chipset || product.ram || product.storage) && (
                  <div className="product-specs">
                    <h5>⚙️ Thông số kỹ thuật</h5>
                    <div className="specs-grid">
                      {product.chipset && (
                        <div className="spec-item">
                          <span className="spec-label">Chip:</span>
                          <span className="spec-value">{product.chipset}</span>
                        </div>
                      )}
                      {product.ram && (
                        <div className="spec-item">
                          <span className="spec-label">RAM:</span>
                          <span className="spec-value">{product.ram}GB</span>
                        </div>
                      )}
                      {product.storage && (
                        <div className="spec-item">
                          <span className="spec-label">Bộ nhớ:</span>
                          <span className="spec-value">
                            {product.storage}GB
                          </span>
                        </div>
                      )}
                      {product.battery && (
                        <div className="spec-item">
                          <span className="spec-label">Pin:</span>
                          <span className="spec-value">
                            {product.battery}mAh
                          </span>
                        </div>
        ) : (
          <div className="no-detailed-data">
            <div className="no-data-icon">📊</div>
            <h3>Không có dữ liệu phân tích chi tiết</h3>
            <p>
              Hãy thử thay đổi khoảng thời gian hoặc kiểm tra lại dữ liệu sản
              phẩm.
            </p>
          </div>
        )}
      </div>

      {/* Phân tích hành vi khách hàng */}
      <div className="statistics-customer-behavior">
        <div className="customer-behavior-header">
          <h2>👥 Phân tích hành vi khách hàng</h2>
        </div>

        {customerBehavior ? (
          <div className="customer-behavior-content">
            <div className="behavior-metrics-grid">
              {/* Customer Segments */}
              {customerBehavior.customerSegments && (
                <div className="behavior-card customer-segments">
                  <div className="behavior-card-header">
                    <h3>🎯 Phân khúc khách hàng</h3>
                  </div>
                  <div className="segments-list">
                    {Object.entries(customerBehavior.customerSegments).map(
                      ([segment, data]) => (
                        <div key={segment} className="segment-item">
                          <div className="segment-info">
                            <span className="segment-name">
                              {getSegmentName(segment)}
                            </span>
                            <span className="segment-count">
                              {data.count || 0} khách hàng
                            </span>
                          </div>
                          <div className="segment-stats">
                            <span className="segment-revenue">
                              {formatCurrency(data.totalRevenue || 0)}
                            </span>
                            <span className="segment-percentage">
                              {data.percentage
                                ? `${data.percentage.toFixed(1)}%`
                                : "0%"}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Purchase Patterns */}
              {customerBehavior.purchasePatterns && (
                <div className="behavior-card purchase-patterns">
                  <div className="behavior-card-header">
                    <h3>🛒 Mẫu mua hàng</h3>
                  </div>
                  <div className="patterns-grid">
                    <div className="pattern-metric">
                      <span className="metric-icon">📅</span>
                      <div className="metric-info">
                        <span className="metric-label">
                          Tần suất mua trung bình
                        </span>
                        <span className="metric-value">
                          {customerBehavior.purchasePatterns.averageFrequency ||
                            0}{" "}
                          lần/tháng
                        </span>
                      </div>
                    </div>
                    <div className="pattern-metric">
                      <span className="metric-icon">💰</span>
                      <div className="metric-info">
                        <span className="metric-label">
                          Giá trị đơn hàng TB
                        </span>
                        <span className="metric-value">
                          {formatCurrency(
                            customerBehavior.purchasePatterns
                              .averageOrderValue || 0
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="pattern-metric">
                      <span className="metric-icon">🔄</span>
                      <div className="metric-info">
                        <span className="metric-label">Tỷ lệ mua lại</span>
                        <span className="metric-value">
                          {customerBehavior.purchasePatterns.repeatPurchaseRate
                            ? `${(
                                customerBehavior.purchasePatterns
                                  .repeatPurchaseRate * 100
                              ).toFixed(1)}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Customers */}
              {customerBehavior.topCustomers &&
                customerBehavior.topCustomers.length > 0 && (
                  <div className="behavior-card top-customers">
                    <div className="behavior-card-header">
                      <h3>🌟 Khách hàng VIP</h3>
                    </div>
                    <div className="top-customers-list">
                      {customerBehavior.topCustomers
                        .slice(0, 5)
                        .map((customer, index) => (
                          <div
                            key={customer._id || index}
                            className="customer-item"
                          >
                            <div className="customer-rank">#{index + 1}</div>
                            <div className="customer-info">
                              <span className="customer-name">
                                {customer.name ||
                                  customer.email ||
                                  "Khách hàng ẩn danh"}
                              </span>
                              <span className="customer-stats">
                                {customer.orderCount || 0} đơn •{" "}
                                {formatCurrency(customer.totalSpent || 0)}
                              </span>
                            </div>
                            <div className="customer-badge">
                              <span className="vip-badge">VIP</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Customer Lifetime Value */}
              {customerBehavior.lifetimeValue && (
                <div className="behavior-card lifetime-value">
                  <div className="behavior-card-header">
                    <h3>💎 Giá trị khách hàng</h3>
                  </div>
                  <div className="lifetime-metrics">
                    <div className="ltv-metric">
                      <span className="ltv-label">CLV Trung bình</span>
                      <span className="ltv-value">
                        {formatCurrency(
                          customerBehavior.lifetimeValue.average || 0
                        )}
                      </span>
                    </div>
                    <div className="ltv-metric">
                      <span className="ltv-label">CLV Cao nhất</span>
                      <span className="ltv-value">
                        {formatCurrency(
                          customerBehavior.lifetimeValue.highest || 0
                        )}
                      </span>
                    </div>
                    <div className="ltv-metric">
                      <span className="ltv-label">Thời gian giữ chân TB</span>
                      <span className="ltv-value">
                        {customerBehavior.lifetimeValue.averageRetentionDays ||
                          0}{" "}
                        ngày
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Geographic Distribution */}
              {customerBehavior.geographicDistribution && (
                <div className="behavior-card geographic-distribution">
                  <div className="behavior-card-header">
                    <h3>🌍 Phân bố địa lý</h3>
                  </div>
                  <div className="geo-list">
                    {Object.entries(customerBehavior.geographicDistribution)
                      .sort(([, a], [, b]) => b.count - a.count)
                      .slice(0, 5)
                      .map(([location, data]) => (
                        <div key={location} className="geo-item">
                          <span className="geo-location">{location}</span>
                          <div className="geo-stats">
                            <span className="geo-count">
                              {data.count || 0} KH
                            </span>
                            <span className="geo-revenue">
                              {formatCurrency(data.revenue || 0)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-behavior-data">
            <div className="no-data-icon">👥</div>
            <h3>Không có dữ liệu hành vi khách hàng</h3>
            <p>Dữ liệu hành vi khách hàng đang được xử lý hoặc chưa có sẵn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
