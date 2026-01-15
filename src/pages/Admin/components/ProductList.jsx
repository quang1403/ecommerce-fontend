import React, { useEffect, useState } from "react";
import { getImageProduct } from "../../../shared/utils";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getBrands,
  // Thêm hàm lấy danh mục
  getCategories,
} from "../../../services/Api";
import axios from "axios";
import { BASE_API } from "../../../shared/constants/app";
import "../styles/ProductList.css";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  // Bộ lọc
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minDiscount: "",
    maxDiscount: "",
    stockStatus: "", // Trạng thái kho: all, low (<=5), medium (6-20), high (>20)
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    discount: "",
    brand: "",
    stock: "",
    description: "",
    images: [""],
    featured: false,
    isLatest: false,
    category: "",
    color: [],
    variants: [],
    colorVariants: [], // Quản lý Color Variants theo API mới

    // Thông số cũ cho điện thoại (để tương thích ngược)
    ram: "",
    storage: "",
    displayType: "",
    chipset: "",
    battery: "",
    displaySize: "",
    cameraRear: "",
    cameraFront: "",
    os: "",

    // Thông số động cho từng loại sản phẩm
    specs: {},
  });
  // Phân trang
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPage = Math.ceil(products.length / pageSize);
  // Áp dụng filter cho products
  const filteredProducts = products.filter((sp) => {
    // Tìm kiếm theo tên
    if (filters.search?.trim()) {
      if (!sp.name?.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
    }
    // Lọc theo hãng
    if (filters.brand) {
      if (!sp.brand?._id || sp.brand._id !== filters.brand) return false;
    }
    // Lọc theo danh mục
    if (filters.category) {
      if (!sp.category?._id || sp.category._id !== filters.category)
        return false;
    }
    // Lọc theo giá
    if (filters.minPrice !== "" && filters.minPrice != null) {
      if (Number(sp.price) < Number(filters.minPrice)) return false;
    }
    if (filters.maxPrice !== "" && filters.maxPrice != null) {
      if (Number(sp.price) > Number(filters.maxPrice)) return false;
    }
    // Lọc theo giảm giá
    const discountValue = Number(sp.discount ?? 0);
    if (filters.minDiscount !== "" && filters.minDiscount != null) {
      if (discountValue < Number(filters.minDiscount)) return false;
    }
    if (filters.maxDiscount !== "" && filters.maxDiscount != null) {
      if (discountValue > Number(filters.maxDiscount)) return false;
    }
    // Lọc theo trạng thái kho
    if (filters.stockStatus) {
      const stock = Number(sp.stock ?? 0);
      if (filters.stockStatus === "low" && stock > 5) return false;
      if (filters.stockStatus === "medium" && (stock <= 5 || stock > 20))
        return false;
      if (filters.stockStatus === "high" && stock <= 20) return false;
    }
    return true;
  });
  const pagedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(
        Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      setProducts([]);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Lấy danh sách hãng
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    getBrands().then((res) => {
      setBrands(Array.isArray(res.data?.data) ? res.data.data : []);
    });
  }, []);

  // Lấy danh sách danh mục
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (typeof getCategories === "function") {
      getCategories().then((res) => {
        setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
      });
    }
  }, []);

  // Thêm state để theo dõi loại sản phẩm hiện tại
  const [productType, setProductType] = useState("phone"); // "phone" hoặc "headphone"

  // Xử lý mở modal thêm/sửa
  const openDrawerAdd = () => {
    setEditId(null);
    setProductType("phone"); // Mặc định là điện thoại
    setForm({
      name: "",
      price: "",
      discount: "",
      brand: "",
      stock: "",
      description: "",
      images: [],
      featured: false,
      isLatest: false,
      category: "",
      color: [],
      variants: [],
      colorVariants: [], // Reset color variants

      // Thông số cũ cho điện thoại
      ram: "",
      storage: "",
      displayType: "",
      chipset: "",
      battery: "",
      displaySize: "",
      cameraRear: "",
      cameraFront: "",
      os: "",

      // Thông số động
      specs: {},

      // YouTube URL
      youtubeUrl: "",
    });
    setDrawerOpen(true);
  };
  const openDrawerEdit = async (sp) => {
    setEditId(sp._id);

    // Xác định loại sản phẩm dựa trên category hoặc specs
    const categoryName = sp.category?.name?.toLowerCase() || "";
    let detectedProductType = "phone"; // mặc định

    if (
      categoryName.includes("tai nghe") ||
      categoryName.includes("headphone") ||
      categoryName.includes("earphone") ||
      categoryName.includes("earbud") ||
      (sp.specs &&
        Object.keys(sp.specs).some((key) =>
          ["connectionType", "driverSize", "impedance", "frequency"].includes(
            key
          )
        ))
    ) {
      detectedProductType = "headphone";
    }

    setProductType(detectedProductType);

    // Load color variants từ API
    let loadedColorVariants = [];
    try {
      const res = await axios.get(
        `${BASE_API}/products/${sp._id}/color-variants`
      );
      if (res.data.success && res.data.data.variants) {
        loadedColorVariants = res.data.data.variants;
      }
    } catch (err) {
      console.error("Error loading color variants:", err);
    }

    setForm({
      name: sp.name || "",
      price: sp.price || "",
      discount: sp.discount || "",
      brand: sp.brand?._id || "",
      stock: sp.stock || "",
      description: sp.description || "",
      images: Array.isArray(sp.images) ? sp.images : [],
      featured: sp.featured ?? false,
      isLatest: sp.isLatest ?? false,
      category: sp.category?._id || "",
      color: Array.isArray(sp.color) ? sp.color : [],
      variants: Array.isArray(sp.variants) ? sp.variants : [],
      colorVariants: loadedColorVariants, // Load từ API

      // Thông số cũ cho điện thoại (để tương thích ngược)
      ram: sp.ram ?? "",
      storage: sp.storage ?? "",
      displayType: sp.displayType ?? "",
      chipset: sp.chipset || "",
      battery: sp.battery || "",
      displaySize: sp.displaySize || "",
      cameraRear: sp.cameraRear || "",
      cameraFront: sp.cameraFront || "",
      os: sp.os || "",

      // Thông số động từ specs
      specs: sp.specs || {},

      // YouTube URL
      youtubeUrl: sp.youtubeUrl || "",
    });
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  // Helper functions cho Color Variants
  const handleAddColorVariant = () => {
    setForm({
      ...form,
      colorVariants: [
        ...form.colorVariants,
        {
          color: "",
          colorCode: "#000000",
          images: [],
          stock: 0,
          sku: "",
        },
      ],
    });
  };

  const handleRemoveColorVariant = async (index) => {
    const variantToRemove = form.colorVariants[index];

    // Nếu variant đã có _id (đã lưu trong DB), cần gọi API DELETE
    if (variantToRemove._id && editId) {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa màu "${variantToRemove.color}"?`
      );
      if (!confirmed) return;

      try {
        await axios.delete(
          `${BASE_API}/products/${editId}/color-variants/${variantToRemove._id}`
        );
        alert("Đã xóa màu thành công!");
      } catch (err) {
        alert(
          "Lỗi khi xóa màu: " + (err?.response?.data?.message || err.message)
        );
        return; // Không xóa khỏi state nếu API call thất bại
      }
    }

    // Xóa khỏi state
    const updated = [...form.colorVariants];
    updated.splice(index, 1);
    setForm({ ...form, colorVariants: updated });
  };

  const handleColorVariantChange = (index, field, value) => {
    const updated = [...form.colorVariants];
    updated[index][field] = value;
    setForm({ ...form, colorVariants: updated });
  };

  const handleColorVariantImageUpload = async (index, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const res = await uploadImages(files);
      const uploaded = Array.isArray(res.data?.data) ? res.data.data : [];
      const updated = [...form.colorVariants];
      updated[index].images = [...(updated[index].images || []), ...uploaded];
      setForm({ ...form, colorVariants: updated });
    } catch (err) {
      alert("Upload ảnh thất bại!");
    }
  };

  const handleRemoveColorVariantImage = (variantIndex, imageIndex) => {
    const updated = [...form.colorVariants];
    updated[variantIndex].images.splice(imageIndex, 1);
    setForm({ ...form, colorVariants: updated });
  };

  // Xử lý submit thêm/sửa
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuẩn hóa dữ liệu trước khi gửi
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discount: form.discount !== "" ? Number(form.discount) : undefined,
      stock: Number(form.stock),
      brand: form.brand,
      category: form.category,
      images: form.images,
      featured: Boolean(form.featured),
      isLatest: Boolean(form.isLatest),
      color: Array.isArray(form.color) ? form.color : [],
      variants: Array.isArray(form.variants) ? form.variants : [],
    };

    // Thêm YouTube URL nếu có
    if (form.youtubeUrl?.trim()) {
      payload.youtubeUrl = form.youtubeUrl.trim();
    }

    // Thêm thông số theo loại sản phẩm
    if (productType === "phone") {
      // Thông số điện thoại (giữ nguyên cho tương thích)
      payload.ram = form.ram !== "" ? Number(form.ram) : undefined;
      payload.storage = form.storage !== "" ? Number(form.storage) : undefined;
      payload.chipset = form.chipset || undefined;
      payload.battery = form.battery !== "" ? Number(form.battery) : undefined;
      payload.displaySize =
        form.displaySize !== "" ? Number(form.displaySize) : undefined;
      payload.displayType = form.displayType || undefined;
      payload.cameraRear = form.cameraRear || undefined;
      payload.cameraFront = form.cameraFront || undefined;
      payload.os = form.os || undefined;
    } else if (productType === "headphone") {
      // Thông số tai nghe vào specs
      payload.specs = {
        connectionType: form.specs.connectionType || undefined,
        driverSize: form.specs.driverSize
          ? Number(form.specs.driverSize)
          : undefined,
        frequency: form.specs.frequency || undefined,
        impedance: form.specs.impedance
          ? Number(form.specs.impedance)
          : undefined,
        microphoneType: form.specs.microphoneType || undefined,
        batteryLife: form.specs.batteryLife
          ? Number(form.specs.batteryLife)
          : undefined,
        chargingTime: form.specs.chargingTime
          ? Number(form.specs.chargingTime)
          : undefined,
        waterResistance: form.specs.waterResistance || undefined,
      };
    }

    try {
      if (editId) {
        await updateProduct(editId, payload);

        // Save color variants qua API mới
        if (form.colorVariants && form.colorVariants.length > 0) {
          // Xóa tất cả variants cũ (nếu cần)
          // Rồi thêm mới từng variant
          for (const variant of form.colorVariants) {
            if (variant._id) {
              // Update variant hiện tại
              await axios.put(
                `${BASE_API}/products/${editId}/color-variants/${variant._id}`,
                {
                  color: variant.color,
                  colorCode: variant.colorCode,
                  images: variant.images,
                  stock: Number(variant.stock),
                  sku: variant.sku,
                }
              );
            } else {
              // Thêm variant mới
              await axios.post(
                `${BASE_API}/products/${editId}/color-variants`,
                {
                  color: variant.color,
                  colorCode: variant.colorCode,
                  images: variant.images,
                  stock: Number(variant.stock),
                  sku: variant.sku,
                }
              );
            }
          }
        }
      } else {
        const addRes = await addProduct(payload);
        const newProductId = addRes.data?.data?._id || addRes.data?._id;

        // Thêm color variants cho sản phẩm mới
        if (
          newProductId &&
          form.colorVariants &&
          form.colorVariants.length > 0
        ) {
          for (const variant of form.colorVariants) {
            await axios.post(
              `${BASE_API}/products/${newProductId}/color-variants`,
              {
                color: variant.color,
                colorCode: variant.colorCode,
                images: variant.images,
                stock: Number(variant.stock),
                sku: variant.sku,
              }
            );
          }
        }
      }
      setDrawerOpen(false);
      fetchProducts();
    } catch (err) {
      alert("Có lỗi xảy ra!\n" + (err?.response?.data?.message || ""));
    }
  };

  // Xử lý xóa
  const handleDelete = async (_id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(_id);
        fetchProducts();
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  // Xử lý upload ảnh
  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const res = await uploadImages(files);
      // Giả sử BE trả về { data: ["/uploads/xxx.jpg", ...] }
      setForm((prev) => ({
        ...prev,
        images: Array.isArray(res.data?.data) ? res.data.data : [],
      }));
    } catch (err) {
      alert("Upload ảnh thất bại!");
    }
  };

  // Tạo mảng số trang hiển thị chuyên nghiệp cho phân trang
  const getPageNumbers = () => {
    if (totalPage <= 5) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }
    let pages = [];
    if (page <= 3) {
      pages = [1, 2, 3, 4, "...", totalPage];
    } else if (page >= totalPage - 2) {
      pages = [
        1,
        "...",
        totalPage - 3,
        totalPage - 2,
        totalPage - 1,
        totalPage,
      ];
    } else {
      pages = [1, "...", page - 1, page, page + 1, "...", totalPage];
    }
    return pages;
  };

  const ramOptions = [2, 4, 6, 8, 12, 16];
  const storageOptions = [32, 64, 128, 256, 512, 1024];
  const displayTypeOptions = [
    "IPS",
    "OLED",
    "AMOLED",
    "Super AMOLED",
    "PLS LCD",
  ];
  const colorOptions = [
    "Black",
    "Silver",
    "Gold",
    "Blue",
    "Green",
    "Red",
    "White",
  ];

  return (
    <div className="ProductList">
      {!drawerOpen ? (
        /* Hiển thị danh sách sản phẩm */
        <div className="section-box">
          <div className="section-header">
            <h2>Quản lý sản phẩm</h2>
            <button className="btn-add-product" onClick={openDrawerAdd}>
              <span className="btn-icon">+</span>
              Thêm sản phẩm
            </button>
          </div>

          {/* Bộ lọc sản phẩm */}
          <div className="admin-filter-bar">
            <input
              type="text"
              placeholder="Tìm kiếm tên sản phẩm..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              style={{ minWidth: 180 }}
            />
            <select
              value={filters.brand}
              onChange={(e) =>
                setFilters((f) => ({ ...f, brand: e.target.value }))
              }
            >
              <option value="">-- Hãng --</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option value="">-- Danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Giá từ"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minPrice: e.target.value }))
              }
              style={{ width: 100 }}
            />
            <input
              type="number"
              placeholder="Giá đến"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxPrice: e.target.value }))
              }
              style={{ width: 100 }}
            />
            <input
              type="number"
              placeholder="Giảm giá từ (%)"
              value={filters.minDiscount}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minDiscount: e.target.value }))
              }
              style={{ width: 120 }}
            />
            <input
              type="number"
              placeholder="Giảm giá đến (%)"
              value={filters.maxDiscount}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxDiscount: e.target.value }))
              }
              style={{ width: 120 }}
            />
            <select
              value={filters.stockStatus}
              onChange={(e) =>
                setFilters((f) => ({ ...f, stockStatus: e.target.value }))
              }
              style={{ width: 140 }}
            >
              <option value="">-- Trạng thái kho --</option>
              <option value="low">🔴 Hết hàng (≤5)</option>
              <option value="medium">🟡 Sắp hết (6-20)</option>
              <option value="high">🟢 Còn nhiều (>20)</option>
            </select>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  brand: "",
                  category: "",
                  minPrice: "",
                  maxPrice: "",
                  minDiscount: "",
                  maxDiscount: "",
                  stockStatus: "",
                })
              }
            >
              Xóa bộ lọc
            </button>
          </div>

          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Thông tin chi tiết</th>
                  <th>Giá bán</th>
                  <th>Thương hiệu</th>
                  <th>Trạng thái kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pagedProducts.map((sp) => (
                  <tr key={sp._id}>
                    <td>
                      <div className="product-card">
                        <div className="product-image">
                          {sp.images && sp.images[0] ? (
                            <img
                              src={getImageProduct(sp.images[0])}
                              alt={sp.name}
                            />
                          ) : (
                            <div className="product-placeholder">
                              <span>📱</span>
                            </div>
                          )}
                        </div>
                        <div className="product-details">
                          <div className="product-name">{sp.name}</div>
                          <div className="product-id">
                            ID: {sp._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-specs">
                        <div className="spec-item">
                          <span className="spec-label">Mô tả:</span>
                          <span
                            className="spec-value"
                            dangerouslySetInnerHTML={{
                              __html:
                                sp.description
                                  ?.substring(0, 80)
                                  .replace(/<[^>]*>/g, "") || "Chưa có mô tả",
                            }}
                          />
                          {sp.description &&
                            sp.description.length > 80 &&
                            "..."}
                        </div>
                        {sp.ram && (
                          <div className="spec-item">
                            <span className="spec-label">RAM:</span>
                            <span className="spec-value">{sp.ram}GB</span>
                          </div>
                        )}
                        {sp.storage && (
                          <div className="spec-item">
                            <span className="spec-label">Bộ nhớ:</span>
                            <span className="spec-value">{sp.storage}GB</span>
                          </div>
                        )}
                        {/* Hiển thị bộ nhớ từ variants nếu có */}
                        {Array.isArray(sp.variants) &&
                          sp.variants.length > 0 && (
                            <div className="spec-item">
                              <span className="spec-label">
                                Cấu hình bộ nhớ:
                              </span>
                              <span className="spec-value">
                                {sp.variants.map((v, idx) => (
                                  <span key={idx} style={{ marginRight: 8 }}>
                                    {v.ram}GB/{v.storage}GB -{" "}
                                    {Number(v.price).toLocaleString()}₫
                                  </span>
                                ))}
                              </span>
                            </div>
                          )}
                      </div>
                    </td>
                    <td>
                      <div className="product-price">
                        {sp.price !== undefined
                          ? Number(sp.price).toLocaleString() + "₫"
                          : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="brand-badge">
                        {sp.brand?.name || "Không có"}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`stock-badge ${
                          sp.stock <= 5
                            ? "stock-low"
                            : sp.stock <= 20
                            ? "stock-medium"
                            : "stock-high"
                        }`}
                      >
                        <span className="stock-number">{sp.stock}</span>
                        <span className="stock-label">sản phẩm</span>
                      </div>
                    </td>
                    <td>
                      <div className="actions-container">
                        <button
                          className="action-btn btn-edit"
                          onClick={() => openDrawerEdit(sp)}
                          title="Chỉnh sửa sản phẩm"
                        >
                          Sửa
                        </button>
                        <button
                          className="action-btn btn-delete"
                          onClick={() => handleDelete(sp._id)}
                          title="Xóa sản phẩm"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              &lt;
            </button>
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={"dots" + idx} style={{ margin: "0 4px" }}>
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className={page === p ? "active" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}
            <button
              disabled={page === totalPage || totalPage === 0}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      ) : (
        /* Hiển thị form thêm/sửa toàn màn hình */
        <div className="product-form-page">
          <form onSubmit={handleSubmit}>
            <h3>{editId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>

            {/* Chọn loại sản phẩm */}
            {!editId && (
              <>
                <label>Loại sản phẩm</label>
                <select
                  value={productType}
                  onChange={(e) => {
                    setProductType(e.target.value);
                    setForm({ ...form, specs: {} }); // Reset specs khi đổi loại
                  }}
                >
                  <option value="phone">Điện thoại</option>
                  <option value="headphone">Tai nghe</option>
                </select>
              </>
            )}

            <label>Tên sản phẩm</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <label>Mô tả</label>
            <div className="html-editor">
              <div className="editor-toolbar">
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    const newText =
                      text.substring(0, start) +
                      `<strong>${selected}</strong>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="In đậm"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    const newText =
                      text.substring(0, start) +
                      `<em>${selected}</em>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="In nghiêng"
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    const newText =
                      text.substring(0, start) +
                      `<u>${selected}</u>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="Gạch chân"
                >
                  <u>U</u>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const text = textarea.value;
                    const newText =
                      text.substring(0, start) + "<br>" + text.substring(start);
                    setForm({ ...form, description: newText });
                  }}
                  title="Xuống dòng"
                >
                  BR
                </button>
                <span className="toolbar-divider">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    const newText =
                      text.substring(0, start) +
                      `<h2>${selected}</h2>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="Tiêu đề H2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    const newText =
                      text.substring(0, start) +
                      `<h3>${selected}</h3>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="Tiêu đề H3"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    const newText =
                      text.substring(0, start) +
                      `<p>${selected}</p>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="Đoạn văn"
                >
                  P
                </button>
                <span className="toolbar-divider">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    // Tách thành các dòng và tạo list items
                    const lines = selected
                      .split("\n")
                      .filter((line) => line.trim());
                    const listItems = lines
                      .map((line) => `<li>${line.trim()}</li>`)
                      .join("\n");
                    const newText =
                      text.substring(0, start) +
                      `<ul>\n${listItems}\n</ul>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="Danh sách gạch đầu dòng"
                >
                  • UL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const textarea = document.querySelector(
                      ".html-editor textarea"
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;
                    const selected = text.substring(start, end);
                    // Tách thành các dòng và tạo list items
                    const lines = selected
                      .split("\n")
                      .filter((line) => line.trim());
                    const listItems = lines
                      .map((line) => `<li>${line.trim()}</li>`)
                      .join("\n");
                    const newText =
                      text.substring(0, start) +
                      `<ol>\n${listItems}\n</ol>` +
                      text.substring(end);
                    setForm({ ...form, description: newText });
                  }}
                  title="Danh sách đánh số"
                >
                  1. OL
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Nhập mô tả sản phẩm. Sử dụng các nút bên trên để format. Với danh sách: chọn nhiều dòng rồi click UL/OL"
                rows="10"
              />
              {form.description && (
                <div className="preview-box">
                  <strong>Xem trước:</strong>
                  <div
                    className="preview-content"
                    dangerouslySetInnerHTML={{ __html: form.description }}
                  />
                </div>
              )}
            </div>

            {/* Thông số theo loại sản phẩm */}
            {productType === "phone" && (
              <div className="form-grid-2col">
                {/* Thông số điện thoại */}
                <div className="form-field">
                  <label>Chipset</label>
                  <input
                    value={form.chipset}
                    onChange={(e) =>
                      setForm({ ...form, chipset: e.target.value })
                    }
                    placeholder="Snapdragon 8 Gen 2, A17 Pro..."
                  />
                </div>

                <div className="form-field">
                  <label>Pin (mAh)</label>
                  <input
                    type="number"
                    value={form.battery}
                    onChange={(e) =>
                      setForm({ ...form, battery: e.target.value })
                    }
                    placeholder="5000"
                  />
                </div>

                <div className="form-field">
                  <label>Kích thước màn hình (inch)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.displaySize}
                    onChange={(e) =>
                      setForm({ ...form, displaySize: e.target.value })
                    }
                    placeholder="6.7"
                  />
                </div>

                <div className="form-field">
                  <label>Camera sau</label>
                  <input
                    value={form.cameraRear}
                    onChange={(e) =>
                      setForm({ ...form, cameraRear: e.target.value })
                    }
                    placeholder="50MP + 12MP + 2MP"
                  />
                </div>

                <div className="form-field">
                  <label>Camera trước</label>
                  <input
                    value={form.cameraFront}
                    onChange={(e) =>
                      setForm({ ...form, cameraFront: e.target.value })
                    }
                    placeholder="32MP"
                  />
                </div>

                <div className="form-field">
                  <label>Hệ điều hành</label>
                  <input
                    value={form.os}
                    onChange={(e) => setForm({ ...form, os: e.target.value })}
                    placeholder="Android 14, iOS 17..."
                  />
                </div>
              </div>
            )}

            {productType === "headphone" && (
              <div className="form-grid-2col">
                {/* Thông số tai nghe */}
                <div className="form-field">
                  <label>Loại kết nối</label>
                  <input
                    value={form.specs.connectionType || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: {
                          ...form.specs,
                          connectionType: e.target.value,
                        },
                      })
                    }
                    placeholder="Bluetooth 5.0, 3.5mm, USB-C..."
                  />
                </div>

                <div className="form-field">
                  <label>Kích thước Driver (mm)</label>
                  <input
                    type="number"
                    value={form.specs.driverSize || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: { ...form.specs, driverSize: e.target.value },
                      })
                    }
                    placeholder="40"
                  />
                </div>

                <div className="form-field">
                  <label>Dải tần số (Hz)</label>
                  <input
                    value={form.specs.frequency || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: { ...form.specs, frequency: e.target.value },
                      })
                    }
                    placeholder="20Hz - 20kHz"
                  />
                </div>

                <div className="form-field">
                  <label>Trở kháng (Ohm)</label>
                  <input
                    type="number"
                    value={form.specs.impedance || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: { ...form.specs, impedance: e.target.value },
                      })
                    }
                    placeholder="32"
                  />
                </div>

                <div className="form-field">
                  <label>Loại microphone</label>
                  <input
                    value={form.specs.microphoneType || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: {
                          ...form.specs,
                          microphoneType: e.target.value,
                        },
                      })
                    }
                    placeholder="Built-in, Detachable, None"
                  />
                </div>

                <div className="form-field">
                  <label>Thời lượng pin (giờ)</label>
                  <input
                    type="number"
                    value={form.specs.batteryLife || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: { ...form.specs, batteryLife: e.target.value },
                      })
                    }
                    placeholder="8"
                  />
                </div>

                <div className="form-field">
                  <label>Thời gian sạc (giờ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.specs.chargingTime || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: { ...form.specs, chargingTime: e.target.value },
                      })
                    }
                    placeholder="2.5"
                  />
                </div>

                <div className="form-field">
                  <label>Khả năng chống nước</label>
                  <input
                    value={form.specs.waterResistance || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        specs: {
                          ...form.specs,
                          waterResistance: e.target.value,
                        },
                      })
                    }
                    placeholder="IPX4, IPX7..."
                  />
                </div>
              </div>
            )}

            <div className="form-grid-2col">
              <div className="form-field">
                <label>Giá bán</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Giảm giá (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: e.target.value })
                  }
                  placeholder="Nhập phần trăm giảm giá"
                />
              </div>

              <div className="form-field">
                <label>Hãng</label>
                <select
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  required
                >
                  <option value="">-- Chọn hãng --</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Tồn kho</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Nổi bật (Featured)</label>
                <select
                  value={form.featured ?? false}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.value === "true" })
                  }
                  required
                >
                  <option value={false}>Không</option>
                  <option value={true}>Có</option>
                </select>
              </div>

              <div className="form-field">
                <label>Sản phẩm mới (isLatest)</label>
                <select
                  value={form.isLatest ?? false}
                  onChange={(e) =>
                    setForm({ ...form, isLatest: e.target.value === "true" })
                  }
                  required
                >
                  <option value={false}>Không</option>
                  <option value={true}>Có</option>
                </select>
              </div>
            </div>

            <label>Ảnh sản phẩm</label>
            <input type="file" multiple onChange={handleUploadImages} />
            {/* Hiển thị preview đường dẫn ảnh đã upload */}
            <div style={{ margin: "8px 0" }}>
              {form.images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <img
                    src={getImageProduct(img)}
                    alt={"Ảnh " + idx}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 4,
                      border: "1px solid #eee",
                    }}
                  />
                  <span style={{ fontSize: 12 }}>{img}</span>
                </div>
              ))}
            </div>

            {/* Các trường chỉ dành cho điện thoại */}
            {productType === "phone" && (
              <div className="form-grid-2col">
                <div className="form-field">
                  <label>RAM</label>
                  <select
                    value={form.ram ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, ram: Number(e.target.value) })
                    }
                    required
                  >
                    <option value="">-- Chọn RAM --</option>
                    {ramOptions.map((r) => (
                      <option key={r} value={r}>
                        {r} GB
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Bộ nhớ trong (Storage)</label>
                  <select
                    value={form.storage ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, storage: Number(e.target.value) })
                    }
                    required
                  >
                    <option value="">-- Chọn Storage --</option>
                    {storageOptions.map((s) => (
                      <option key={s} value={s}>
                        {s} GB
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Loại màn hình (Display Type)</label>
                  <select
                    value={form.displayType ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, displayType: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn loại màn hình --</option>
                    {displayTypeOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Variants chỉ cho điện thoại, tai nghe không cần */}
            {productType === "phone" && (
              <>
                <label>Cấu hình (Variants)</label>
                {form.variants.map((variant, idx) => (
                  <div key={idx} className="variant-item">
                    <input
                      type="number"
                      placeholder="RAM"
                      value={variant.ram ?? ""}
                      onChange={(e) => {
                        const v = [...form.variants];
                        v[idx].ram = Number(e.target.value);
                        setForm({ ...form, variants: v });
                      }}
                      className="variant-input variant-input-small"
                    />
                    <input
                      type="number"
                      placeholder="Storage"
                      value={variant.storage ?? ""}
                      onChange={(e) => {
                        const v = [...form.variants];
                        v[idx].storage = Number(e.target.value);
                        setForm({ ...form, variants: v });
                      }}
                      className="variant-input variant-input-medium"
                    />
                    <input
                      type="number"
                      placeholder="Giá (VND)"
                      value={variant.price ?? ""}
                      onChange={(e) => {
                        const v = [...form.variants];
                        v[idx].price = Number(e.target.value);
                        setForm({ ...form, variants: v });
                      }}
                      className="variant-input variant-input-large"
                    />
                    <button
                      type="button"
                      className="variant-btn-delete"
                      onClick={() => {
                        const v = [...form.variants];
                        v.splice(idx, 1);
                        setForm({ ...form, variants: v });
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="variant-btn-add"
                  onClick={() =>
                    setForm({
                      ...form,
                      variants: [
                        ...form.variants,
                        { ram: "", storage: "", price: "" },
                      ],
                    })
                  }
                >
                  Thêm cấu hình
                </button>
              </>
            )}

            {/* YouTube URL Section */}
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: "#fff8e1",
                borderRadius: 8,
                border: "1px solid #ffd54f",
              }}
            >
              <label
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 8,
                  display: "block",
                }}
              >
                YouTube URL
              </label>
              <p
                style={{
                  fontSize: 13,
                  color: "#666",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
                id="youtube-help-text"
              >
                Dán link YouTube (ví dụ:
                https://www.youtube.com/watch?v=abc123...). Hệ thống tự trích
                video ID và lưu.
              </p>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={(e) => {
                  setForm({ ...form, youtubeUrl: e.target.value });
                }}
                placeholder="https://www.youtube.com/watch?v=VIDEOID hoặc https://youtu.be/VIDEOID"
                aria-describedby="youtube-help-text"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 4,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
              {(() => {
                const ytRegex =
                  /(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
                const match = form.youtubeUrl?.match(ytRegex);
                const videoId = match ? match[1] : null;

                if (form.youtubeUrl && !videoId) {
                  return (
                    <div
                      style={{
                        marginTop: 8,
                        padding: 8,
                        background: "#fff3cd",
                        border: "1px solid #ffc107",
                        borderRadius: 4,
                        color: "#856404",
                        fontSize: 13,
                      }}
                    >
                      ⚠️ Không phải URL YouTube hợp lệ
                    </div>
                  );
                }

                if (videoId) {
                  return (
                    <div style={{ marginTop: 12 }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#28a745",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        ✓ Video ID extracted: {videoId}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                        }}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt="YouTube thumbnail"
                          style={{
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "2px solid #ddd",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const modal = document.getElementById(
                              "youtube-preview-modal"
                            );
                            if (modal) {
                              modal.style.display = "flex";
                              const iframe = modal.querySelector("iframe");
                              if (iframe) {
                                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                              }
                            }
                          }}
                          style={{
                            padding: "8px 16px",
                            background: "#ff0000",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          ▶ Preview Video
                        </button>
                      </div>
                    </div>
                  );
                }

                return null;
              })()}
            </div>

            {/* Color Variants Management */}
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#f8f9fa",
                borderRadius: 8,
              }}
            >
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Quản lý màu sắc (Color Variants)
              </label>
              <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                Mỗi màu có ảnh riêng, tồn kho riêng, SKU riêng
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {form.colorVariants.map((variant, vIdx) => (
                  <div
                    key={vIdx}
                    style={{
                      background: "white",
                      padding: 12,
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
                        Màu #{vIdx + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveColorVariant(vIdx)}
                        style={{
                          background: "#dc3545",
                          color: "white",
                          border: "none",
                          padding: "3px 10px",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        Xóa
                      </button>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Tên màu *
                      </label>
                      <input
                        value={variant.color}
                        onChange={(e) =>
                          handleColorVariantChange(
                            vIdx,
                            "color",
                            e.target.value
                          )
                        }
                        placeholder="Titan Đen..."
                        required
                        style={{ width: "100%", padding: 6, fontSize: 12 }}
                      />
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Mã màu Hex *
                      </label>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="color"
                          value={variant.colorCode}
                          onChange={(e) =>
                            handleColorVariantChange(
                              vIdx,
                              "colorCode",
                              e.target.value
                            )
                          }
                          style={{
                            width: 40,
                            height: 32,
                            border: "none",
                            cursor: "pointer",
                          }}
                        />
                        <input
                          type="text"
                          value={variant.colorCode}
                          onChange={(e) =>
                            handleColorVariantChange(
                              vIdx,
                              "colorCode",
                              e.target.value
                            )
                          }
                          placeholder="#000000"
                          style={{ flex: 1, padding: 6, fontSize: 12 }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          Tồn kho *
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleColorVariantChange(
                              vIdx,
                              "stock",
                              e.target.value
                            )
                          }
                          placeholder="50"
                          required
                          style={{ width: "100%", padding: 6, fontSize: 12 }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          SKU
                        </label>
                        <input
                          value={variant.sku}
                          onChange={(e) =>
                            handleColorVariantChange(
                              vIdx,
                              "sku",
                              e.target.value
                            )
                          }
                          placeholder="IP15PM-BLK"
                          style={{ width: "100%", padding: 6, fontSize: 12 }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Ảnh cho màu này
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleColorVariantImageUpload(vIdx, e)}
                        style={{ marginBottom: 6, fontSize: 11 }}
                      />
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {variant.images &&
                          variant.images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              style={{
                                position: "relative",
                                width: 60,
                                height: 60,
                                border: "1px solid #e0e0e0",
                                borderRadius: 6,
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={getImageProduct(img)}
                                alt={`Color ${vIdx + 1} - Image ${imgIdx + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveColorVariantImage(vIdx, imgIdx)
                                }
                                style={{
                                  position: "absolute",
                                  top: 2,
                                  right: 2,
                                  background: "#dc3545",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: 18,
                                  height: 18,
                                  fontSize: 11,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                  lineHeight: 1,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddColorVariant}
                style={{
                  width: "100%",
                  padding: 10,
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  marginTop: 12,
                }}
              >
                + Thêm màu mới
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editId ? "Lưu thay đổi" : "Thêm sản phẩm"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={closeDrawer}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* YouTube Preview Modal */}
      <div
        id="youtube-preview-modal"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.8)",
          zIndex: 10000,
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={(e) => {
          if (e.target.id === "youtube-preview-modal") {
            e.target.style.display = "none";
            const iframe = e.target.querySelector("iframe");
            if (iframe) {
              iframe.src = "";
            }
          }
        }}
      >
        <div
          style={{
            position: "relative",
            width: "90%",
            maxWidth: 800,
            background: "#000",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => {
              const modal = document.getElementById("youtube-preview-modal");
              if (modal) {
                modal.style.display = "none";
                const iframe = modal.querySelector("iframe");
                if (iframe) {
                  iframe.src = "";
                }
              }
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              fontSize: 20,
              cursor: "pointer",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
            }}
          >
            <iframe
              title="Product video preview"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
