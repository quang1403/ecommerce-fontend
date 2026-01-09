import React, { useEffect, useState } from "react";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  getProducts,
} from "../../../services/Api";
import "../styles/OrderManagement.css";

// Helper function to determine if product is headphone
const isHeadphoneProduct = (product) => {
  if (!product) return false;

  const categoryName = product.category?.name?.toLowerCase() || "";

  // Check category name
  if (
    categoryName.includes("tai nghe") ||
    categoryName.includes("headphone") ||
    categoryName.includes("earphone") ||
    categoryName.includes("earbud") ||
    categoryName.includes("phụ kiện")
  ) {
    return true;
  }

  // Check specs for headphone-specific fields
  if (
    product.specs &&
    Object.keys(product.specs).some((key) =>
      [
        "connectionType",
        "driverSize",
        "impedance",
        "frequency",
        "noiseReduction",
        "batteryLife",
      ].includes(key)
    )
  ) {
    return true;
  }

  return false;
};

const statusOptions = [
  { value: 0, label: "Chờ xác nhận", color: "#f59e0b" },
  { value: 1, label: "Đã xác nhận", color: "#3b82f6" },
  { value: 2, label: "Đang giao", color: "#8b5cf6" },
  { value: 3, label: "Hoàn thành", color: "#10b981" },
  { value: 4, label: "Đã hủy", color: "#ef4444" },
];

const OrderManagement = ({ showToast, refreshUpdates }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Số đơn hàng mỗi trang

  // Fetch orders from API (Admin version) và enrichment với product data
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Lấy orders và products đồng thời
      const [ordersRes, productsRes] = await Promise.all([
        getAllOrdersAdmin(),
        getProducts(),
      ]);

      console.log("📦 Admin API Response:", ordersRes); // Debug API response

      let orderList = [];
      // Xử lý response dựa trên cấu trúc API admin trả về
      if (ordersRes.data && Array.isArray(ordersRes.data.orders)) {
        orderList = ordersRes.data.orders;
      } else if (Array.isArray(ordersRes.orders)) {
        orderList = ordersRes.orders;
      } else if (Array.isArray(ordersRes.data)) {
        orderList = ordersRes.data;
      } else if (Array.isArray(ordersRes)) {
        orderList = ordersRes;
      }

      // Lấy danh sách sản phẩm
      let productList = [];
      if (Array.isArray(productsRes.data?.data)) {
        productList = productsRes.data.data;
      } else if (Array.isArray(productsRes.data)) {
        productList = productsRes.data;
      }

      console.log("📋 Products loaded:", productList.length);

      // Tạo map sản phẩm theo ID để lookup nhanh
      const productMap = {};
      productList.forEach((product) => {
        productMap[product._id] = product;
      });

      // Enrich orders với thông tin sản phẩm
      const enrichedOrders = orderList.map((order) => {
        if (order.items && Array.isArray(order.items)) {
          const enrichedItems = order.items.map((item) => {
            const product = productMap[item.productId];
            return {
              ...item,
              product: product || null,
              productName: product
                ? product.name
                : item.productName || `Sản phẩm ID: ${item.productId}`,
            };
          });
          return {
            ...order,
            items: enrichedItems,
          };
        }
        return order;
      });

      console.log("📋 Admin Orders loaded:", enrichedOrders.length); // Debug orders count
      console.log("📋 Sample enriched order:", enrichedOrders[0]); // Debug first order

      setOrders(enrichedOrders);
      setFilteredOrders(enrichedOrders); // Initialize filtered orders
    } catch (err) {
      console.error("❌ Error fetching admin orders:", err);
      console.error("Error details:", err.response?.data || err.message);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate order statistics
  const getOrderStats = () => {
    const stats = statusOptions.map((status) => ({
      ...status,
      count: orders.filter((order) => order.status === status.value).length,
    }));
    return stats;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by order ID
    if (orderIdFilter.trim()) {
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(orderIdFilter.toLowerCase()) ||
          order.id?.toString().includes(orderIdFilter)
      );
    }

    // Filter by status
    if (statusFilter !== "") {
      filtered = filtered.filter(
        (order) => order.status === parseInt(statusFilter)
      );
    }

    // Filter by customer name
    if (customerNameFilter.trim()) {
      filtered = filtered.filter((order) => {
        const customerInfo = order.customerId;
        if (typeof customerInfo === "object") {
          const fullName = `${customerInfo.firstName || ""} ${
            customerInfo.lastName || ""
          }`.toLowerCase();
          return (
            fullName.includes(customerNameFilter.toLowerCase()) ||
            customerInfo.email
              ?.toLowerCase()
              .includes(customerNameFilter.toLowerCase()) ||
            customerInfo.phone?.includes(customerNameFilter)
          );
        }
        return false;
      });
    }

    // Filter by date range
    if (startDateFilter) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(startDateFilter);
        startDate.setHours(0, 0, 0, 0);
        return orderDate >= startDate;
      });
    }

    if (endDateFilter) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59, 999);
        return orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
  };

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  }, [
    orders,
    orderIdFilter,
    statusFilter,
    customerNameFilter,
    startDateFilter,
    endDateFilter,
  ]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open order detail modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Update order status (Admin version)
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      console.log(
        `🔄 Updating order ${selectedOrder._id} to status ${newStatus} (Admin)`
      );
      await updateOrderStatusAdmin(selectedOrder._id, newStatus);
      closeModal();
      fetchOrders();
      if (showToast) showToast("Cập nhật trạng thái thành công!", "success");
      console.log("✅ Admin status updated successfully");
    } catch (err) {
      console.error("❌ Error updating admin status:", err);
      console.error("Error details:", err.response?.data || err.message);
      if (showToast) showToast("Cập nhật trạng thái thất bại!", "error");
    }
  };

  const orderListStyles = {
    container: {
      padding: "16px",
      maxWidth: "1000px",
      margin: "0 auto",
      background: "#f6f8fa",
      minHeight: "100vh",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    },
    header: {
      marginBottom: "20px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      padding: "16px 20px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    title: {
      color: "#1a202c",
      marginBottom: "4px",
      fontSize: "1.8rem",
      fontWeight: "600",
      margin: "0",
    },
    tableContainer: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.9rem",
    },
    th: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "12px 16px",
      textAlign: "left",
      fontWeight: "600",
      borderBottom: "2px solid #e2e8f0",
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #e2e8f0",
      background: "rgba(255, 255, 255, 0.8)",
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "white",
      display: "inline-block",
    },
    button: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },
    modalOverlay: {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "1000",
    },
    modalContent: {
      background: "white",
      borderRadius: "16px",
      padding: "24px",
      maxWidth: "800px",
      width: "90%",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    },
    // Statistics styles
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      textAlign: "center",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "default",
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: "#64748b",
      fontWeight: "500",
    },
    // Filter styles
    filtersContainer: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      alignItems: "end",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
    },
    filterLabel: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "6px",
    },
    filterInput: {
      padding: "10px 12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.9rem",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "border-color 0.2s ease",
      outline: "none",
    },
    filterSelect: {
      padding: "10px 12px",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.9rem",
      background: "rgba(255, 255, 255, 0.9)",
      transition: "border-color 0.2s ease",
      outline: "none",
      cursor: "pointer",
    },
    clearButton: {
      background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
      color: "#64748b",
      border: "2px solid #cbd5e1",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "600",
      transition: "all 0.2s ease",
      height: "fit-content",
    },
  };

  if (loading) {
    return (
      <div style={orderListStyles.container}>
        <div style={orderListStyles.header}>
          <h1 style={orderListStyles.title}>Quản lý đơn hàng</h1>
        </div>
        <div
          style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          Đang tải danh sách đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div style={orderListStyles.container}>
      <div style={orderListStyles.header}>
        <h1 style={orderListStyles.title}>Quản lý đơn hàng</h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500",
            margin: "0",
          }}
        >
          Tổng số đơn hàng: {orders.length} | Hiển thị: {filteredOrders.length}{" "}
          | Trang {currentPage}/{totalPages}
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div style={orderListStyles.statsContainer}>
        {getOrderStats().map((stat, index) => (
          <div
            key={index}
            style={{
              ...orderListStyles.statCard,
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div style={orderListStyles.statNumber}>{stat.count}</div>
            <div style={orderListStyles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={orderListStyles.filtersContainer}>
        <div style={orderListStyles.filterGroup}>
          <label style={orderListStyles.filterLabel}>Mã đơn hàng:</label>
          <input
            type="text"
            placeholder="Nhập mã đơn hàng..."
            value={orderIdFilter}
            onChange={(e) => setOrderIdFilter(e.target.value)}
            style={orderListStyles.filterInput}
          />
        </div>

        <div style={orderListStyles.filterGroup}>
          <label style={orderListStyles.filterLabel}>Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={orderListStyles.filterSelect}
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div style={orderListStyles.filterGroup}>
          <label style={orderListStyles.filterLabel}>Khách hàng:</label>
          <input
            type="text"
            placeholder="Tên, email hoặc số điện thoại..."
            value={customerNameFilter}
            onChange={(e) => setCustomerNameFilter(e.target.value)}
            style={orderListStyles.filterInput}
          />
        </div>

        <div style={orderListStyles.filterGroup}>
          <label style={orderListStyles.filterLabel}>Từ ngày:</label>
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            style={orderListStyles.filterInput}
          />
        </div>

        <div style={orderListStyles.filterGroup}>
          <label style={orderListStyles.filterLabel}>Đến ngày:</label>
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            style={orderListStyles.filterInput}
          />
        </div>

        <button
          onClick={() => {
            setOrderIdFilter("");
            setStatusFilter("");
            setCustomerNameFilter("");
            setStartDateFilter("");
            setEndDateFilter("");
          }}
          style={orderListStyles.clearButton}
        >
          Xóa bộ lọc
        </button>
      </div>

      <div style={orderListStyles.tableContainer}>
        <table style={orderListStyles.table}>
          <thead>
            <tr>
              <th style={orderListStyles.th}>Mã đơn hàng</th>
              <th style={orderListStyles.th}>Khách hàng</th>
              <th style={orderListStyles.th}>Ngày đặt</th>
              <th style={orderListStyles.th}>Trạng thái</th>
              <th style={orderListStyles.th}>Tổng tiền</th>
              <th style={orderListStyles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    ...orderListStyles.td,
                    textAlign: "center",
                    color: "#64748b",
                    padding: "40px 16px",
                  }}
                >
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => {
                const status = statusOptions.find(
                  (s) => s.value === order.status
                );
                const customerEmail = order.customerId?.email || "N/A";
                const orderDate = new Date(order.createdAt);
                const formattedDate = orderDate.toLocaleDateString("vi-VN");
                const formattedTime = orderDate.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={order._id} style={{ cursor: "pointer" }}>
                    <td style={orderListStyles.td}>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontWeight: "600",
                          color: "#4f46e5",
                        }}
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td style={orderListStyles.td}>
                      <div>
                        <div style={{ fontWeight: "500", color: "#1a202c" }}>
                          {customerEmail}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          SĐT: {order.phone || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td style={orderListStyles.td}>
                      <div>
                        <div style={{ fontWeight: "500" }}>{formattedDate}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {formattedTime}
                        </div>
                      </div>
                    </td>
                    <td style={orderListStyles.td}>
                      <span
                        style={{
                          ...orderListStyles.statusBadge,
                          background: status?.color || "#64748b",
                        }}
                      >
                        {status?.label || `Trạng thái ${order.status}`}
                      </span>
                    </td>
                    <td style={orderListStyles.td}>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#059669",
                          fontSize: "1rem",
                        }}
                      >
                        {order.total?.toLocaleString("vi-VN")}₫
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {order.items?.length || 0} sản phẩm
                      </div>
                    </td>
                    <td style={orderListStyles.td}>
                      <button
                        style={orderListStyles.button}
                        onClick={() => openModal(order)}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "translateY(-2px)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "translateY(0)")
                        }
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredOrders.length)} trong số{" "}
            {filteredOrders.length} đơn hàng
          </div>

          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ← Trước
            </button>

            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="page-btn page-btn-ellipsis"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`page-btn ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Sau →
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {modalOpen && selectedOrder && (
        <div style={orderListStyles.modalOverlay} onClick={closeModal}>
          <div
            style={orderListStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2 style={{ margin: "0", color: "#1a202c" }}>
                Chi tiết đơn hàng #{selectedOrder._id.slice(-8)}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>

            {/* Order Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
                padding: "16px",
                background: "#f8fafc",
                borderRadius: "8px",
              }}
            >
              <div>
                <strong>Email:</strong> {selectedOrder.customerId?.email}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </div>
              <div>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
              </div>
              <div>
                <strong>Trạng thái:</strong>
                <span
                  style={{
                    ...orderListStyles.statusBadge,
                    background:
                      statusOptions.find(
                        (s) => s.value === selectedOrder.status
                      )?.color || "#64748b",
                    marginLeft: "8px",
                  }}
                >
                  {statusOptions.find((s) => s.value === selectedOrder.status)
                    ?.label || selectedOrder.status}
                </span>
              </div>
              <div>
                <strong>Địa chỉ:</strong> {selectedOrder.address}
              </div>
              <div>
                <strong>Phương thức thanh toán:</strong>{" "}
                {selectedOrder.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "Thanh toán online"}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <strong>Ghi chú:</strong> {selectedOrder.note || "Không có"}
              </div>
            </div>

            {/* Products Table */}
            <h3 style={{ marginBottom: "12px", color: "#1a202c" }}>
              Sản phẩm đặt hàng
            </h3>
            <div style={{ overflow: "auto", marginBottom: "24px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #e2e8f0",
                }}
              >
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        textAlign: "left",
                      }}
                    >
                      Sản phẩm
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        textAlign: "center",
                      }}
                    >
                      SL
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        textAlign: "right",
                      }}
                    >
                      Đơn giá
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        textAlign: "right",
                      }}
                    >
                      Thành tiền
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        border: "1px solid #e2e8f0",
                        textAlign: "left",
                      }}
                    >
                      Cấu hình
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => {
                    // Ưu tiên giá từ variant, nếu không có thì dùng price của item
                    const price = item.variant?.price || item.price || 0;
                    const total = price * (item.quantity || 1);

                    // Tạo chuỗi thông tin variant
                    let variantInfo = [];
                    if (item.variant) {
                      if (item.variant.color)
                        variantInfo.push(`Màu: ${item.variant.color}`);

                      // Check if it's a headphone product to show appropriate specs
                      if (isHeadphoneProduct(item.product)) {
                        // For headphones, only color is shown (already added above)
                      } else {
                        // Phone specs
                        if (item.variant.ram)
                          variantInfo.push(`RAM: ${item.variant.ram}GB`);
                        if (item.variant.storage)
                          variantInfo.push(`Bộ nhớ: ${item.variant.storage}`);
                      }
                    }

                    const variantStr =
                      variantInfo.length > 0
                        ? variantInfo.join(" | ")
                        : "Cấu hình mặc định";

                    return (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div>
                            <div
                              style={{ fontWeight: "500", color: "#1a202c" }}
                            >
                              {item.product?.name ||
                                item.productName ||
                                `Sản phẩm ID: ${item.productId}`}
                            </div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "#64748b",
                                marginTop: "4px",
                              }}
                            >
                              {item.product?.brand?.name
                                ? `Thương hiệu: ${item.product.brand.name}`
                                : item.product?.category?.name
                                ? `Danh mục: ${item.product.category.name}`
                                : item.product
                                ? `Giá: ${item.product.price?.toLocaleString()}₫`
                                : `ID: ${item.productId}`}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              background: "#f1f5f9",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontWeight: "600",
                            }}
                          >
                            {item.quantity}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            textAlign: "right",
                          }}
                        >
                          <div style={{ fontWeight: "500", color: "#059669" }}>
                            {price.toLocaleString("vi-VN")}₫
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "600",
                              color: "#dc2626",
                              fontSize: "1rem",
                            }}
                          >
                            {total.toLocaleString("vi-VN")}₫
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: item.variant ? "#4f46e5" : "#64748b",
                              fontWeight: item.variant ? "500" : "normal",
                              background: item.variant ? "#ede9fe" : "#f8fafc",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: `1px solid ${
                                item.variant ? "#d8b4fe" : "#e2e8f0"
                              }`,
                            }}
                          >
                            {variantStr}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "#f1f5f9",
                borderRadius: "8px",
              }}
            >
              <div>
                <strong style={{ fontSize: "1.2rem", color: "#1a202c" }}>
                  Tổng cộng: {selectedOrder.total?.toLocaleString()}₫
                </strong>
              </div>
            </div>

            {/* Status Update */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: "600", alignSelf: "center" }}>
                Cập nhật trạng thái:
              </span>
              {selectedOrder.status === 4 ? (
                // Nếu đơn hàng đã bị hủy, chỉ hiển thị thông báo
                <div
                  style={{
                    padding: "8px 16px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    border: "1px solid #fecaca",
                  }}
                >
                  ❌ Đơn hàng đã bị hủy - Không thể thay đổi trạng thái
                </div>
              ) : selectedOrder.status === 3 ? (
                // Nếu đơn hàng đã hoàn thành, chỉ hiển thị thông báo
                <div
                  style={{
                    padding: "8px 16px",
                    background: "#d1fae5",
                    color: "#059669",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    border: "1px solid #6ee7b7",
                  }}
                >
                  ✅ Đơn hàng đã hoàn thành - Không thể thay đổi trạng thái
                </div>
              ) : (
                // Hiển thị các nút trạng thái có thể thay đổi
                statusOptions
                  .filter((status) => {
                    // Nếu đơn hàng đã xác nhận (status >= 1), ẩn nút "Chờ xác nhận" (status = 0)
                    if (selectedOrder.status >= 1 && status.value === 0) {
                      return false;
                    }
                    // Không hiển thị nút "Đã hủy" nếu đơn hàng không phải đang ở trạng thái "Chờ xác nhận"
                    if (status.value === 4 && selectedOrder.status !== 0) {
                      return false;
                    }
                    return true;
                  })
                  .map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      disabled={selectedOrder.status === status.value}
                      style={{
                        padding: "8px 16px",
                        border:
                          selectedOrder.status === status.value
                            ? "2px solid #1a202c"
                            : "1px solid #e2e8f0",
                        background:
                          selectedOrder.status === status.value
                            ? status.color
                            : "white",
                        color:
                          selectedOrder.status === status.value
                            ? "white"
                            : status.color,
                        borderRadius: "6px",
                        cursor:
                          selectedOrder.status === status.value
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        opacity:
                          selectedOrder.status === status.value ? 0.7 : 1,
                      }}
                    >
                      {status.label}
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;
