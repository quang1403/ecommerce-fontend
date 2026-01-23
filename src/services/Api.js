import Http from "./Http";
// Lấy toàn bộ đánh giá khách hàng
export const getAllComments = () => {
  // Http interceptor sẽ tự động thêm token
  return Http.get("/comments");
};

// Lấy danh sách đơn hàng
export const getOrders = (config) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/orders", {
    ...config,
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: lấy tất cả đơn hàng
export const getAllOrdersAdmin = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/orders/admin/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: xóa đơn hàng
export const deleteOrderAdmin = (orderId) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete(`/orders/admin/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: cập nhật trạng thái đơn hàng
export const updateOrderStatusAdmin = (orderId, status) => {
  const token = localStorage.getItem("accessToken");

  // Convert status to number if it's a string
  const numericStatus = parseInt(status);

  console.log("🔄 API Call - updateOrderStatusAdmin:", {
    orderId,
    originalStatus: status,
    numericStatus,
    statusType: typeof status,
    numericStatusType: typeof numericStatus,
    url: `/orders/admin/${orderId}/status`,
    requestBody: { status: numericStatus },
    token: token ? "✅ Token exists" : "❌ No token",
  });
  return Http.put(
    `/orders/admin/${orderId}/status`,
    { orderId: orderId, status: numericStatus }, // Gửi cả orderId và status
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Admin: lấy danh sách đơn hàng trả góp
export const getInstallmentOrdersAdmin = (financeStatus) => {
  const token = localStorage.getItem("accessToken");
  const url = financeStatus
    ? `/orders/admin/installments?financeStatus=${financeStatus}`
    : `/orders/admin/installments`;
  return Http.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: duyệt/từ chối hồ sơ trả góp
export const updateInstallmentStatus = (orderId, financeStatus) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(
    `/orders/admin/${orderId}/installment-status`,
    { financeStatus },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// ---------------- CUSTOMERS ADMIN ----------------
export const getCustomers = (config) => Http.get("/users", config);
export const addCustomer = (data) => {
  const token = localStorage.getItem("accessToken");
  return Http.post("/users", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const updateCustomer = (id, data) => {
  const token = localStorage.getItem("accessToken");
  // Chuẩn hóa: PUT /users/:id, truyền token
  return Http.put(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const deleteCustomer = (id) => {
  const token = localStorage.getItem("accessToken");
  // Chuẩn hóa: DELETE /users/:id, truyền token
  return Http.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const tokenHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

// ---------------- CART ----------------
export const getCartByToken = () => Http.get("/cart", tokenHeader());

// Cart API
export const addToCart = (data) => {
  const token = localStorage.getItem("accessToken");
  return Http.post("/cart", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCartItem = (data) => {
  const token = localStorage.getItem("accessToken");
  return Http.put("/cart", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeItemFromCart = (data) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete("/cart", {
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
};

export const clearCartApi = () => {
  const token = localStorage.getItem("accessToken");
  return Http.delete("/cart/clear", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---------------- PRODUCTS ----------------
export const getProducts = (config) => Http.get("/products", config);
export const getBrands = (config) => Http.get("/brands", config);

// Lấy sản phẩm theo id
export const getProductById = (id, config) =>
  Http.get(`/products/${id}`, config);

// Lấy sản phẩm theo hãng và danh mục (chuẩn BE)
export const getProductsByBrand = (brandId, categoryId) => {
  const token = localStorage.getItem("accessToken");
  const params = {};
  if (brandId) params.brand = brandId;
  if (categoryId) params.category = categoryId;
  return Http.get("/products", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
};

// ---------------- INVENTORY MANAGEMENT ----------------
// 📦 Kiểm tra tồn kho của một sản phẩm (Public)
export const checkProductStock = (productId) => {
  return Http.get(`/inventory/stock/${productId}`);
};

// Kiểm tra tồn kho cho nhiều sản phẩm - TBD Backend Implementation
export const checkMultipleProductsStock = async (productIds) => {
  // Fallback: Check each product individually until backend implements bulk check
  try {
    const results = [];
    for (const productId of productIds) {
      const response = await checkProductStock(productId);
      if (response.data.success) {
        results.push({
          productId: response.data.data.productId,
          productName: response.data.data.productName,
          availableStock: response.data.data.stock,
          status: response.data.data.status,
        });
      }
    }
    return { data: results };
  } catch (error) {
    console.error("❌ Bulk stock check fallback failed:", error);
    return { data: [] };
  }
};

// 🔍 Lấy chi tiết đầy đủ Inventory với variants (Admin)
export const getInventoryDetailed = (productId) => {
  const token = localStorage.getItem("accessToken");
  return Http.get(`/inventory/detailed/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 🔄 Cập nhật Stock (Admin) - Hỗ trợ total, color, ramStorage variants
export const updateProductStock = (productId, stockData) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(
    `/inventory/stock/${productId}`,
    stockData, // { action, stock, variantType?, color?, ram?, storage? }
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Cập nhật tồn kho hàng loạt (Admin only)
export const updateMultipleProductsStock = (updates) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(
    "/inventory/bulk-update",
    { updates }, // [{ productId, stock, action }]
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// ⚠️ Lấy danh sách sản phẩm sắp hết hàng (Admin)
export const getLowStockProducts = (threshold = 10) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/inventory/low-stock", {
    headers: { Authorization: `Bearer ${token}` },
    params: { threshold },
  });
};

// ---------------- NEWS ----------------
// Lấy danh sách tin tức (phân trang, tìm kiếm, lọc tag)
export const getNews = (params) => Http.get("/news", { params });

// Lấy chi tiết bài viết
export const getNewsById = (id) => Http.get(`/news/${id}`);

// 🔴 Lấy danh sách sản phẩm hết hàng (Admin)
export const getOutOfStockProducts = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/inventory/out-of-stock", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 📊 Báo cáo tồn kho (Admin only)
export const getInventoryReport = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/inventory/report", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCategories = (config) => Http.get("/categories", config);
// Tìm kiếm sản phẩm với tất cả filters
export const searchProducts = (searchParams) =>
  Http.get("/products/search", { params: searchParams });

// ---------------- COMMENTS ----------------
export const getCommentsProduct = (id, config) =>
  Http.get(`/comments/${id}`, config);

export const createCommentProduct = (id, data) => {
  const token = localStorage.getItem("accessToken");
  return Http.post(`/comments/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteComment = (commentId) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete(`/comments/admin/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Reply to comment
export const replyToComment = (commentId, replyData) => {
  const token = localStorage.getItem("accessToken");
  return Http.post(`/comments/${commentId}/reply`, replyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update comment status
export const updateCommentStatus = (commentId, status) => {
  const token = localStorage.getItem("accessToken");
  return Http.patch(
    `/comments/${commentId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// ---------------- AUTH ----------------
export const registerCustomer = (data) => Http.post("/users/register", data);

export const loginCustomer = (data) => Http.post("/users/login", data);

export const logOutCustomer = (config) =>
  Http.post("/users/logout", {}, config);

// Quên mật khẩu - gửi email reset
export const forgotPassword = (email) =>
  Http.post("/users/forgot-password", { email });

// Đặt lại mật khẩu với token
export const resetPassword = (token, newPassword) =>
  Http.post("/users/reset-password", { token, newPassword });

// ---------------- ORDER ----------------
export const getOrdersByUser = () => Http.get("/orders", tokenHeader());
export const createOrder = (data) => Http.post("/orders", data, tokenHeader());

// Validate đơn hàng trước khi tạo (kiểm tra stock + giá) - TBD Backend
export const validateOrder = (orderItems) => {
  return Http.post("/orders/validate", { items: orderItems });
};

// Tạo đơn hàng và tự động cập nhật tồn kho
export const createOrderWithStockUpdate = async (orderData) => {
  const token = localStorage.getItem("accessToken");

  try {
    // 1. Tạo đơn hàng trước
    const orderResponse = await Http.post("/orders", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. Nếu tạo đơn hàng thành công, cập nhật tồn kho
    if (orderResponse.data && orderResponse.data.success) {
      const stockUpdates = orderData.items.map((item) => ({
        productId: item.product || item.productId,
        stock: item.quantity, // Số lượng cần trừ
        action: "subtract", // Backend action
      }));

      // Cập nhật tồn kho bằng API mới (không await để không block user)
      updateMultipleProductsStock(stockUpdates).catch((error) => {
        console.error("❌ Stock update failed:", error);
        // TODO: Implement rollback logic hoặc queue retry
      });
    }

    return orderResponse;
  } catch (error) {
    console.error("❌ Create order failed:", error);
    throw error;
  }
};

export const updateOrderStatus = (orderId, status) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(
    `/orders/status`,
    { orderId, status },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Xóa đơn hàng thông qua API DELETE /:id
export const deleteOrder = (orderId) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
//User
export const updateUser = (id, data) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(`/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---------------- PRODUCTS ADMIN ----------------
export const addProduct = (data) => {
  const token = localStorage.getItem("accessToken");
  return Http.post("/products", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProduct = (id, data) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteProduct = (id) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Upload ảnh sản phẩm
export const uploadImages = (files) => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("images", file));
  return Http.post("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// ---------------- DASHBOARD ADMIN ----------------
// Lấy thống kê tổng quan
export const getDashboardStats = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/dashboard/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Lấy đơn hàng gần đây
export const getRecentOrders = (limit = 3) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/dashboard/recent-orders", {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit },
  });
};

// Lấy sản phẩm bán chạy
export const getTopProducts = (limit = 3) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/dashboard/top-products", {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit },
  });
};

// Customer Behavior Analytics API
export const getCustomerBehaviorAnalytics = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/customers", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Product Analytics API
export const getProductAnalyticsAPI = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Revenue Analytics API - Phân tích doanh thu theo khoảng thời gian
export const getRevenueAnalyticsAPI = (params = {}) => {
  const token = localStorage.getItem("accessToken");

  // Validate groupBy options
  const validGroupBy = ["day", "week", "month", "year"];
  const groupBy = validGroupBy.includes(params.groupBy)
    ? params.groupBy
    : "day";

  // Default date range if not provided
  const endDate = params.endDate || new Date().toISOString().split("T")[0];
  const startDate =
    params.startDate ||
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  console.log(`📊 Calling Revenue Analytics API:`, {
    startDate,
    endDate,
    groupBy,
    endpoint: "/api/analytics/revenue",
  });

  return Http.get("/analytics/revenue", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      startDate,
      endDate,
      groupBy,
    },
  });
};

// Tính analytics thật từ existing data
export const calculateRealAnalytics = async (dateRange) => {
  try {
    // Tự động chọn groupBy dựa trên khoảng thời gian
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    let groupBy = "day";
    if (daysDiff <= 7)
      groupBy = "day"; // ≤ 7 ngày: group by day
    else if (daysDiff <= 90)
      groupBy = "week"; // ≤ 3 tháng: group by week
    else if (daysDiff <= 730)
      groupBy = "month"; // ≤ 2 năm: group by month
    else groupBy = "year"; // > 2 năm: group by year

    console.log(
      `📊 Auto-selected groupBy: ${groupBy} for ${daysDiff} days range`,
    );

    // Gọi các API analytics thật + fallback APIs
    const [
      dashboardResponse,
      revenueAnalyticsResponse,
      ordersResponse,
      productsResponse,
      customerBehaviorResponse,
    ] = await Promise.all([
      getDashboardStats().catch((err) => {
        console.warn("❌ Dashboard API failed:", err.message);
        return { data: null };
      }),
      getRevenueAnalyticsAPI({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        groupBy: groupBy,
      }).catch((err) => {
        console.warn("❌ Revenue Analytics API not available:", err.message);
        return { data: null };
      }),
      getAllOrdersAdmin().catch((err) => {
        console.warn("❌ Orders API failed:", err.message);
        return { data: [] };
      }),
      getProducts().catch((err) => {
        console.warn("❌ Products API failed:", err.message);
        return { data: [] };
      }),
      getCustomerBehaviorAnalytics().catch((err) => {
        console.warn("❌ Customer behavior API not available:", err.message);
        return { data: null };
      }),
    ]);

    const dashboardData = dashboardResponse?.data;
    const rawOrders = ordersResponse?.data;
    const rawProducts = productsResponse?.data;

    console.log("🔍 Raw API responses:", {
      dashboard: dashboardData,
      ordersType: typeof rawOrders,
      ordersHasOrdersArray: Array.isArray(rawOrders?.orders),
      productsType: typeof rawProducts,
      productsHasProductsArray: Array.isArray(rawProducts?.products),
    });

    // Safely extract arrays from API responses
    let orders = [];
    let products = [];

    if (Array.isArray(rawOrders)) {
      orders = rawOrders;
      console.log("✅ Orders: Direct array format");
    } else if (Array.isArray(rawOrders?.orders)) {
      orders = rawOrders.orders;
      console.log("✅ Orders: Nested orders array format");
    } else {
      console.warn("❌ Orders: Unknown format", rawOrders);
    }

    if (Array.isArray(rawProducts)) {
      products = rawProducts;
    } else if (Array.isArray(rawProducts?.products)) {
      products = rawProducts.products;
    } else if (Array.isArray(rawProducts?.data)) {
      products = rawProducts.data;
    } else if (rawProducts?.data && Array.isArray(rawProducts.data.products)) {
      products = rawProducts.data.products;
    } else {
      console.warn("❌ Products: Unknown format", rawProducts);
      // Log chi tiết để debug
      console.log("🔍 Products structure:", {
        type: typeof rawProducts,
        keys: rawProducts ? Object.keys(rawProducts) : null,
        hasData: rawProducts?.data !== undefined,
        dataType: typeof rawProducts?.data,
        dataKeys: rawProducts?.data ? Object.keys(rawProducts.data) : null,
      });
    }

    console.log("🔍 Final processed arrays:", {
      ordersCount: orders.length,
      productsCount: products.length,
      sampleOrder: orders[0]
        ? {
            id: orders[0]._id,
            total: orders[0].total,
            createdAt: orders[0].createdAt,
            customerId: orders[0].customerId?._id,
          }
        : null,
    });

    // Filter orders by date range if provided
    let filteredOrders = orders;
    if (dateRange?.startDate && dateRange?.endDate && Array.isArray(orders)) {
      try {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Include full end date

        filteredOrders = orders.filter((order) => {
          if (!order?.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        });

        console.log(
          `📅 Filtered ${filteredOrders.length}/${orders.length} orders for date range`,
        );
      } catch (dateError) {
        console.warn("❌ Date filtering failed:", dateError.message);
        filteredOrders = orders; // Use all orders if date filtering fails
      }
    }

    // Calculate analytics with validation
    console.log("📊 Starting analytics calculations...");

    // Calculate revenue analytics - Ưu tiên API mới
    const revenueAnalytics = revenueAnalyticsResponse?.data
      ? calculateRevenueFromAPI(
          revenueAnalyticsResponse.data,
          dateRange,
          groupBy,
        )
      : Array.isArray(filteredOrders)
        ? calculateRevenueFromOrders(filteredOrders, dateRange)
        : {
            totalRevenue: 0,
            totalOrders: 0,
            avgOrderValue: 0,
            growth: 0,
            dailyRevenue: [],
          };

    // Calculate customer analytics - Ưu tiên API mới nếu có
    const customerAnalytics = customerBehaviorResponse?.data
      ? calculateCustomerAnalyticsFromAPI(
          customerBehaviorResponse.data,
          dashboardData,
        )
      : Array.isArray(filteredOrders)
        ? calculateCustomerAnalytics(filteredOrders, dashboardData)
        : {
            totalCustomers: 0,
            newCustomers: 0,
            returningCustomers: 0,
            customerGrowth: 0,
          };

    // Calculate product analytics from API data
    const productAnalytics =
      Array.isArray(products) && Array.isArray(filteredOrders)
        ? calculateProductAnalytics(products, filteredOrders)
        : { totalProducts: 0, topSellingProducts: [], categoryPerformance: [] };

    return {
      revenue: revenueAnalytics,
      customers: customerAnalytics,
      products: productAnalytics,
      rawData: {
        orders: filteredOrders,
        allProducts: products,
        dashboard: dashboardData,
      },
    };
  } catch (error) {
    console.error("❌ calculateRealAnalytics failed:", error);
    throw error;
  }
};

// Helper: Tính revenue analytics từ Revenue Analytics API
// Helper function để format chart labels
const formatChartLabel = (date, groupBy) => {
  const dateObj = new Date(date);

  switch (groupBy) {
    case "year":
      return dateObj.getFullYear().toString();
    case "month":
      return dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
      });
    case "week":
      return dateObj.toLocaleDateString("vi-VN", {
        month: "short",
        day: "2-digit",
      });
    case "day":
    default:
      return dateObj.toLocaleDateString("vi-VN", {
        month: "short",
        day: "2-digit",
      });
  }
};

const calculateRevenueFromAPI = (apiData, dateRange, groupBy = "day") => {
  console.log("💰 Processing Revenue Analytics API data:", apiData);
  console.log("📊 Using groupBy:", groupBy);

  // API data có thể có 2 format:
  // Format 1: { revenueAnalytics: [...], groupBy: '...', period: '...' }
  // Format 2: Trực tiếp array [...]
  const revenueAnalytics = Array.isArray(apiData)
    ? apiData
    : apiData?.revenueAnalytics || [];

  const apiGroupBy = apiData?.groupBy || groupBy;

  if (!Array.isArray(revenueAnalytics)) {
    console.warn("❌ Invalid revenueAnalytics format");
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      growth: 0,
      dailyRevenue: [],
    };
  }

  // Tính tổng từ API data
  const totalRevenue = revenueAnalytics.reduce(
    (sum, item) => sum + (item.totalRevenue || 0),
    0,
  );
  const totalOrders = revenueAnalytics.reduce(
    (sum, item) => sum + (item.orderCount || 0),
    0,
  );
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chuyển đổi sang daily revenue format cho charts
  const dailyRevenue = revenueAnalytics
    .map((item) => {
      let date;

      // Xử lý date theo groupBy format
      if (item._id?.year && item._id?.month) {
        const year = item._id.year;
        const month = String(item._id.month).padStart(2, "0");
        const day = item._id.day ? String(item._id.day).padStart(2, "0") : "01";

        // Format date theo groupBy
        switch (apiGroupBy) {
          case "year":
            date = `${year}-01-01`; // First day of year
            break;
          case "month":
            date = `${year}-${month}-01`; // First day of month
            break;
          case "week":
            // Week data - use day or default to first day of month
            date = `${year}-${month}-${day}`;
            break;
          case "day":
          default:
            date = `${year}-${month}-${day}`;
            break;
        }
      } else {
        // Fallback to current date
        date = new Date().toISOString().split("T")[0];
      }

      return {
        date,
        revenue: item.totalRevenue || 0,
        orders: item.orderCount || 0,
        label: formatChartLabel(date, apiGroupBy), // Thêm label cho chart
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate growth
  const firstPeriod = revenueAnalytics[0]?.totalRevenue || 0;
  const lastPeriod =
    revenueAnalytics[revenueAnalytics.length - 1]?.totalRevenue || 0;
  const growth =
    firstPeriod > 0 ? ((lastPeriod - firstPeriod) / firstPeriod) * 100 : 0;

  console.log("💰 Revenue Analytics processed:", {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    growth,
    dailyRevenueCount: dailyRevenue.length,
  });

  return {
    totalRevenue,
    avgDailyRevenue:
      dailyRevenue.length > 0 ? totalRevenue / dailyRevenue.length : 0,
    totalOrders,
    avgOrderValue,
    growth,
    dailyRevenue,
    topProducts: [], // Will be filled from products API later
  };
};

// Helper: Tính revenue analytics từ orders
const calculateRevenueFromOrders = (orders, dateRange) => {
  console.log("💰 Calculating revenue from", orders.length, "orders");

  // Tính tổng revenue (field là 'total' từ API)
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0,
  );

  console.log("💰 Total revenue calculated:", totalRevenue);

  // Group by date for daily revenue
  const dailyRevenue = {};
  orders.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    if (!dailyRevenue[date]) {
      dailyRevenue[date] = { date, revenue: 0, orders: 0 };
    }
    dailyRevenue[date].revenue += order.total || 0;
    dailyRevenue[date].orders += 1;
  });

  const dailyRevenueArray = Object.values(dailyRevenue).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  console.log("📈 Daily revenue array:", dailyRevenueArray);

  // Calculate growth (compare first and last day)
  const firstDay = dailyRevenueArray[0]?.revenue || 0;
  const lastDay = dailyRevenueArray[dailyRevenueArray.length - 1]?.revenue || 0;
  const growth = firstDay > 0 ? ((lastDay - firstDay) / firstDay) * 100 : 0;

  return {
    totalRevenue,
    avgDailyRevenue:
      dailyRevenueArray.length > 0
        ? totalRevenue / dailyRevenueArray.length
        : 0,
    dailyRevenue: dailyRevenueArray,
    growth,
    totalOrders: orders.length,
    avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
  };
};

// Helper: Tính customer analytics từ API mới
const calculateCustomerAnalyticsFromAPI = (behaviorData, dashboardData) => {
  const { topCustomers, customerFrequency, paymentMethodStats } = behaviorData;

  console.log("🎯 Processing customer behavior data:", behaviorData);

  // Phân tích top customers
  const totalCustomers = dashboardData?.totalUsers || topCustomers?.length || 0;
  const avgOrderValue =
    topCustomers?.length > 0
      ? topCustomers.reduce(
          (sum, customer) => sum + customer.avgOrderValue,
          0,
        ) / topCustomers.length
      : 0;

  // Phân tích frequency
  const customersByFrequency = customerFrequency || [];
  const highValueCustomers =
    topCustomers?.filter((customer) => customer.totalSpent > 100000000) || [];
  const mediumValueCustomers =
    topCustomers?.filter(
      (customer) =>
        customer.totalSpent >= 30000000 && customer.totalSpent <= 100000000,
    ) || [];
  const regularCustomers =
    topCustomers?.filter((customer) => customer.totalSpent < 30000000) || [];

  // Payment method insights
  const paymentInsights =
    paymentMethodStats?.map((method) => ({
      method: method._id,
      count: method.count,
      revenue: method.totalRevenue,
      avgValue: method.avgValue,
      percentage:
        paymentMethodStats.reduce((sum, m) => sum + m.count, 0) > 0
          ? Math.round(
              (method.count /
                paymentMethodStats.reduce((sum, m) => sum + m.count, 0)) *
                100,
            )
          : 0,
    })) || [];

  return {
    totalCustomers,
    newCustomers:
      customersByFrequency.find((f) => f._id === 1)?.customerCount || 0,
    returningCustomers:
      topCustomers?.filter((customer) => customer.orderCount > 1).length || 0,
    customerGrowth: totalCustomers > 0 ? 15.2 : 0, // Mock growth rate
    avgOrderValue: avgOrderValue,
    topCustomers:
      topCustomers?.slice(0, 5).map((customer) => ({
        name: customer.customer?.fullName || "N/A",
        email: customer.customer?.email || "N/A",
        totalSpent: customer.totalSpent,
        orderCount: customer.orderCount,
        avgOrderValue: customer.avgOrderValue,
      })) || [],
    customerSegments: [
      {
        segment: "VIP (>100M VND)",
        count: highValueCustomers.length,
        percentage:
          totalCustomers > 0
            ? Math.round((highValueCustomers.length / totalCustomers) * 100)
            : 0,
      },
      {
        segment: "Trung bình (30-100M)",
        count: mediumValueCustomers.length,
        percentage:
          totalCustomers > 0
            ? Math.round((mediumValueCustomers.length / totalCustomers) * 100)
            : 0,
      },
      {
        segment: "Thường xuyên (<30M)",
        count: regularCustomers.length,
        percentage:
          totalCustomers > 0
            ? Math.round((regularCustomers.length / totalCustomers) * 100)
            : 0,
      },
    ],
    paymentMethodStats: paymentInsights,
    customerFrequency: customersByFrequency,
  };
};

// Helper: Tính customer analytics từ orders
const calculateCustomerAnalytics = (orders, dashboardData) => {
  console.log(
    "👥 Calculating customer analytics from",
    orders.length,
    "orders",
  );

  const uniqueCustomers = new Set();
  const customerOrders = {};

  orders.forEach((order) => {
    // API trả về customerId là object với _id
    const customerId = order.customerId?._id || order.user?._id || order.userId;
    if (customerId) {
      uniqueCustomers.add(customerId);
      if (!customerOrders[customerId]) {
        customerOrders[customerId] = [];
      }
      customerOrders[customerId].push(order);
    }
  });

  console.log("👥 Found", uniqueCustomers.size, "unique customers");

  // Classify customers
  const newCustomers = Object.values(customerOrders).filter(
    (orders) => orders.length === 1,
  ).length;
  const returningCustomers = Object.values(customerOrders).filter(
    (orders) => orders.length > 1,
  ).length;

  return {
    totalCustomers: dashboardData?.totalUsers || uniqueCustomers.size,
    newCustomers,
    returningCustomers,
    customerGrowth:
      newCustomers > 0 ? (newCustomers / (uniqueCustomers.size || 1)) * 100 : 0,
    avgOrdersPerCustomer:
      uniqueCustomers.size > 0 ? orders.length / uniqueCustomers.size : 0,
    customerSegments: [
      {
        segment: "Khách hàng mới (1 đơn)",
        count: newCustomers,
        percentage: Math.round(
          (newCustomers / (uniqueCustomers.size || 1)) * 100,
        ),
      },
      {
        segment: "Khách quay lại (2+ đơn)",
        count: returningCustomers,
        percentage: Math.round(
          (returningCustomers / (uniqueCustomers.size || 1)) * 100,
        ),
      },
      {
        segment: "VIP (5+ đơn)",
        count: Object.values(customerOrders).filter(
          (orders) => orders.length >= 5,
        ).length,
        percentage: Math.round(
          (Object.values(customerOrders).filter((orders) => orders.length >= 5)
            .length /
            (uniqueCustomers.size || 1)) *
            100,
        ),
      },
    ],
  };
};

// Helper: Tính product analytics từ products API
const calculateProductAnalytics = (products, orders) => {
  // Calculate sales from orders
  const productSales = {};

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const productId = item.product?._id || item.productId;
      if (productId) {
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            name: item.product?.name || "Unknown Product",
            totalSold: 0,
            totalRevenue: 0,
          };
        }
        productSales[productId].totalSold += item.quantity || 0;
        productSales[productId].totalRevenue +=
          (item.price || 0) * (item.quantity || 0);
      }
    });
  });

  // Get top selling products
  const topSellingProducts = Object.values(productSales)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 10)
    .map((product) => ({
      id: product.productId,
      name: product.name || "Unknown Product",
      sold: product.totalSold,
      revenue: product.totalRevenue,
    }));

  // Calculate category performance from products
  const categoryStats = {};
  products.forEach((product) => {
    const category = product.brand || "Other";
    if (!categoryStats[category]) {
      categoryStats[category] = { category, count: 0, totalStock: 0 };
    }
    categoryStats[category].count += 1;
    categoryStats[category].totalStock += product.stock || 0;
  });

  const categoryPerformance = Object.values(categoryStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((cat, index) => ({
      category: cat.category,
      percentage: Math.round((cat.count / products.length) * 100),
      revenue: topSellingProducts.reduce((sum, product) => {
        // Match products to categories (simplified)
        return (
          sum +
          (product.name.toLowerCase().includes(cat.category.toLowerCase())
            ? product.revenue
            : 0)
        );
      }, 0),
    }));

  return {
    totalProducts: products.length,
    topSellingProducts,
    categoryPerformance,
    totalStock: products.reduce(
      (sum, product) => sum + (product.stock || 0),
      0,
    ),
    averagePrice:
      products.length > 0
        ? products.reduce((sum, product) => sum + (product.price || 0), 0) /
          products.length
        : 0,
  };
};

// Lấy dữ liệu biểu đồ doanh thu theo tháng
export const getRevenueByMonth = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/dashboard/revenue-by-month", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Lấy người dùng mới
export const getNewUsers = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/dashboard/new-users", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---------------- ANALYTICS ADMIN ----------------
// Phân tích doanh thu theo thời gian tùy chỉnh
export const getRevenueAnalytics = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/revenue", {
    headers: { Authorization: `Bearer ${token}` },
    params, // groupBy: 'month', 'day', 'year'
  });
};

// Phân tích hành vi khách hàng
export const getCustomerAnalytics = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/customers", {
    headers: { Authorization: `Bearer ${token}` },
    params, // startDate, endDate
  });
};

// Phân tích sản phẩm chi tiết
export const getProductAnalytics = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/products", {
    headers: { Authorization: `Bearer ${token}` },
    params, // startDate, endDate, category
  });
};

// Phân tích xu hướng và dự đoán
export const getTrendAnalytics = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/trends", {
    headers: { Authorization: `Bearer ${token}` },
    params, // period, type
  });
};

// Báo cáo tổng hợp
export const getComprehensiveReport = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/analytics/report", {
    headers: { Authorization: `Bearer ${token}` },
    params, // startDate, endDate
  });
};

export const getProductVariants = (id) => Http.get(`/products/${id}/variants`);

// ---------------- REPLIES ----------------
export const addReply = (commentId, replyData) => {
  const token = localStorage.getItem("accessToken");
  return Http.post(`/replies/${commentId}/replies`, replyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReplies = (commentId) => {
  const token = localStorage.getItem("accessToken");
  return Http.get(`/replies/${commentId}/replies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteReply = (replyId) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete(`/replies/replies/${replyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ---------------- ADDRESS MANAGEMENT ----------------
// Thêm địa chỉ mới cho user
export const addAddress = (addressData) => {
  const token = localStorage.getItem("accessToken");
  return Http.post("/users/address", addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Cập nhật địa chỉ
export const updateAddress = (addressId, addressData) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(`/users/address/${addressId}`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Xóa địa chỉ
export const deleteAddress = (addressId) => {
  const token = localStorage.getItem("accessToken");
  return Http.delete(`/users/address/${addressId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Lấy thông tin user (bao gồm addresses)
export const getUserInfo = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Tra cứu bảo hành
export const getWarrantyLookup = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/orders/warranty/lookup", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Tra cứu bảo hành cho admin (tất cả đơn hàng)
export const getWarrantyLookupAdmin = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/orders/warranty/admin/lookup", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// API mới theo documentation
// POST /api/warranty - Tạo mới bảo hành thủ công (Admin)
export const createWarranty = (warrantyData) => {
  const token = localStorage.getItem("accessToken");
  return Http.post("/warranty", warrantyData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/warranty - Danh sách bảo hành (Admin)
export const getWarrantyList = (params = {}) => {
  const token = localStorage.getItem("accessToken");
  const queryString = new URLSearchParams(params).toString();
  return Http.get(`/warranty${queryString ? `?${queryString}` : ""}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/warranty/stats - Thống kê bảo hành (Admin)
export const getWarrantyStats = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/warranty/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/warranty/:id - Chi tiết bảo hành (Admin)
export const getWarrantyDetail = (id) => {
  const token = localStorage.getItem("accessToken");
  return Http.get(`/warranty/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// POST /api/warranty/:id/claims - Tạo yêu cầu bảo hành (Admin)
export const createWarrantyClaim = (id, claimData) => {
  const token = localStorage.getItem("accessToken");
  return Http.post(`/warranty/${id}/claims`, claimData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// PUT /api/warranty/:id/claims/:claimId - Cập nhật trạng thái claim (Admin)
export const updateWarrantyClaim = (id, claimId, updateData) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(`/warranty/${id}/claims/${claimId}`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// PUT /api/warranty/:id/void - Hủy bảo hành (Admin)
export const voidWarranty = (id, reason) => {
  const token = localStorage.getItem("accessToken");
  return Http.put(
    `/warranty/${id}/void`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// GET /api/warranty/check/:code - Tra cứu bảo hành (Public)
export const checkWarrantyByCode = (code) => {
  return Http.get(`/warranty/check/${code}`);
};

// GET /api/warranty/user - Lấy danh sách bảo hành của user đăng nhập
export const getUserWarranties = () => {
  const token = localStorage.getItem("accessToken");
  return Http.get("/warranty/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/warranty/check-imei/:imei - Tra cứu bảo hành theo IMEI (Public)
export const checkWarrantyByIMEI = (imei) => {
  return Http.get(`/warranty/check-imei/${imei}`);
};

// ---------------- CHATBOT ----------------
// Public endpoints (không cần đăng nhập)

// Hỏi đáp chung - Endpoint duy nhất cho mọi câu hỏi
export const chatAsk = (message, sessionId) => {
  const token = localStorage.getItem("accessToken");
  return Http.post(
    "/chat/ask",
    { message, sessionId },
    token
      ? {
          headers: { Authorization: `Bearer ${token}` },
        }
      : {},
  );
};

// Tư vấn sản phẩm
export const chatProductInquiry = (message) => {
  return Http.post("/chat/product-inquiry", { message });
};

// Gợi ý sản phẩm
export const chatRecommendations = (preferences) => {
  return Http.post("/chat/recommendations", preferences);
};

// So sánh sản phẩm
export const chatCompareProducts = (productIds) => {
  return Http.post("/chat/compare", { productIds });
};

// Kiểm tra tồn kho
export const chatCheckStock = (productId) => {
  return Http.post("/chat/check-stock", { productId });
};

// Xem chi tiết sản phẩm
export const chatProductDetails = (productId) => {
  return Http.get(`/chat/product-details/${productId}`);
};

// Protected endpoints (cần đăng nhập)

// Tra cứu đơn hàng
export const chatOrderTracking = (message) => {
  const token = localStorage.getItem("accessToken");
  return Http.post(
    "/chat/order-tracking",
    { message },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

// Lịch sử chat
export const chatGetHistory = (sessionId) => {
  const token = localStorage.getItem("accessToken");
  return Http.get(`/chat/history/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Tính toán trả góp sản phẩm
export const calculateInstallment = (data) => {
  const token = localStorage.getItem("accessToken");
  return Http.post("/installment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
