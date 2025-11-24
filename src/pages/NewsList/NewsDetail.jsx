import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getNewsById } from "../../services/Api";
import "./NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getNewsById(id);
        setNews(res.data.data);
        setError("");
      } catch (err) {
        setError("Không tìm thấy bài viết");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!news) return null;

  return (
    <div className="news-detail-container">
      <h2>{news.title}</h2>
      <img src={news.image} alt={news.title} />
      <p>
        {news.author} - {new Date(news.publishedDate).toLocaleDateString()}
      </p>
      <div>{news.content}</div>
      <p>
        Nguồn:{" "}
        <a href={news.source} target="_blank" rel="noopener noreferrer">
          {news.source}
        </a>
      </p>
      {news.tags && news.tags.length > 0 && (
        <div>
          <strong>Tags:</strong> {news.tags.join(", ")}
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
