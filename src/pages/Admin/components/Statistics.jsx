import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
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
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  getDashboardStats,
  getRevenueByMonth,
  getRevenueAnalytics,
  getAllOrdersAdmin,
  getCustomers,
  getTrendAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
} from "../../../services/Api";
import { getImageProduct } from "../../../shared/utils";
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
  ArcElement,
  Filler
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

  // Hàm convert timeFilter thành date range và groupBy cho backend APIs
  const getAnalyticsParams = (timeFilter) => {
    const now = new Date();
    let startDate, endDate, groupBy;

    switch (timeFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        groupBy = "day";
        break;

      case "week":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Chủ nhật đầu tuần
        startDate = weekStart;
        endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 7);
        groupBy = "day";
        break;

      case "month":
        // Lấy từ đầu năm đến CUỐI THÁNG HIỆN TẠI
        startDate = new Date(now.getFullYear(), 0, 1); // 1/1 năm hiện tại
        // Lấy đến hết ngày cuối tháng hiện tại
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        groupBy = "month";
        break;

      case "quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 1);
        groupBy = "month";
        break;

      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        groupBy = "month";
        break;

      default:
        // All time / không lọc
        startDate = new Date(now.getFullYear() - 1, 0, 1); // 1 năm trước
        endDate = new Date();
        groupBy = "month";
    }

    const params = {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      groupBy,
    };

    return params;
  };

  // Hàm tính toán thống kê từ backend analytics APIs
  const calculateStatsFromAnalytics = async (analyticsParams) => {
    try {
      console.log(
        " Calculating stats from backend analytics APIs:",
        analyticsParams
      );

      // Gọi các analytics APIs với date range parameters
      const [
        revenueAnalyticsResponse,
        customerAnalyticsResponse,
        productAnalyticsResponse,
      ] = await Promise.all([
        getRevenueAnalytics(analyticsParams).catch((err) => {
          console.error(" getRevenueAnalytics error:", err);
          return { data: null };
        }),
        getCustomerAnalytics(analyticsParams).catch((err) => {
          console.error(" getCustomerAnalytics error:", err);
          return { data: null };
        }),
        getProductAnalytics(analyticsParams).catch((err) => {
          console.error(" getProductAnalytics error:", err);
          return { data: null };
        }),
      ]);

      // Xử lý dữ liệu revenue analytics
      let totalOrders = 0;
      let totalRevenue = 0;
      const revenueData = revenueAnalyticsResponse.data?.revenueAnalytics || [];

      if (Array.isArray(revenueData)) {
        totalRevenue = revenueData.reduce(
          (sum, item) => sum + (item.totalRevenue || 0),
          0
        );
        totalOrders = revenueData.reduce(
          (sum, item) => sum + (item.orderCount || 0),
          0
        );
      }

      // Xử lý dữ liệu customer analytics
      let totalUsers = 0;
      const customerData = customerAnalyticsResponse.data;
      if (customerData && customerData.topCustomers) {
        totalUsers = customerData.topCustomers.length;
      }

      // Tạo ordersByStatus từ backend data (sẽ được cập nhật từ comprehensive report)
      const ordersByStatus = [
        { status: 0, label: "Chờ xử lý", count: 0 },
        { status: 1, label: "Đang xử lý", count: 0 },
        { status: 2, label: "Đã gửi", count: 0 },
        { status: 3, label: "Đã giao", count: Math.floor(totalOrders * 0.8) }, // Giả định 80% đã giao
        { status: 4, label: "Đã hủy", count: Math.floor(totalOrders * 0.1) }, // Giả định 10% đã hủy
      ];

      // Phần còn lại cho các trạng thái khác
      const remainingOrders =
        totalOrders - ordersByStatus[3].count - ordersByStatus[4].count;
      ordersByStatus[0].count = Math.floor(remainingOrders * 0.3);
      ordersByStatus[1].count = Math.floor(remainingOrders * 0.4);
      ordersByStatus[2].count =
        remainingOrders - ordersByStatus[0].count - ordersByStatus[1].count;

      return {
        totalOrders,
        totalRevenue,
        totalUsers,
        ordersByStatus,
        revenueAnalytics: revenueData,
        customerAnalytics: customerData,
        productAnalytics: productAnalyticsResponse.data,
      };
    } catch (error) {
      console.error(" Error calculating stats from analytics APIs:", error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        ordersByStatus: [],
        revenueAnalytics: [],
        customerAnalytics: null,
        productAnalytics: null,
      };
    }
  };
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState({});
  const [orderStatusTrendData, setOrderStatusTrendData] = useState(null);
  const [newUserTrendData, setNewUserTrendData] = useState(null);
  const [orderCompletionRateData, setOrderCompletionRateData] = useState(null);
  const [productAnalytics, setProductAnalytics] = useState([]);
  const [customerBehavior, setCustomerBehavior] = useState(null);
  const [productViewMode, setProductViewMode] = useState("table"); // 'table' or 'cards'
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

  const processNewUserTrend = (userTrendArr) => {
    if (!Array.isArray(userTrendArr) || userTrendArr.length === 0) {
      return null;
    }

    const monthsLabels = userTrendArr.map((item) => {
      if (item._id && item._id.month && item._id.year) {
        return `Tháng ${item._id.month}/${item._id.year}`;
      }
      return "N/A";
    });

    const newUsersData = userTrendArr.map((item) => item.newUsers || 0);

    return {
      labels: monthsLabels,
      datasets: [
        {
          label: "Người dùng mới",
          data: newUsersData,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const processOrderCompletionRate = (orderStatusArr) => {
    if (!Array.isArray(orderStatusArr) || orderStatusArr.length === 0) {
      return null;
    }

    // Nhóm theo tháng
    const monthlyData = {};
    orderStatusArr.forEach((item) => {
      if (item._id && item._id.month && item._id.year) {
        const monthKey = `${item._id.year}-${item._id.month}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: `Tháng ${item._id.month}/${item._id.year}`,
            total: 0,
            completed: 0,
          };
        }
        monthlyData[monthKey].total += item.count;
        if (item._id.status === 3) {
          // status 3 = delivered/completed
          monthlyData[monthKey].completed += item.count;
        }
      }
    });

    const months = Object.keys(monthlyData).sort();
    const labels = months.map((key) => monthlyData[key].month);
    const completionRates = months.map((key) => {
      const data = monthlyData[key];
      return data.total > 0
        ? ((data.completed / data.total) * 100).toFixed(1)
        : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Tỷ lệ hoàn thành (%)",
          data: completionRates,
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  useEffect(() => {
    fetchStatisticsData();
  }, [timeFilter]);

  const fetchStatisticsData = async () => {
    // Kiểm tra token trước khi gọi API
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("❌ No access token found");
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // Lấy parameters cho analytics APIs dựa trên timeFilter
      const analyticsParams = getAnalyticsParams(timeFilter);

      // Gọi backend analytics APIs với date range filtering
      const analyticsResults = await calculateStatsFromAnalytics(
        analyticsParams
      );

      // Cập nhật stats state với dữ liệu từ backend
      setStats({
        totalOrders: analyticsResults.totalOrders,
        totalRevenue: analyticsResults.totalRevenue,
        totalUsers: analyticsResults.totalUsers,
        totalProducts: 0, // Sẽ được cập nhật từ dashboard API
        ordersByStatus: analyticsResults.ordersByStatus,
      });

      // Xử lý revenue data cho charts
      if (
        analyticsResults.revenueAnalytics &&
        analyticsResults.revenueAnalytics.length > 0
      ) {
        processRevenueDataFromAnalytics(
          analyticsResults.revenueAnalytics,
          analyticsParams.groupBy
        );
      } else {
        // Nếu không có data từ analytics, vẫn set empty data với structure đúng
        processRevenueDataFromAnalytics([], analyticsParams.groupBy);
      }

      // Cập nhật customer behavior data
      if (analyticsResults.customerAnalytics) {
        setCustomerBehavior(analyticsResults.customerAnalytics);
      }

      // Cập nhật product analytics data
      if (analyticsResults.productAnalytics) {
        const productConversionData =
          analyticsResults.productAnalytics.productConversion || [];
        setProductAnalytics(productConversionData);
      }

      // Vẫn gọi getTrendAnalytics cho các biểu đồ trend
      await fetchTrendAnalytics();

      // Lấy dashboard stats để có tổng số sản phẩm
      const dashboardResponse = await getDashboardStats().catch((err) => {
        console.error("❌ getDashboardStats error:", err);
        return { data: null };
      });

      if (dashboardResponse.data) {
        setStats((prevStats) => ({
          ...prevStats,
          totalProducts: dashboardResponse.data.totalProducts || 0,
        }));
      }
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
      setOrderStatusData({});
    } finally {
      setLoading(false);
    }
  };

  // Xử lý dữ liệu revenue analytics từ backend cho charts
  const processRevenueDataFromAnalytics = (revenueAnalytics, groupBy) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Nếu groupBy là month, chỉ tạo các tháng từ đầu năm đến tháng hiện tại
    if (groupBy === "month") {
      const result = [];

      // Chỉ tạo các tháng từ đầu năm đến tháng hiện tại
      for (let i = 1; i <= currentMonth; i++) {
        // Tìm dữ liệu cho tháng này
        const monthData = revenueAnalytics.find(
          (item) =>
            item._id && item._id.year === currentYear && item._id.month === i
        );

        result.push({
          month: `Tháng ${i}`,
          revenue: monthData?.totalRevenue || 0,
          orderCount: monthData?.orderCount || 0,
        });
      }

      setRevenueData(result);
      return;
    }

    // Xử lý các groupBy khác (day, week, quarter, year)
    if (!Array.isArray(revenueAnalytics) || revenueAnalytics.length === 0) {
      setRevenueData([]);
      return;
    }

    const processedData = revenueAnalytics.map((item) => {
      let label = "";

      if (item._id) {
        switch (groupBy) {
          case "day":
            if (item._id.year && item._id.month && item._id.day) {
              label = `${item._id.day}/${item._id.month}/${item._id.year}`;
            }
            break;
          case "week":
            if (item._id.year && item._id.week) {
              label = `Tuần ${item._id.week}/${item._id.year}`;
            }
            break;
          case "month":
            if (item._id.year && item._id.month) {
              label = `Tháng ${item._id.month}/${item._id.year}`;
            }
            break;
          case "quarter":
            if (item._id.year && item._id.quarter) {
              label = `Quý ${item._id.quarter}/${item._id.year}`;
            }
            break;
          case "year":
            if (item._id.year) {
              label = `Năm ${item._id.year}`;
            }
            break;
          default:
            label = "N/A";
        }
      }

      return {
        month: label,
        revenue: item.totalRevenue || 0,
        orderCount: item.orderCount || 0,
      };
    });

    setRevenueData(processedData);
  };

  // Fetch trend analytics riêng
  const fetchTrendAnalytics = async () => {
    try {
      const trendsResponse = await getTrendAnalytics({ months: 6 });
      if (trendsResponse.data) {
        // Trạng thái đơn hàng theo tháng
        if (Array.isArray(trendsResponse.data.orderStatusTrend)) {
          setOrderStatusTrendData(
            processOrderStatusTrend(trendsResponse.data.orderStatusTrend)
          );
        } else {
          setOrderStatusTrendData(null);
        }

        // Người dùng mới đăng ký theo tháng
        if (Array.isArray(trendsResponse.data.userTrend)) {
          setNewUserTrendData(
            processNewUserTrend(trendsResponse.data.userTrend)
          );
        } else {
          setNewUserTrendData(null);
        }

        // Tỷ lệ hoàn thành đơn hàng
        if (Array.isArray(trendsResponse.data.orderStatusTrend)) {
          setOrderCompletionRateData(
            processOrderCompletionRate(trendsResponse.data.orderStatusTrend)
          );
        } else {
          setOrderCompletionRateData(null);
        }
      }
    } catch (err) {
      console.error("❌ fetchTrendAnalytics error:", err);
    }
  };

  const createCustomerAnalyticsFromUsers = (users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    // Tạo top customers (giả lập dựa trên createdAt)
    const topCustomers = users.slice(0, 5).map((user, index) => ({
      _id: user._id || user.id || `customer_${index}`,
      customer: {
        fullName: user.name || user.username || `Khách hàng ${index + 1}`,
        email: user.email || `customer${index + 1}@example.com`,
        phone: user.phone || `090123456${index}`,
      },
      orderCount: Math.floor(Math.random() * 10) + 1,
      totalSpent: Math.floor(Math.random() * 5000000) + 500000,
      avgOrderValue: Math.floor(Math.random() * 1000000) + 100000,
    }));

    // Tạo frequency data
    const customerFrequency = [
      { frequency: 1, count: Math.floor(users.length * 0.4) },
      { frequency: 2, count: Math.floor(users.length * 0.3) },
      { frequency: 3, count: Math.floor(users.length * 0.2) },
      { frequency: 4, count: Math.floor(users.length * 0.1) },
    ];

    // Tạo payment method stats
    const paymentMethodStats = [
      { method: "cod", count: Math.floor(users.length * 0.6) },
      { method: "credit", count: Math.floor(users.length * 0.25) },
      { method: "banking", count: Math.floor(users.length * 0.15) },
    ];

    return {
      topCustomers,
      customerFrequency,
      paymentMethodStats,
    };
  };

  const convertDashboardToOrdersFormat = (ordersByStatus) => {
    const orders = [];

    if (Array.isArray(ordersByStatus)) {
      ordersByStatus.forEach((statusGroup) => {
        const status = statusGroup._id || statusGroup.status || "pending";
        const count = statusGroup.count || 0;

        // Tạo đơn hàng giả để có thể hiển thị biểu đồ
        for (let i = 0; i < count; i++) {
          orders.push({
            _id: `fake_${status}_${i}`,
            status: status,
            createdAt: new Date(),
            total: 100000, // Giá trị mặc định
          });
        }
      });
    }

    return orders;
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
      0: "Chờ xử lý",
      1: "Đang xử lý",
      2: "Đã gửi",
      3: "Đã giao",
      4: "Đã hủy",
    };

    // Khởi tạo tất cả trạng thái với 0
    const allStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    allStatuses.forEach((status) => {
      statusCounts[status] = 0;
    });

    if (Array.isArray(orders) && orders.length > 0) {
      orders.forEach((order) => {
        let status = order.status || "pending";

        // Xử lý nếu status là số
        if (typeof status === "number") {
          const statusMap = {
            0: "pending",
            1: "processing",
            2: "shipped",
            3: "delivered",
            4: "cancelled",
          };
          status = statusMap[status] || "pending";
        }

        // Đảm bảo status hợp lệ
        if (allStatuses.includes(status)) {
          statusCounts[status] += 1;
        } else {
          statusCounts["pending"] += 1;
        }
      });
    } else {
      // Chỉ tạo sample data nếu thực sự không có dữ liệu đơn hàng nào
      statusCounts["pending"] = 1;
      statusCounts["delivered"] = 1;
    }

    // Chỉ hiển thị những trạng thái có đơn hàng
    const validStatuses = allStatuses.filter(
      (status) => statusCounts[status] > 0
    );

    // Luôn hiển thị biểu đồ, ngay cả khi không có dữ liệu thật
    if (validStatuses.length === 0) {
      console.log("📈 No valid status data, using fallback");
      return; // Để hàm xử lý sample data ở trên chạy
    }

    const chartData = {
      labels: validStatuses.map((status) => statusLabels[status] || status),
      datasets: [
        {
          data: validStatuses.map((status) => statusCounts[status]),
          backgroundColor: [
            "#FF6384", // Chờ xử lý
            "#36A2EB", // Đang xử lý
            "#FFCE56", // Đã gửi
            "#4BC0C0", // Đã giao
            "#FF9F40", // Đã hủy
          ].slice(0, validStatuses.length),
          borderWidth: 2,
          borderColor: "#fff",
          hoverBackgroundColor: [
            "#FF6384dd",
            "#36A2EBdd",
            "#FFCE56dd",
            "#4BC0C0dd",
            "#FF9F40dd",
          ].slice(0, validStatuses.length),
        },
      ],
    };

    console.log("📈 Chart data:", chartData);
    setOrderStatusData(chartData);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Hàm xuất báo cáo Excel - TOÀN BỘ TRANG
  const exportToExcel = () => {
    try {
      // Tạo workbook mới
      const wb = XLSX.utils.book_new();

      // Sheet 1: Tổng quan
      const overviewData = [
        ["BÁO CÁO THỐNG KÊ TỔNG QUAN - TOÀN BỘ DỮ LIỆU"],
        ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
        [
          "Bộ lọc:",
          timeFilter === "today"
            ? "Hôm nay"
            : timeFilter === "week"
            ? "Tuần này"
            : timeFilter === "month"
            ? "Tháng này"
            : timeFilter === "quarter"
            ? "Quý này"
            : "Năm này",
        ],
        [],
        ["CHỈ SỐ TỔNG QUAN"],
        ["Tổng doanh thu", stats.totalRevenue],
        ["Tổng đơn hàng", stats.totalOrders],
        ["Tổng khách hàng", stats.totalUsers],
        ["Tổng sản phẩm", stats.totalProducts],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, ws1, "1. Tổng quan");

      // Sheet 2: Doanh thu theo tháng
      if (revenueData && revenueData.length > 0) {
        const revenueSheetData = [
          ["DOANH THU THEO THÁNG"],
          [],
          ["Tháng", "Doanh thu (VND)", "Số đơn hàng"],
          ...revenueData.map((item) => [
            item.month,
            item.revenue,
            item.orderCount,
          ]),
          [],
          [
            "TỔNG CỘNG",
            revenueData.reduce((sum, item) => sum + item.revenue, 0),
            revenueData.reduce((sum, item) => sum + item.orderCount, 0),
          ],
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(revenueSheetData);
        XLSX.utils.book_append_sheet(wb, ws2, "2. Doanh thu");
      }

      // Sheet 3: Trạng thái đơn hàng theo tháng
      if (orderStatusTrendData && orderStatusTrendData.labels) {
        const statusTrendData = [
          ["TRẠNG THÁI ĐỠN HÀNG THEO THÁNG"],
          [],
          ["Tháng", ...orderStatusTrendData.datasets.map((d) => d.label)],
        ];

        orderStatusTrendData.labels.forEach((label, idx) => {
          const row = [label];
          orderStatusTrendData.datasets.forEach((dataset) => {
            row.push(dataset.data[idx] || 0);
          });
          statusTrendData.push(row);
        });

        const ws3 = XLSX.utils.aoa_to_sheet(statusTrendData);
        XLSX.utils.book_append_sheet(wb, ws3, "3. Trạng thái đơn hàng");
      }

      // Sheet 4: Tất cả sản phẩm bán chạy
      if (productAnalytics && productAnalytics.length > 0) {
        const productSheetData = [
          ["TẤT CẢ SẢN PHẨM BÁN CHẠY"],
          [],
          [
            "STT",
            "Tên sản phẩm",
            "Thương hiệu",
            "Đã bán",
            "Doanh thu (VND)",
            "Giá (VND)",
            "Tồn kho",
            "Đánh giá",
            "Nổi bật",
          ],
          ...productAnalytics.map((product, index) => [
            index + 1,
            product.name || product.productName,
            product.brand || "N/A",
            product.totalSold || product.sold || 0,
            product.totalRevenue || 0,
            product.price || 0,
            product.stock || 0,
            product.rating || 0,
            product.featured ? "Có" : "Không",
          ]),
          [],
          [
            "TỔNG CỘNG",
            "",
            "",
            productAnalytics.reduce(
              (sum, p) => sum + (p.totalSold || p.sold || 0),
              0
            ),
            productAnalytics.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
          ],
        ];
        const ws4 = XLSX.utils.aoa_to_sheet(productSheetData);
        XLSX.utils.book_append_sheet(wb, ws4, "4. Sản phẩm");
      }

      // Sheet 5: Người dùng mới đăng ký
      if (newUserTrendData && newUserTrendData.labels) {
        const userTrendSheetData = [
          ["NGƯỜI DÙNG MỚI ĐĂNG KÝ THEO THÁNG"],
          [],
          ["Tháng", "Số người dùng mới"],
          ...newUserTrendData.labels.map((label, idx) => [
            label,
            newUserTrendData.datasets[0].data[idx],
          ]),
          [],
          [
            "TỔNG",
            newUserTrendData.datasets[0].data.reduce(
              (sum, val) => sum + val,
              0
            ),
          ],
        ];
        const ws5 = XLSX.utils.aoa_to_sheet(userTrendSheetData);
        XLSX.utils.book_append_sheet(wb, ws5, "5. Người dùng mới");
      }

      // Sheet 6: Tỷ lệ hoàn thành đơn hàng
      if (orderCompletionRateData && orderCompletionRateData.labels) {
        const completionRateSheetData = [
          ["TỶ LỆ HOÀN THÀNH ĐƠN HÀNG THEO THÁNG"],
          [],
          ["Tháng", "Tỷ lệ hoàn thành (%)"],
          ...orderCompletionRateData.labels.map((label, idx) => [
            label,
            orderCompletionRateData.datasets[0].data[idx],
          ]),
          [],
          [
            "Trung bình",
            (
              orderCompletionRateData.datasets[0].data.reduce(
                (sum, val) => sum + parseFloat(val),
                0
              ) / orderCompletionRateData.datasets[0].data.length
            ).toFixed(2),
          ],
        ];
        const ws6 = XLSX.utils.aoa_to_sheet(completionRateSheetData);
        XLSX.utils.book_append_sheet(wb, ws6, "6. Tỷ lệ hoàn thành");
      }

      // Sheet 7: Top khách hàng VIP
      if (
        customerBehavior &&
        customerBehavior.topCustomers &&
        customerBehavior.topCustomers.length > 0
      ) {
        const customerSheetData = [
          ["TOP KHÁCH HÀNG VIP"],
          [],
          [
            "Hạng",
            "Tên khách hàng",
            "Email",
            "Số điện thoại",
            "Số đơn hàng",
            "Tổng chi tiêu (VND)",
            "Giá trị đơn TB (VND)",
          ],
          ...customerBehavior.topCustomers.map((customer, index) => [
            index + 1,
            customer.customer?.fullName || "Khách hàng ẩn danh",
            customer.customer?.email || "N/A",
            customer.customer?.phone || "N/A",
            customer.orderCount,
            customer.totalSpent,
            customer.avgOrderValue,
          ]),
          [],
          [
            "TỔNG",
            "",
            "",
            "",
            customerBehavior.topCustomers.reduce(
              (sum, c) => sum + c.orderCount,
              0
            ),
            customerBehavior.topCustomers.reduce(
              (sum, c) => sum + c.totalSpent,
              0
            ),
          ],
        ];
        const ws7 = XLSX.utils.aoa_to_sheet(customerSheetData);
        XLSX.utils.book_append_sheet(wb, ws7, "7. Top khách hàng");
      }

      // Sheet 8: Tần suất mua hàng
      if (
        customerBehavior &&
        customerBehavior.customerFrequency &&
        customerBehavior.customerFrequency.length > 0
      ) {
        const totalCustomers = customerBehavior.customerFrequency.reduce(
          (sum, item) => sum + item.customerCount,
          0
        );
        const frequencySheetData = [
          ["TẦN SUẤT MUA HÀNG KHÁCH HÀNG"],
          [],
          ["Số lần mua", "Số lượng khách hàng", "Tỷ lệ (%)"],
          ...customerBehavior.customerFrequency.map((freq) => [
            freq._id + " lần",
            freq.customerCount,
            ((freq.customerCount / totalCustomers) * 100).toFixed(2),
          ]),
          [],
          ["TỔNG", totalCustomers, "100.00"],
        ];
        const ws8 = XLSX.utils.aoa_to_sheet(frequencySheetData);
        XLSX.utils.book_append_sheet(wb, ws8, "8. Tần suất mua hàng");
      }

      // Sheet 9: Phương thức thanh toán
      if (
        customerBehavior &&
        customerBehavior.paymentMethodStats &&
        customerBehavior.paymentMethodStats.length > 0
      ) {
        const totalOrders = customerBehavior.paymentMethodStats.reduce(
          (sum, item) => sum + item.count,
          0
        );
        const paymentSheetData = [
          ["PHƯƠNG THỨC THANH TOÁN"],
          [],
          [
            "Phương thức",
            "Số đơn hàng",
            "Tổng doanh thu (VND)",
            "Giá trị TB (VND)",
            "Tỷ lệ sử dụng (%)",
          ],
          ...customerBehavior.paymentMethodStats.map((pm) => {
            const methodName =
              pm._id === "cod"
                ? "Thanh toán khi nhận hàng (COD)"
                : pm._id === "vnpay"
                ? "VNPay"
                : pm._id === "momo"
                ? "MoMo"
                : pm._id === "banking"
                ? "Chuyển khoản ngân hàng"
                : pm._id;
            return [
              methodName,
              pm.count,
              pm.totalRevenue || 0,
              pm.avgValue || 0,
              ((pm.count / totalOrders) * 100).toFixed(2),
            ];
          }),
          [],
          [
            "TỔNG",
            totalOrders,
            customerBehavior.paymentMethodStats.reduce(
              (sum, pm) => sum + (pm.totalRevenue || 0),
              0
            ),
            "",
            "100.00",
          ],
        ];
        const ws9 = XLSX.utils.aoa_to_sheet(paymentSheetData);
        XLSX.utils.book_append_sheet(wb, ws9, "9. Phương thức TT");
      }

      // Xuất file
      const fileName = `Bao-cao-toan-bo_${timeFilter}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      alert(
        "✅ Xuất báo cáo toàn bộ thành công!\n\nFile bao gồm 9 sheet dữ liệu chi tiết."
      );
    } catch (error) {
      console.error("❌ Lỗi khi xuất báo cáo:", error);
      alert("❌ Có lỗi xảy ra khi xuất báo cáo. Vui lòng thử lại!");
    }
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
          <button
            onClick={exportToExcel}
            className="export-btn"
            title="Xuất báo cáo Excel"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "10px",
              fontWeight: "500",
            }}
          >
            📥 Xuất báo cáo
          </button>
          <button
            onClick={fetchStatisticsData}
            className="refresh-btn"
            title="Làm mới dữ liệu"
          >
            🔄 Làm mới
          </button>
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
          </div>
        </div>

        <div className="kpi-card orders">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <h3>Đơn hàng</h3>
            <p className="kpi-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="kpi-card customers">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <h3>Khách hàng</h3>
            <p className="kpi-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="kpi-card products">
          <div className="kpi-icon">📱</div>
          <div className="kpi-content">
            <h3>Sản phẩm</h3>
            <p className="kpi-value">{stats.totalProducts}</p>
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
                  layout: {
                    padding: {
                      left: 10,
                      right: 10,
                      top: 20,
                      bottom: 10,
                    },
                  },
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
                    x: {
                      display: true,
                      ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 0,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      min: 0,
                      ticks: {
                        callback: (value) => formatCurrency(value || 0),
                      },
                      grid: {
                        display: true,
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

        {/* Thống kê sản phẩm bán chạy */}
        <div className="chart-card product-analytics">
          <div className="chart-header">
            <h3>📊 Thống kê sản phẩm bán chạy</h3>
            <p className="chart-description">
              Dữ liệu chi tiết từ ProductAnalytics API
            </p>
          </div>
          <div className="chart-content scrollable-content">
            {Array.isArray(productAnalytics) && productAnalytics.length > 0 ? (
              <div className="row">
                {productAnalytics.slice(0, 6).map((item, idx) => (
                  <div
                    className="col-md-4 col-12 mb-3"
                    key={item._id || item.productId || idx}
                  >
                    <div className="card h-100 border-info">
                      <div className="card-body d-flex flex-column align-items-center">
                        {item.images && item.images[0] ? (
                          <img
                            src={getImageProduct(item.images[0])}
                            alt={item.productName || item.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 8,
                              marginBottom: 10,
                            }}
                          />
                        ) : (
                          <div
                            className="product-placeholder"
                            style={{
                              width: 60,
                              height: 60,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f5f5f5",
                              borderRadius: 8,
                              marginBottom: 10,
                              fontSize: "24px",
                            }}
                          >
                            📱
                          </div>
                        )}
                        <h6 className="card-title text-center mb-2">
                          {item.productName || item.name}
                        </h6>
                        <div className="mb-1">
                          <strong>Đã bán:</strong>{" "}
                          {item.totalSold || item.soldQuantity || 0}
                        </div>
                        <div className="mb-1">
                          <strong>Doanh thu:</strong>{" "}
                          {formatCurrency(
                            item.totalRevenue || item.revenue || 0
                          )}
                        </div>
                        <div className="mb-1">
                          <strong>Giá bán:</strong>{" "}
                          {formatCurrency(item.price || 0)}
                        </div>

                        {item.rating && (
                          <div className="mb-1">
                            <strong>Đánh giá:</strong> ⭐{" "}
                            {item.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted">
                <div className="no-data-icon">📊</div>
                <p>Không có dữ liệu thống kê sản phẩm từ API.</p>
                <small>
                  Kiểm tra API getProductAnalytics hoặc dữ liệu trong khoảng
                  thời gian đã chọn.
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ người dùng mới đăng ký theo tháng */}
        {newUserTrendData && (
          <div className="chart-card new-user-trend-chart">
            <div className="chart-header">
              <h3>👥 Người dùng mới đăng ký theo tháng</h3>
            </div>
            <div className="chart-content">
              <Line
                data={newUserTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.parsed.y} người`,
                      },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Biểu đồ tỷ lệ hoàn thành đơn hàng theo tháng */}
        {orderCompletionRateData && (
          <div className="chart-card order-completion-rate-chart">
            <div className="chart-header">
              <h3>📈 Tỷ lệ hoàn thành đơn hàng theo tháng</h3>
            </div>
            <div className="chart-content">
              <Line
                data={orderCompletionRateData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          `${context.dataset.label}: ${context.parsed.y}%`,
                      },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, max: 100 },
                  },
                }}
              />
            </div>
          </div>
        )}
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
                onClick={() =>
                  setProductViewMode(
                    productViewMode === "table" ? "cards" : "table"
                  )
                }
                className="btn btn-secondary"
              >
                {productViewMode === "table"
                  ? "📊 Xem dạng thẻ"
                  : "📋 Xem dạng bảng"}
              </button>
            </div>
          </div>
        </div>

        {Array.isArray(productAnalytics) && productAnalytics.length > 0 ? (
          <div className="product-analytics-content">
            {productViewMode === "table" ? (
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
                    {(productDisplayLimit === -1
                      ? productAnalytics
                      : productAnalytics.slice(0, productDisplayLimit)
                    ).map((product, index) => (
                      <tr key={product._id || index}>
                        <td>
                          {product.images && product.images[0] ? (
                            <img
                              src={getImageProduct(product.images[0])}
                              alt={product.name}
                              className="table-product-image"
                            />
                          ) : (
                            <div className="table-product-placeholder">📱</div>
                          )}
                        </td>
                        <td>
                          <div className="table-product-info">
                            <span className="table-product-name">
                              {product.name}
                            </span>
                            <span className="table-product-brand">
                              {product.brand || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="revenue-cell">
                          {formatCurrency(product.totalRevenue || 0)}
                        </td>
                        <td className="quantity-cell">
                          {product.totalSold || product.sold || 0}
                        </td>
                        <td className="price-cell">
                          {formatCurrency(product.price || 0)}
                        </td>
                        <td className="stock-cell">{product.stock || 0}</td>
                        <td className="rating-cell">
                          {product.rating ? (
                            <span className="rating-stars">
                              {"⭐".repeat(Math.floor(product.rating))}{" "}
                              {product.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="no-rating">Chưa có</span>
                          )}
                        </td>
                        <td className="featured-cell">
                          <span
                            className={`featured-badge ${
                              product.featured ? "featured" : "not-featured"
                            }`}
                          >
                            {product.featured ? "✅" : "❌"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="detailed-products-grid">
                {(productDisplayLimit === -1
                  ? productAnalytics
                  : productAnalytics.slice(0, productDisplayLimit)
                ).map((product, index) => (
                  <div
                    key={product._id || index}
                    className="detailed-product-card compact"
                  >
                    <div className="product-header">
                      {product.images && product.images[0] ? (
                        <img
                          src={getImageProduct(product.images[0])}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-placeholder">📱</div>
                      )}
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-category">
                          {product.brand || "Không phân loại"}
                        </p>
                      </div>
                    </div>
                    <div className="product-metrics compact">
                      <div className="metric-row">
                        <span className="metric-label">💰 Doanh thu:</span>
                        <span className="metric-value revenue">
                          {formatCurrency(product.totalRevenue || 0)}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">📦 Đã bán:</span>
                        <span className="metric-value quantity">
                          {product.totalSold || product.sold || 0}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">💰 Giá:</span>
                        <span className="metric-value price">
                          {formatCurrency(product.price || 0)}
                        </span>
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

            {productDisplayLimit !== -1 &&
              productAnalytics.length > productDisplayLimit && (
                <div className="products-pagination">
                  <p className="pagination-info">
                    Hiển thị {productDisplayLimit} / {productAnalytics.length}{" "}
                    sản phẩm
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
          <p className="section-description">
            Chi tiết về thói quen và xu hướng mua sắm của khách hàng
          </p>
        </div>

        {customerBehavior ? (
          <div className="customer-behavior-content">
            {/* Top Customers Section sử dụng CSS mới */}
            {customerBehavior.topCustomers &&
              customerBehavior.topCustomers.length > 0 && (
                <div className="behavior-section">
                  <div className="section-header">
                    <h3>🏆 Top Khách Hàng VIP</h3>
                    <span className="section-subtitle">
                      Khách hàng chi tiêu nhiều nhất
                    </span>
                  </div>
                  <div className="top-customers-grid">
                    {customerBehavior.topCustomers
                      .slice(0, 3)
                      .map((customer, index) => (
                        <div
                          key={customer._id}
                          className={`vip-customer-card rank-${index + 1}`}
                        >
                          <div className="customer-rank">
                            <span className="rank-badge">#{index + 1}</span>
                            {index === 0 && <span className="crown">👑</span>}
                          </div>
                          <div className="customer-info">
                            <h4 className="customer-name">
                              {customer.customer?.fullName ||
                                "Khách hàng ẩn danh"}
                            </h4>
                            <p className="customer-contact">
                              📧 {customer.customer?.email || "N/A"}
                            </p>
                            <p className="customer-contact">
                              📱 {customer.customer?.phone || "N/A"}
                            </p>
                          </div>
                          <div className="customer-stats">
                            <div className="stat-item">
                              <span className="stat-value">
                                {customer.orderCount}
                              </span>
                              <span className="stat-label">đơn hàng</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-value">
                                {formatCurrency(customer.totalSpent)}
                              </span>
                              <span className="stat-label">tổng chi tiêu</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-value">
                                {formatCurrency(customer.avgOrderValue)}
                              </span>
                              <span className="stat-label">giá trị TB/đơn</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {customerBehavior.topCustomers.length > 3 && (
                    <div className="remaining-customers">
                      <details className="customers-details">
                        <summary>
                          Xem thêm {customerBehavior.topCustomers.length - 3}{" "}
                          khách hàng khác
                        </summary>
                        <div className="customers-table-wrapper">
                          <table className="modern-table">
                            <thead>
                              <tr>
                                <th>Hạng</th>
                                <th>Khách hàng</th>
                                <th>Liên hệ</th>
                                <th>Đơn hàng</th>
                                <th>Tổng chi tiêu</th>
                                <th>Giá trị TB</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customerBehavior.topCustomers
                                .slice(3)
                                .map((customer, index) => (
                                  <tr key={customer._id}>
                                    <td>#{index + 4}</td>
                                    <td>
                                      <div className="customer-cell">
                                        <strong>
                                          {customer.customer?.fullName ||
                                            "Khách hàng ẩn danh"}
                                        </strong>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="contact-cell">
                                        <div>
                                          📧 {customer.customer?.email || "N/A"}
                                        </div>
                                        <div>
                                          📱 {customer.customer?.phone || "N/A"}
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="badge badge-primary">
                                        {customer.orderCount}
                                      </span>
                                    </td>
                                    <td className="currency-cell">
                                      {formatCurrency(customer.totalSpent)}
                                    </td>
                                    <td className="currency-cell">
                                      {formatCurrency(customer.avgOrderValue)}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              )}

            {/* Analytics Cards Grid */}
            <div className="analytics-cards-grid">
              {/* Top Customers */}
              {customerBehavior.topCustomers &&
                customerBehavior.topCustomers.length > 0 && (
                  <div className="behavior-card top-customers">
                    <div className="behavior-card-header">
                      <h3>� Khách hàng chi tiêu nhiều nhất</h3>
                    </div>
                    <div className="table-container">
                      <table className="customer-table">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên khách hàng</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Số đơn hàng</th>
                            <th>Tổng chi tiêu</th>
                            <th>Giá trị đơn TB</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerBehavior.topCustomers.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>
                                {item.customer?.fullName ||
                                  "Khách hàng ẩn danh"}
                              </td>
                              <td>{item.customer?.email || "N/A"}</td>
                              <td>{item.customer?.phone || "N/A"}</td>
                              <td>{item.orderCount}</td>
                              <td className="currency">
                                {formatCurrency(item.totalSpent)}
                              </td>
                              <td className="currency">
                                {formatCurrency(item.avgOrderValue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Customer Frequency */}
              {customerBehavior.customerFrequency &&
                customerBehavior.customerFrequency.length > 0 && (
                  <div className="behavior-card customer-frequency">
                    <div className="behavior-card-header">
                      <h3>� Tần suất mua hàng khách hàng</h3>
                      <p className="card-description">
                        Phân tích số lần mua hàng của khách hàng
                      </p>
                    </div>
                    <div className="table-container">
                      <table className="frequency-table">
                        <thead>
                          <tr>
                            <th>Số lần mua hàng</th>
                            <th>Số lượng khách hàng</th>
                            <th>Tỷ lệ (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerBehavior.customerFrequency.map((freq) => {
                            const totalCustomers =
                              customerBehavior.customerFrequency.reduce(
                                (sum, item) => sum + item.customerCount,
                                0
                              );
                            const percentage = (
                              (freq.customerCount / totalCustomers) *
                              100
                            ).toFixed(1);
                            return (
                              <tr key={freq._id}>
                                <td>{freq._id} lần</td>
                                <td>{freq.customerCount}</td>
                                <td>{percentage}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Payment Method Stats */}
              {customerBehavior.paymentMethodStats &&
                customerBehavior.paymentMethodStats.length > 0 && (
                  <div className="behavior-card payment-method-stats">
                    <div className="behavior-card-header">
                      <h3>💳 Thống kê phương thức thanh toán</h3>
                      <p className="card-description">
                        Phân tích xu hướng thanh toán của khách hàng
                      </p>
                    </div>
                    <div className="table-container">
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th>Phương thức</th>
                            <th>Số đơn hàng</th>
                            <th>Tổng doanh thu</th>
                            <th>Giá trị trung bình</th>
                            <th>Tỷ lệ sử dụng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerBehavior.paymentMethodStats.map((pm) => {
                            const totalOrders =
                              customerBehavior.paymentMethodStats.reduce(
                                (sum, item) => sum + item.count,
                                0
                              );
                            const usagePercentage = (
                              (pm.count / totalOrders) *
                              100
                            ).toFixed(1);
                            const methodName =
                              pm._id === "cod"
                                ? "Thanh toán khi nhận hàng (COD)"
                                : pm._id === "vnpay"
                                ? "VNPay"
                                : pm._id === "momo"
                                ? "MoMo"
                                : pm._id === "banking"
                                ? "Chuyển khoản ngân hàng"
                                : pm._id;

                            return (
                              <tr key={pm._id}>
                                <td>{methodName}</td>
                                <td>{pm.count}</td>
                                <td className="currency">
                                  {formatCurrency(pm.totalRevenue)}
                                </td>
                                <td className="currency">
                                  {formatCurrency(pm.avgValue)}
                                </td>
                                <td>{usagePercentage}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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
