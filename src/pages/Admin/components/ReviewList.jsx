import React, { useEffect, useState } from "react";
import { getImageProduct } from "../../../shared/utils";
import {
  getProducts,
  getCommentsProduct,
  deleteComment,
  addReply,
  getReplies,
  deleteReply,
  updateCommentStatus,
} from "../../../services/Api";
import "../styles/ReviewList.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    product: "",
    status: "",
    rating: "",
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replies, setReplies] = useState({}); // {commentId: [reply, ...]}
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch all reviews from all products
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const productsRes = await getProducts();
      const productList = Array.isArray(productsRes.data?.data)
        ? productsRes.data.data
        : [];
      setProducts(productList);

      // Get reviews for all products
      const allReviews = [];
      for (const product of productList) {
        try {
          const reviewsRes = await getCommentsProduct(product._id);
          const productReviews = Array.isArray(reviewsRes.data?.data)
            ? reviewsRes.data.data
            : [];
          productReviews.forEach((review) => {
            allReviews.push({
              ...review,
              product: product,
              status: review.status || "pending", // Default status
            });
          });
        } catch (err) {
          console.error(`Error fetching reviews for ${product.name}:`, err);
        }
      }
      setReviews(allReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (filters.search?.trim()) {
      const searchTerm = filters.search.toLowerCase();
      if (
        !review.name?.toLowerCase().includes(searchTerm) &&
        !review.email?.toLowerCase().includes(searchTerm) &&
        !review.product?.name?.toLowerCase().includes(searchTerm) &&
        !review.content?.toLowerCase().includes(searchTerm)
      )
        return false;
    }
    if (filters.product && review.product?._id !== filters.product)
      return false;
    if (filters.status && review.status !== filters.status) return false;
    if (
      filters.rating &&
      review.rating &&
      review.rating !== Number(filters.rating)
    )
      return false;
    return true;
  });

  const pagedReviews = filteredReviews.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(filteredReviews.length / pageSize);

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      try {
        await deleteComment(reviewId);
        fetchReviews(); // Refresh data from server
        alert("Đã xóa đánh giá thành công!");
      } catch (err) {
        alert("Xóa đánh giá thất bại!");
      }
    }
  };

  // Handle approve/reject review
  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      await updateCommentStatus(reviewId, newStatus);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === reviewId ? { ...review, status: newStatus } : review
        )
      );
      alert("Đã cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  // Handle reply to review
  const handleReplyToReview = async (reviewId) => {
    if (!replyText.trim()) {
      alert("Vui lòng nhập nội dung trả lời!");
      return;
    }
    try {
      await addReply(reviewId, {
        content: replyText,
        adminReply: true,
      });
      await fetchRepliesForReview(reviewId); // Refresh replies
      setReplyText("");
      setReplyingTo(null);
      alert("Đã trả lời thành công!");
    } catch (err) {
      alert("Trả lời thất bại!");
    }
  };

  // Fetch replies for a review
  const fetchRepliesForReview = async (reviewId) => {
    try {
      const res = await getReplies(reviewId);
      setReplies((prev) => ({ ...prev, [reviewId]: res.data?.data || [] }));
    } catch (err) {
      setReplies((prev) => ({ ...prev, [reviewId]: [] }));
    }
  };

  // Fetch replies for all reviews after loading
  useEffect(() => {
    if (!loading) {
      reviews.forEach((review) => {
        fetchRepliesForReview(review._id);
      });
    }
    // eslint-disable-next-line
  }, [loading, reviews.length]);

  // Handle delete reply
  const handleDeleteReply = async (replyId, reviewId) => {
    if (window.confirm("Bạn có chắc muốn xóa phản hồi này?")) {
      try {
        await deleteReply(replyId);
        await fetchRepliesForReview(reviewId);
        alert("Đã xóa phản hồi thành công!");
      } catch (err) {
        alert("Xóa phản hồi thất bại!");
      }
    }
  };

  // Start replying to a review
  const startReply = (reviewId) => {
    setReplyingTo(reviewId);
    setReplyText("");
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const renderStars = (rating = 5) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? "active" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      product: "",
      status: "",
      rating: "",
    });
  };

  return (
    <div className="ReviewList">
      <div className="review-header">
        <h2>Quản lý đánh giá sản phẩm</h2>
        <div className="review-stats">
          <span className="stat-item">
            Tổng: <strong>{reviews.length}</strong>
          </span>
          <span className="stat-item">
            Chờ duyệt:{" "}
            <strong>
              {reviews.filter((r) => r.status === "pending").length}
            </strong>
          </span>
          <span className="stat-item">
            Đã duyệt:{" "}
            <strong>
              {reviews.filter((r) => r.status === "approved").length}
            </strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="review-filter-bar">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá, sản phẩm, người dùng..."
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            className="search-input"
          />
          <select
            value={filters.product}
            onChange={(e) =>
              setFilters((f) => ({ ...f, product: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">-- Tất cả sản phẩm --</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">-- Trạng thái --</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <select
            value={filters.rating}
            onChange={(e) =>
              setFilters((f) => ({ ...f, rating: e.target.value }))
            }
            className="filter-select"
          >
            <option value="">-- Số sao --</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <button className="clear-filter-btn" onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="loading-container">Đang tải đánh giá...</div>
      ) : (
        <div className="reviews-table-wrapper">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Người đánh giá</th>
                <th>Nội dung</th>
                <th>Đánh giá</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pagedReviews.length > 0 ? (
                pagedReviews.map((review) => (
                  <React.Fragment key={review._id}>
                    <tr>
                      <td>
                        <div className="product-info">
                          <div className="product-image">
                            {review.product?.images?.[0] ? (
                              <img
                                src={getImageProduct(review.product.images[0])}
                                alt={review.product.name}
                              />
                            ) : (
                              <div className="product-placeholder">📱</div>
                            )}
                          </div>
                          <div className="product-details">
                            <div className="product-name">
                              {review.product?.name}
                            </div>
                            <div className="product-id">
                              ID: {review.product?._id?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="reviewer-info">
                          <div className="reviewer-name">
                            {review.userId?.fullName ||
                              review.userId?.name ||
                              review.user?.fullName ||
                              review.user?.name ||
                              review.name ||
                              "Khách hàng"}
                          </div>
                          <div className="reviewer-email">
                            {review.userId?.email ||
                              review.user?.email ||
                              review.email ||
                              "N/A"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="review-content">
                          {review.content?.length > 100 ? (
                            <>
                              {review.content.substring(0, 100)}...
                              <button
                                className="view-more-btn"
                                onClick={() => setSelectedReview(review)}
                                title="Xem chi tiết nội dung"
                              >
                                Xem thêm
                              </button>
                            </>
                          ) : (
                            review.content
                          )}
                        </div>
                      </td>
                      <td>{renderStars(review.rating)}</td>
                      <td>
                        <div className="review-date">
                          {formatDate(review.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="review-actions">
                          <button
                            className="action-btn btn-reply"
                            onClick={() => startReply(review._id)}
                            title="Trả lời khách hàng"
                          >
                            💬
                          </button>
                          <button
                            className="action-btn btn-view"
                            onClick={() => setSelectedReview(review)}
                            title="Xem chi tiết"
                          >
                            👁
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDeleteReview(review._id)}
                            title="Xóa đánh giá"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Reply Form Row */}
                    {replyingTo === review._id && (
                      <tr>
                        <td colSpan="6" className="reply-form-row">
                          <div className="reply-form">
                            <div className="reply-header">
                              <h4>💬 Trả lời khách hàng</h4>
                              <span className="reply-to">
                                Trả lời đánh giá của {review.name}
                              </span>
                            </div>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Nhập nội dung trả lời cho khách hàng..."
                              className="reply-textarea"
                              rows={4}
                            />
                            <div className="reply-actions">
                              <button
                                className="reply-btn btn-send"
                                onClick={() => handleReplyToReview(review._id)}
                              >
                                📤 Gửi trả lời
                              </button>
                              <button
                                className="reply-btn btn-cancel"
                                onClick={cancelReply}
                              >
                                ❌ Hủy
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {/* Show existing admin reply if any */}
                    {replies[review._id] && replies[review._id].length > 0 && (
                      <tr>
                        <td colSpan="6" className="admin-reply-row">
                          <div className="admin-reply-list">
                            <div className="admin-reply-header">
                              <span className="admin-badge">
                                👨‍💼 Phản hồi của Admin
                              </span>
                            </div>
                            {replies[review._id].map((reply) => (
                              <div key={reply._id} className="admin-reply-item">
                                <div className="admin-reply-meta">
                                  <span className="reply-date">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                  <button
                                    className="reply-delete-btn"
                                    onClick={() =>
                                      handleDeleteReply(reply._id, review._id)
                                    }
                                    title="Xóa phản hồi"
                                  >
                                    🗑
                                  </button>
                                </div>
                                <div className="admin-reply-content">
                                  {reply.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-reviews">
                    Không có đánh giá nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="page-btn"
        >
          ‹ Trước
        </button>
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`page-btn ${page === pageNum ? "active" : ""}`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="page-btn"
        >
          Sau ›
        </button>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setSelectedReview(null)}
          ></div>
          <div className="review-modal">
            <div className="modal-header">
              <h3>Chi tiết đánh giá</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedReview(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="review-detail-product">
                <img
                  src={getImageProduct(selectedReview.product?.images?.[0])}
                  alt={selectedReview.product?.name}
                />
                <div>
                  <h4>{selectedReview.product?.name}</h4>
                  <p>ID: {selectedReview.product?._id}</p>
                </div>
              </div>
              <div className="review-detail-info">
                <div className="info-row">
                  <label>Người đánh giá:</label>
                  <span>
                    {selectedReview.userId?.fullName ||
                      selectedReview.userId?.name ||
                      selectedReview.user?.fullName ||
                      selectedReview.user?.name ||
                      selectedReview.name ||
                      "Khách hàng"}
                  </span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>
                    {selectedReview.userId?.email ||
                      selectedReview.user?.email ||
                      selectedReview.email ||
                      "N/A"}
                  </span>
                </div>
                <div className="info-row">
                  <label>Đánh giá:</label>
                  {renderStars(selectedReview.rating)}
                </div>
                <div className="info-row">
                  <label>Ngày tạo:</label>
                  <span>{formatDate(selectedReview.createdAt)}</span>
                </div>
                {/* Đã xóa hiển thị trạng thái đánh giá */}
                <div className="info-row full-width">
                  <label>Nội dung:</label>
                  <div className="review-full-content">
                    {selectedReview.content}
                  </div>
                </div>

                {/* Admin Reply Section */}
                {selectedReview.adminReply && (
                  <div className="info-row full-width">
                    <label>Phản hồi của Admin:</label>
                    <div className="admin-reply-modal">
                      <div className="admin-reply-header">
                        <span className="admin-badge">👨‍💼 Admin</span>
                        <span className="reply-date">
                          {formatDate(selectedReview.adminReply.createdAt)}
                        </span>
                      </div>
                      <div className="admin-reply-content">
                        {selectedReview.adminReply.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                {/* Đã bỏ nút duyệt/từ chối đánh giá */}
                <button
                  className="btn btn-reply"
                  onClick={() => {
                    startReply(selectedReview._id);
                    setSelectedReview(null);
                  }}
                >
                  💬 Trả lời khách hàng
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => {
                    handleDeleteReview(selectedReview._id);
                    setSelectedReview(null);
                  }}
                >
                  Xóa đánh giá
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewList;
