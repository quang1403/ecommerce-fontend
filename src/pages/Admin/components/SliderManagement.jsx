import React, { useState, useEffect } from "react";
import "../styles/SliderManagement.css";
import {
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../../../services/SliderService";

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await getAllSliders();
      console.log("Fetched sliders:", response.data);
      setSliders(response.data || []);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      alert(
        "Lỗi khi tải danh sách slider: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      alert("⚠️ Vui lòng chọn file ảnh (JPEG, PNG, WebP)");
      return;
    }

    // Kiểm tra dung lượng (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB");
      return;
    }

    setSelectedFile(file);
    setUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setUploading(false);
    };
    reader.onerror = () => {
      alert("⚠️ Lỗi khi đọc file!");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image.trim()) {
      alert("Vui lòng nhập URL ảnh!");
      return;
    }

    try {
      setSubmitting(true);
      if (editingSlider) {
        await updateSlider(editingSlider._id, formData);
        alert("Cập nhật slider thành công!");
      } else {
        await createSlider(formData);
        alert("Tạo slider thành công!");
      }

      // Reset form
      setFormData({ title: "", image: "", link: "" });
      setEditingSlider(null);
      setShowForm(false);

      // Reload data
      fetchSliders();
    } catch (error) {
      console.error("Error saving slider:", error);
      alert(
        "Lỗi khi lưu slider: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title || "",
      image: slider.image,
      link: slider.link || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa slider này?")) return;

    try {
      await deleteSlider(id);
      alert("Xóa slider thành công!");
      fetchSliders();
    } catch (error) {
      console.error("Error deleting slider:", error);
      alert(
        "Lỗi khi xóa slider: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", image: "", link: "" });
    setEditingSlider(null);
    setShowForm(false);
    setUploadMode("url");
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="slider-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-management">
      <div className="management-header">
        <h1>
          <i className="fas fa-images"></i> Quản Lý Slider
        </h1>
        <button
          className={`btn btn-add-slider ${
            showForm ? "btn-secondary" : "btn-primary"
          }`}
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
        >
          <i className={`fas fa-${showForm ? "times" : "plus"}`}></i>
          {showForm ? "Hủy" : "Thêm Slider Mới"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="slider-form">
            <h2>
              <i
                className={`fas fa-${editingSlider ? "edit" : "plus-circle"}`}
              ></i>
              {editingSlider ? "Chỉnh Sửa Slider" : "Tạo Slider Mới"}
            </h2>

            <div className="form-group">
              <label>
                <i className="fas fa-heading"></i> Tiêu đề:
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Nhập tiêu đề slider (tùy chọn)"
              />
              <small className="form-text">
                Tiêu đề sẽ hiển thị trên slider nếu có
              </small>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-image"></i> URL Ảnh: *
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/slider-image.jpg"
                required
              />
              <small className="form-text">
                <strong>📐 Kích thước chuẩn:</strong> 1920x800px (tỷ lệ 21:9)
                hoặc 1920x600px (tỷ lệ 16:5)
                <br />
                <strong>📁 Format:</strong> WebP (tối ưu), JPEG (chất lượng
                90-95%), PNG (nếu có transparency)
                <br />
                <strong>💾 Dung lượng:</strong> Tối đa 500KB để tải nhanh
                <br />
                <strong>✨ Công cụ tối ưu:</strong>{" "}
                <a
                  href="https://tinypng.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TinyPNG
                </a>
                ,{" "}
                <a
                  href="https://squoosh.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Squoosh
                </a>
                ,{" "}
                <a
                  href="https://www.iloveimg.com/compress-image"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  iLoveIMG
                </a>
              </small>
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Preview" />
                  <div className="image-info">
                    <small>✓ Preview - Kiểm tra chất lượng trước khi lưu</small>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-link"></i> Link:
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://example.com/product (tùy chọn)"
              />
              <small className="form-text">
                Link đích khi người dùng click vào slider
              </small>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-success"
                disabled={submitting}
              >
                <i
                  className={`fas fa-${
                    submitting ? "spinner fa-spin" : "save"
                  }`}
                ></i>
                {submitting
                  ? "Đang lưu..."
                  : editingSlider
                  ? "Cập Nhật"
                  : "Tạo Mới"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                <i className="fas fa-times"></i>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="list-container">
        <div className="list-header">
          <h2>
            <i className="fas fa-list"></i> Danh Sách Slider
            <span className="badge">{sliders.length}</span>
          </h2>
        </div>

        {sliders.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>Chưa có slider nào</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus"></i>
              Tạo Slider Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="slider-grid">
            {sliders.map((slider) => (
              <div key={slider._id} className="slider-card">
                <div className="slider-card-image">
                  <img src={slider.image} alt={slider.title || "Slider"} />
                  <div className="slider-card-overlay">
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEdit(slider)}
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(slider._id)}
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>

                <div className="slider-card-body">
                  <h3 className="slider-card-title">
                    {slider.title || (
                      <em className="text-muted">Không có tiêu đề</em>
                    )}
                  </h3>

                  {slider.link && (
                    <div className="slider-card-link">
                      <i className="fas fa-link"></i>
                      <a
                        href={slider.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={slider.link}
                      >
                        {slider.link.length > 40
                          ? slider.link.substring(0, 40) + "..."
                          : slider.link}
                      </a>
                    </div>
                  )}

                  <div className="slider-card-meta">
                    <small>
                      <i className="fas fa-calendar"></i>
                      {new Date(slider.createdAt).toLocaleDateString("vi-VN")}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderManagement;
