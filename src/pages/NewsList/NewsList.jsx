import { useState, useEffect } from "react";

import { getNews } from "../../services/Api";
import { Link } from "react-router-dom";
import "./NewsList.css";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [tag, setTag] = useState("");
  const [pagination, setPagination] = useState({ totalPages: 1 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await getNews({ page, search, tag });
        setNews(res.data.data);
        setPagination(res.data.pagination);
        setError("");
      } catch (err) {
        console.error("Lỗi API /news:", err);
        if (err.response) {
          console.error("Response:", err.response);
        }
        setError("Lỗi tải tin tức: " + (err.message || ""));
      }
      setLoading(false);
    };
    fetchNews();
  }, [page, search, tag]);

  return (
    <div className="news-list-container">
      <h2>Tin tức công nghệ</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm tin tức..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        {searchInput && (
          <button
            className="clear-search"
            onClick={() => setSearchInput("")}
            title="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
      </div>
      {/* Bộ lọc tag nếu có */}
      {/* <select value={tag} onChange={e => setTag(e.target.value)}>
        <option value="">Tất cả tag</option>
        <option value="AI">AI</option>
        <option value="Mobile">Mobile</option>
        ...
      </select> */}
      {loading ? (
        <div className="news-loading">
          <div className="spinner"></div>
          <span>Đang tải...</span>
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div className="news-card" key={item._id}>
              <img
                src={item.image || "/images/news-default.jpg"}
                alt={item.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/news-default.jpg";
                }}
              />
              <h3 className="news-title">{item.title}</h3>
              <p className="news-meta">
                <span className="news-author">{item.author}</span>
                <span className="news-date">
                  {new Date(item.publishedDate).toLocaleDateString()}
                </span>
              </p>
              <p className="news-summary">{item.content?.slice(0, 100)}...</p>
              <Link to={`/news/${item._id}`} className="news-detail-btn">
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
      {/* Phân trang */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          {page}/{pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewsList;
