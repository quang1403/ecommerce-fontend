import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  getAllOrdersAdmin,
  getCustomers,
  getCommentsProduct,
  getProducts,
} from "../../../services/Api";
import "../styles/Updates.css";

const Updates = forwardRef(({ showToast }, ref) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdateCount, setLastUpdateCount] = useState(0);
  const [latestCommentUpdate, setLatestCommentUpdate] = useState(null);

  // Format thời gian relative
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

  // Tạo thông báo từ đơn hàng
  const generateOrderUpdates = (orders, users = []) => {
    return orders.slice(0, 10).map((order, index) => {
      // Debug: Log thông tin đơn hàng đầu tiên để kiểm tra customer info
      if (index === 0) {
        console.log("🔍 Sample order data:", {
          customer: order.customer,
          customerId: order.customerId,
          customerInfo: order.customerInfo,
          status: order.status,
          allKeys: Object.keys(order),
        });
      }

      // Tìm user từ danh sách users bằng customerId
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

      // Debug cho customer matching
      if (index === 0) {
        console.log("👤 Customer matching:", {
          customerId,
          matchedUser: matchedUser
            ? {
                id: matchedUser._id,
                name: matchedUser.fullName || matchedUser.name,
              }
            : null,
          finalName: customerName,
        });
      }

      let message = "";
      let type = "order";

      // Xử lý status dạng số (0,1,2,3,4)
      switch (order.status) {
        case 0:
          message = "vừa đặt đơn hàng mới";
          type = "new-order";
          break;
        case 1:
          message = "đơn hàng đã được xác nhận";
          type = "confirmed";
          break;
        case 2:
          message = "đơn hàng đang được giao";
          type = "shipping";
          break;
        case 3:
          message = "đã nhận hàng thành công";
          type = "delivered";
          break;
        case 4:
          message = "đã hủy đơn hàng";
          type = "cancelled";
          break;
        default:
          message = "có cập nhật đơn hàng";
          console.log("⚠️ Unknown status:", order.status, typeof order.status);
      }

      return {
        id: order._id,
        customerName,
        message,
        type,
        time: order.updatedAt || order.createdAt,
        orderId: order._id,
        amount: order.totalAmount,
      };
    });
  };

  // Fetch dữ liệu cập nhật
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      // Lấy song song cả đơn hàng, users, products
      const [ordersResponse, usersResponse, productsResponse] =
        await Promise.all([
          getAllOrdersAdmin(),
          getCustomers().catch((err) => {
            console.warn("⚠️ Không thể lấy danh sách users:", err.message);
            return { data: [] };
          }),
          getProducts().catch(() => ({ data: { data: [] } })),
        ]);

      let orders = [];
      let users = [];
      let products = [];

      // Xử lý orders response
      if (Array.isArray(ordersResponse.data)) {
        orders = ordersResponse.data;
      } else if (Array.isArray(ordersResponse.data?.orders)) {
        orders = ordersResponse.data.orders;
      }

      // Xử lý users response
      if (Array.isArray(usersResponse.data)) {
        users = usersResponse.data;
      } else if (Array.isArray(usersResponse.data?.users)) {
        users = usersResponse.data.users;
      }

      // Xử lý products response
      if (Array.isArray(productsResponse.data?.data)) {
        products = productsResponse.data.data;
      }

      // Sắp xếp theo thời gian mới nhất
      orders.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );

      const orderUpdates = generateOrderUpdates(orders, users);

      // Lấy bình luận mới nhất từ tất cả sản phẩm
      let latestComment = null;
      for (const product of products) {
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
        } catch {}
      }

      if (latestComment) {
        setLatestCommentUpdate({
          id: latestComment._id,
          customerName:
            latestComment.userId?.fullName ||
            latestComment.userId?.name ||
            latestComment.name ||
            "Khách hàng",
          message: `đã bình luận về sản phẩm "${
            latestComment.product?.name || "Sản phẩm"
          }"`,
          type: "comment",
          time: latestComment.createdAt,
        });
      } else {
        setLatestCommentUpdate(null);
      }

      setUpdates(orderUpdates);
      setLastUpdateCount(orderUpdates.length);
    } catch (error) {
      console.error("❌ Lỗi khi tải cập nhật:", error);
      setUpdates([]);
      setLatestCommentUpdate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();

    // Auto refresh mỗi 30 giây
    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  // Expose refresh function for external use
  useImperativeHandle(ref, () => ({
    refreshUpdates: fetchUpdates,
  }));

  // Icon theo loại cập nhật
  const getUpdateIcon = (type) => {
    switch (type) {
      case "new-order":
        return "🛒";
      case "confirmed":
        return "✅";
      case "shipping":
        return "🚚";
      case "delivered":
        return "📦";
      case "cancelled":
        return "❌";
      case "comment":
        return "💬";
      default:
        return "📋";
    }
  };

  // Màu theo loại cập nhật
  const getUpdateColor = (type) => {
    switch (type) {
      case "new-order":
        return "#4CAF50";
      case "confirmed":
        return "#2196F3";
      case "shipping":
        return "#FF9800";
      case "delivered":
        return "#8BC34A";
      case "cancelled":
        return "#f44336";
      case "comment":
        return "#007bff";
      default:
        return "#9E9E9E";
    }
  };

  if (loading) {
    return (
      <div className="Updates">
        <div className="updates-loading">
          <div className="loading-spinner"></div>
          <span>Đang tải cập nhật...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="Updates">
      <div className="updates-header">
        <h3>🔔 Cập nhật gần đây</h3>
        <button className="refresh-btn" onClick={fetchUpdates} title="Làm mới">
          🔄
        </button>
      </div>

      {/* Hiển thị thông báo bình luận mới nhất nếu có */}
      {latestCommentUpdate && (
        <div className="update" key={latestCommentUpdate.id}>
          <div
            className="update-icon"
            style={{
              backgroundColor: getUpdateColor(latestCommentUpdate.type),
            }}
          >
            {getUpdateIcon(latestCommentUpdate.type)}
          </div>
          <div className="noti">
            <div className="update-content">
              <span className="customer-name">
                {latestCommentUpdate.customerName}
              </span>
              <span className="update-message">
                {" "}
                {latestCommentUpdate.message}
              </span>
            </div>
            <div className="update-meta">
              <span className="update-time">
                {formatTimeAgo(latestCommentUpdate.time)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị các cập nhật đơn hàng như cũ */}
      {updates.length === 0 ? (
        <div className="no-updates">
          <span>Không có cập nhật nào</span>
        </div>
      ) : (
        updates.map((update) => (
          <div className="update" key={update.id}>
            <div
              className="update-icon"
              style={{ backgroundColor: getUpdateColor(update.type) }}
            >
              {getUpdateIcon(update.type)}
            </div>
            <div className="noti">
              <div className="update-content">
                <span className="customer-name">{update.customerName}</span>
                <span className="update-message"> {update.message}</span>
                {update.orderId && (
                  <span className="order-id">#{update.orderId.slice(-6)}</span>
                )}
              </div>
              <div className="update-meta">
                <span className="update-time">
                  {formatTimeAgo(update.time)}
                </span>
                {update.amount && (
                  <span className="update-amount">
                    {(update.amount / 1000000).toFixed(1)}M ₫
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
});

export default Updates;
