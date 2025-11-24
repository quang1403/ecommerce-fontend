import React, { useEffect, useState } from "react";
import { getOrdersByUser, deleteOrder } from "../../services/Api";
import { Link } from "react-router-dom";
import styles from "./OrderList.module.css";

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

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersByUser();
        setOrders(res.data || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Tính tổng tiền tất cả đơn hàng (ưu tiên lấy từ totalPrice, rồi total, nếu không có thì tính lại)
  const totalAllOrders = orders.reduce((sum, order) => {
    if (order.totalPrice) return sum + order.totalPrice;
    if (order.total) return sum + order.total;
    if (order.items && Array.isArray(order.items)) {
      const itemsTotal = order.items.reduce(
        (s, item) => s + (item.price || 0) * (item.quantity || 1),
        0
      );
      return sum + itemsTotal;
    }
    return sum;
  }, 0);

  return (
    <div className={styles.modernOrderContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <i className="fas fa-shopping-bag"></i>
          Đơn hàng của bạn
        </h1>
        <p className={styles.pageSubtitle}>
          Theo dõi và quản lý đơn hàng của bạn
        </p>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-receipt"></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{orders.length}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-money-bill-wave"></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{totalAllOrders.toLocaleString()}đ</h3>
            <p>Tổng giá trị</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <i className="fas fa-truck"></i>
          </div>
          <div className={styles.statInfo}>
            <h3>{orders.filter((o) => o.status === 2).length}</h3>
            <p>Đang giao</p>
          </div>
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalDialog}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <i className="fas fa-file-invoice"></i>
                Chi tiết đơn hàng
              </h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.orderInfo}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <i className="fas fa-hashtag"></i>
                    <div>
                      <label>Mã đơn hàng</label>
                      <span>{selectedOrder._id}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className="fas fa-calendar"></i>
                    <div>
                      <label>Ngày đặt</label>
                      <span>
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className="fas fa-info-circle"></i>
                    <div>
                      <label>Trạng thái</label>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[`status${selectedOrder.status}`]
                        }`}
                      >
                        {(() => {
                          switch (selectedOrder.status) {
                            case 0:
                              return "Chờ xác nhận";
                            case 1:
                              return "Đã xác nhận";
                            case 2:
                              return "Đang giao";
                            case 3:
                              return "Đã giao";
                            case 4:
                              return "Đã huỷ";
                            default:
                              return "Không xác định";
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className="fas fa-money-bill"></i>
                    <div>
                      <label>Tổng tiền</label>
                      <span className={styles.totalAmount}>
                        {(
                          selectedOrder.totalPrice ||
                          selectedOrder.total ||
                          (selectedOrder.items &&
                          Array.isArray(selectedOrder.items)
                            ? selectedOrder.items.reduce(
                                (s, item) =>
                                  s + (item.price || 0) * (item.quantity || 1),
                                0
                              )
                            : 0)
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <label>Địa chỉ giao hàng</label>
                      <span>{selectedOrder.address}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className="fas fa-phone"></i>
                    <div>
                      <label>Số điện thoại</label>
                      <span>{selectedOrder.phone}</span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <i className="fas fa-sticky-note"></i>
                    <div>
                      <label>Ghi chú</label>
                      <span>{selectedOrder.note || "Không có ghi chú"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.productSection}>
                <h4 className={styles.sectionTitle}>
                  <i className="fas fa-shopping-cart"></i>
                  Danh sách sản phẩm
                </h4>
                {selectedOrder.items?.map((item, idx) => {
                  // Xử lý màu sắc: có thể là string, array, hoặc nằm trong variant
                  let color = null;
                  if (item.variant?.color) {
                    color = Array.isArray(item.variant.color)
                      ? item.variant.color[0]
                      : item.variant.color;
                  } else if (item.color) {
                    color = Array.isArray(item.color)
                      ? item.color[0]
                      : item.color;
                  } else if (item.productId?.color) {
                    color = Array.isArray(item.productId.color)
                      ? item.productId.color[0]
                      : item.productId.color;
                  }

                  // Xử lý ram, storage
                  const ram = item.variant?.ram || item.ram || "";
                  const storage = item.variant?.storage || item.storage || "";

                  return (
                    <div key={idx} className={styles.productItem}>
                      <div className={styles.productInfo}>
                        <h5>{item.productId?.name || "Sản phẩm"}</h5>
                        <div className={styles.productSpecs}>
                          {color && (
                            <span className={styles.spec}>Màu: {color}</span>
                          )}
                          {isHeadphoneProduct(
                            item.productId
                          ) ? // Headphone specs - only color (already shown above)
                          null : (
                            // Phone specs
                            <>
                              {ram && (
                                <span className={styles.spec}>
                                  RAM: {ram}GB
                                </span>
                              )}
                              {storage && (
                                <span className={styles.spec}>
                                  Bộ nhớ: {storage}GB
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className={styles.productQuantity}>
                        <span>SL: {item.quantity}</span>
                      </div>
                      <div className={styles.productPrice}>
                        <span>{item.price?.toLocaleString()}đ</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.actionButtons}>
                {/* Nút hủy đơn nếu chưa bị hủy */}
                {selectedOrder.status !== 4 && (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn hủy đơn hàng này?"
                        )
                      ) {
                        try {
                          const { updateOrderStatus } = await import(
                            "../../services/Api"
                          );
                          await updateOrderStatus(selectedOrder._id, 4);
                          setSelectedOrder({ ...selectedOrder, status: 4 });
                          setOrders(
                            orders.map((o) =>
                              o._id === selectedOrder._id
                                ? { ...o, status: 4 }
                                : o
                            )
                          );
                        } catch (err) {
                          alert("Hủy đơn thất bại!");
                        }
                      }
                    }}
                  >
                    <i className="fas fa-times"></i>
                    Hủy đơn hàng
                  </button>
                )}
                {/* Nút xóa đơn hàng nếu đã huỷ (status = 4) */}
                {selectedOrder.status === 4 && (
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn xóa đơn hàng này?"
                        )
                      ) {
                        try {
                          await deleteOrder(selectedOrder._id);
                          setShowModal(false);
                          setOrders((prevOrders) =>
                            prevOrders.filter(
                              (o) => o._id !== selectedOrder._id
                            )
                          );
                          alert("Xóa đơn hàng thành công!");
                        } catch (err) {
                          console.error("Lỗi xóa đơn hàng:", err);
                          alert("Xóa đơn hàng thất bại! Vui lòng thử lại.");
                        }
                      }
                    }}
                  >
                    <i className="fas fa-trash"></i>
                    Xóa đơn hàng
                  </button>
                )}
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.closeBtn}`}
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-check"></i>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className={styles.ordersContent}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-inbox"></i>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
            <Link to="/" className={styles.shopNowBtn}>
              <i className="fas fa-shopping-cart"></i>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <div
                key={order._id}
                className={`${styles.orderCard} ${
                  styles[`status${order.status}`]
                }`}
              >
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <h4 className={styles.orderDate}>
                      <i className="fas fa-calendar"></i>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </h4>
                    <p className={styles.orderId}>Mã đơn: {order._id}</p>
                  </div>
                  <div className={styles.orderAmount}>
                    <span className={styles.amount}>
                      {(
                        order.totalPrice ||
                        order.total ||
                        (order.items && Array.isArray(order.items)
                          ? order.items.reduce(
                              (s, item) =>
                                s + (item.price || 0) * (item.quantity || 1),
                              0
                            )
                          : 0)
                      ).toLocaleString()}
                      đ
                    </span>
                  </div>
                </div>

                <div className={styles.orderActions}>
                  <button
                    type="button"
                    className={styles.detailBtn}
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    Chi tiết
                  </button>

                  <span
                    className={`${styles.statusBadge} ${
                      styles[`status${order.status}`]
                    }`}
                  >
                    {order.status === 0 && (
                      <>
                        <i className="fas fa-clock"></i> Chờ xác nhận
                      </>
                    )}
                    {order.status === 1 && (
                      <>
                        <i className="fas fa-check"></i> Đã xác nhận
                      </>
                    )}
                    {order.status === 2 && (
                      <>
                        <i className="fas fa-truck"></i> Đang giao
                      </>
                    )}
                    {order.status === 3 && (
                      <>
                        <i className="fas fa-check-circle"></i> Đã giao
                      </>
                    )}
                    {order.status === 4 && (
                      <>
                        <i className="fas fa-times-circle"></i> Đã hủy
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}

            <div className={styles.orderFooter}>
              <Link to="/" className={styles.backHomeBtn}>
                <i className="fas fa-home"></i>
                Quay về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
