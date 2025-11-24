import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../../../services/Api";

const BlogSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNews({ featured: true, limit: 3 }); // lấy 3 tin nổi bật
        setNews(res.data.data);
      } catch (err) {
        setNews([]);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="blog-section">
      <div className="blog-grid">
        {news.map((post) => (
          <article key={post._id} className="blog-card">
            <div className="blog-card-image">
              <img
                src={post.image || "/images/news-default.jpg"}
                alt={post.title}
                onError={(e) => {
                  e.target.src = "/images/news-default.jpg";
                }}
              />
              {post.tags && post.tags.length > 0 && (
                <div className="blog-category-badge">{post.tags[0]}</div>
              )}
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span className="blog-date">
                  {formatDate(post.publishedDate)}
                </span>
              </div>
              <h3 className="blog-title">
                <Link to={`/news/${post._id}`}>{post.title}</Link>
              </h3>
              <p className="blog-excerpt">{post.content?.slice(0, 100)}...</p>
              <div className="blog-footer">
                <span className="blog-author">Bởi {post.author}</span>
                <Link to={`/news/${post._id}`} className="blog-read-more">
                  Đọc thêm <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
