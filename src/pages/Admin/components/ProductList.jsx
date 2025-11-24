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
    });
    setDrawerOpen(true);
  };
  const openDrawerEdit = (sp) => {
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
    });
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

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
      } else {
        await addProduct(payload);
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
                        <span className="spec-value">
                          {sp.description?.substring(0, 50)}...
                        </span>
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
                      {Array.isArray(sp.variants) && sp.variants.length > 0 && (
                        <div className="spec-item">
                          <span className="spec-label">Cấu hình bộ nhớ:</span>
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
      </div>{" "}
      {/* Đóng section-box */}
      {/* Drawer/Side panel thêm/sửa sản phẩm */}
      {drawerOpen && (
        <>
          <div className="drawer-bg" onClick={closeDrawer}></div>
          <div className="drawer-panel">
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
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* Thông số theo loại sản phẩm */}
              {productType === "phone" && (
                <>
                  {/* Thông số điện thoại */}
                  <label>Chipset</label>
                  <input
                    value={form.chipset}
                    onChange={(e) =>
                      setForm({ ...form, chipset: e.target.value })
                    }
                    placeholder="Snapdragon 8 Gen 2, A17 Pro..."
                  />

                  <label>Pin (mAh)</label>
                  <input
                    type="number"
                    value={form.battery}
                    onChange={(e) =>
                      setForm({ ...form, battery: e.target.value })
                    }
                    placeholder="5000"
                  />
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

                  <label>Camera sau</label>
                  <input
                    value={form.cameraRear}
                    onChange={(e) =>
                      setForm({ ...form, cameraRear: e.target.value })
                    }
                    placeholder="50MP + 12MP + 2MP"
                  />
                  <label>Camera trước</label>
                  <input
                    value={form.cameraFront}
                    onChange={(e) =>
                      setForm({ ...form, cameraFront: e.target.value })
                    }
                    placeholder="32MP"
                  />
                  <label>Hệ điều hành</label>
                  <input
                    value={form.os}
                    onChange={(e) => setForm({ ...form, os: e.target.value })}
                    placeholder="Android 14, iOS 17..."
                  />
                </>
              )}

              {productType === "headphone" && (
                <>
                  {/* Thông số tai nghe */}
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
                </>
              )}

              <label>Giá bán</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <label>Giảm giá (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder="Nhập phần trăm giảm giá"
              />
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
              <label>Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <label>Tồn kho</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
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

              {/* Các trường chỉ dành cho điện thoại */}
              {productType === "phone" && (
                <>
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
                </>
              )}

              <label>Màu sắc (Color)</label>
              <select
                multiple
                value={form.color ?? []}
                onChange={(e) =>
                  setForm({
                    ...form,
                    color: Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value
                    ),
                  })
                }
              >
                {colorOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Variants chỉ cho điện thoại, tai nghe không cần */}
              {productType === "phone" && (
                <>
                  <label>Cấu hình (Variants)</label>
                  {form.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      style={{ display: "flex", gap: 8, marginBottom: 8 }}
                    >
                      <input
                        type="number"
                        placeholder="RAM"
                        value={variant.ram ?? ""}
                        onChange={(e) => {
                          const v = [...form.variants];
                          v[idx].ram = Number(e.target.value);
                          setForm({ ...form, variants: v });
                        }}
                        style={{ width: 60 }}
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
                        style={{ width: 80 }}
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
                        style={{ width: 120 }}
                      />
                      <button
                        type="button"
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

              <div className="drawer-actions">
                <button type="submit" className="btn-add">
                  {editId ? "Lưu" : "Thêm"}
                </button>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={closeDrawer}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
