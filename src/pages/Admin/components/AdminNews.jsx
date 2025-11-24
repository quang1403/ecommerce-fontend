import React, { useState, useEffect } from "react";
import { getNews, getNewsById } from "../../../services/Api";
import axios from "axios";
import { BASE_API } from "../../../shared/constants/app";
import "../styles/AdminNews.css";

const initialForm = {
  title: "",
  content: "",
  author: "",
  image: "",
  tags: "",
  featured: false,
};

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await getNews({});
      setNewsList(res.data.data);
      setError("");
    } catch (err) {
      setError("Lỗi tải danh sách tin tức");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const data = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featured: !!form.featured,
    };
    try {
      if (editingId) {
        await axios.put(`${BASE_API}/news/${editingId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BASE_API}/news`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchNews();
    } catch (err) {
      alert("Lỗi khi lưu bài viết!");
    }
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content,
      author: item.author,
      image: item.image,
      tags: item.tags ? item.tags.join(", ") : "",
      featured: !!item.featured,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${BASE_API}/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
    } catch (err) {
      console.error("Lỗi xóa bài viết:", err);
      if (err.response) {
        alert(
          "Lỗi khi xóa bài viết: " + (err.response.data?.message || err.message)
        );
      } else {
        alert("Lỗi khi xóa bài viết: " + err.message);
      }
    }
    setConfirmDelete(null);
  };

  return (
    <div className="admin-news-container">
      <h2>Quản lý tin tức</h2>
      <button
        className="edit-btn"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setShowForm(true);
          setForm(initialForm);
          setEditingId(null);
        }}
      >
        Thêm mới bài viết
      </button>
      {showForm && (
        <form className="admin-news-form" onSubmit={handleSubmit}>
          <label>Tiêu đề</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <label>Nội dung</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            required
          />
          <label>Tác giả</label>
          <input name="author" value={form.author} onChange={handleChange} />
          <label>Ảnh (URL)</label>
          <input name="image" value={form.image} onChange={handleChange} />
          <label>Tags (phân cách bằng dấu phẩy)</label>
          <input name="tags" value={form.tags} onChange={handleChange} />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Hiển thị nổi bật trên trang Home
          </label>
          <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
          <button
            type="button"
            className="delete-btn"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setForm(initialForm);
            }}
          >
            Hủy
          </button>
        </form>
      )}
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <table className="admin-news-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Ngày đăng</th>
              <th>Nổi bật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {newsList.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{new Date(item.publishedDate).toLocaleDateString()}</td>
                <td style={{ textAlign: "center" }}>
                  {item.featured ? (
                    <span style={{ color: "#1976d2", fontWeight: 600 }}>
                      Nổi bật
                    </span>
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => setConfirmDelete(item._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {confirmDelete && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Xác nhận xóa bài viết</h3>
            <p>
              Bạn có chắc muốn xóa bài viết này? Thao tác này không thể hoàn
              tác.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                className="delete-btn"
                onClick={() => handleDelete(confirmDelete)}
              >
                Xác nhận xóa
              </button>
              <button
                className="edit-btn"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
