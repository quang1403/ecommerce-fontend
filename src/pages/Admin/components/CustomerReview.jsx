import React, { useEffect, useState } from "react";
import "../styles/CustomerReview.css";
import { getAllComments } from "../../../services/Api";
const data = [10, 50, 30, 90, 40, 120, 100];

const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getAllComments()
      .then((res) => {
        let arr = [];

        if (res.data?.status === "success" && res.data?.data) {
          if (Array.isArray(res.data.data.docs)) {
            arr = res.data.data.docs;
          } else if (Array.isArray(res.data.data.comments)) {
            arr = res.data.data.comments;
          } else if (Array.isArray(res.data.data)) {
            arr = res.data.data;
          } else if (Array.isArray(res.data.data.results)) {
            arr = res.data.data.results;
          }
        } else if (Array.isArray(res.data?.data)) {
          arr = res.data.data;
        } else if (Array.isArray(res.data)) {
          arr = res.data;
        } else if (res.data?.comments && Array.isArray(res.data.comments)) {
          arr = res.data.comments;
        }

        setReviews(arr);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          "Không thể tải đánh giá khách hàng: " +
            (err.response?.data?.message || err.message)
        );
        setLoading(false);
      });
  }, []);

  // Tính toán tổng quan
  const total = reviews.length;
  const avgRating = (
    total > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / total : 0
  ).toFixed(1);
  const starStats = [1, 2, 3, 4, 5].map(
    (star) => reviews.filter((r) => (r.rating || 5) === star).length
  );
  // Lấy 3 đánh giá mới nhất
  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="CustomerReview modern">
      <div className="review-summary">
        <div className="summary-item">
          <span className="summary-label">Tổng số đánh giá</span>
          <span className="summary-value">{total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Điểm trung bình</span>
          <span className="summary-value">
            {avgRating} <span className="star">★</span>
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Phân bố số sao</span>
          <span className="summary-value">
            {starStats.map((count, idx) => (
              <span key={idx} className="star-bar">
                <span className="star">{idx + 1}★</span> <span>{count}</span>
              </span>
            ))}
          </span>
        </div>
      </div>

      <h3 className="review-section-title">Đánh giá mới nhất</h3>
      <div className="review-card-list">
        {loading ? (
          <div className="review-loading">Đang tải đánh giá...</div>
        ) : error ? (
          <div className="review-error">{error}</div>
        ) : latestReviews.length === 0 ? (
          <div className="review-empty">Chưa có đánh giá nào.</div>
        ) : (
          latestReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-card-header">
                <span className="review-name">{review.name || "Ẩn danh"}</span>
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="review-product">{review.productId?.name}</div>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= (review.rating || 5) ? "star active" : "star"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="review-content">
                {review.content.length > 60 ? (
                  <span>
                    {review.content.slice(0, 60)}...{" "}
                    <span className="see-more">Xem thêm</span>
                  </span>
                ) : (
                  review.content
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerReview;
