import React, { useState, useEffect } from "react";
import {
  getProducts,
  getInventoryDetailed,
  updateProductStock,
  getLowStockProducts,
  getOutOfStockProducts,
} from "../../../services/Api";
import { getImageProduct } from "../../../shared/utils";
import "../styles/InventoryManagement.css";

const InventoryManagement = ({ showToast }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventoryDetail, setInventoryDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, low-stock, out-of-stock
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);

  // State cho form cập nhật stock
  const [stockUpdateForm, setStockUpdateForm] = useState({
    variantType: "total", // total, color (CHỈ theo màu, KHÔNG theo ramStorage)
    color: "",
    action: "set", // set, add, subtract
    stock: 0,
  });

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      const productsData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
      showToast("Lỗi khi tải danh sách sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  };

  // Lấy sản phẩm sắp hết hàng
  const fetchLowStockProducts = async () => {
    try {
      const res = await getLowStockProducts(10);
      if (res.data?.success) {
        setLowStockProducts(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching low stock products:", err);
    }
  };

  // Lấy sản phẩm hết hàng
  const fetchOutOfStockProducts = async () => {
    try {
      const res = await getOutOfStockProducts();
      if (res.data?.success) {
        setOutOfStockProducts(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching out of stock products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLowStockProducts();
    fetchOutOfStockProducts();
  }, []);

  // Lấy chi tiết inventory khi chọn sản phẩm
  const handleSelectProduct = async (product) => {
    try {
      setLoading(true);
      setSelectedProduct(product);

      // Thử gọi API inventory detail trước
      try {
        const res = await getInventoryDetailed(product._id);
        if (res.data?.success) {
          setInventoryDetail(res.data.data);
        }
      } catch (apiErr) {
        // Nếu API không có, sử dụng dữ liệu từ product hiện có
        console.log("API detailed không có, sử dụng dữ liệu từ product");

        // Tạo inventory detail từ dữ liệu product
        const inventoryData = {
          productId: product._id,
          productName: product.name,
          category: product.category?.name || product.category || "N/A",
          brand: product.brand?.name || product.brand || "N/A",
          basePrice: product.price,
          stockSummary: {
            totalStock: product.stock || 0,
            colorVariantsStock:
              product.colorVariants?.reduce(
                (sum, v) => sum + (v.stock || 0),
                0,
              ) || 0,
            status:
              product.stock > 10
                ? "Còn hàng"
                : product.stock > 0
                  ? "Sắp hết"
                  : "Hết hàng",
            note: "Stock CHỈ quản lý theo màu sắc",
          },
          colorVariants: product.colorVariants || [],
          ramStorageVariants: product.variants || [],
        };

        setInventoryDetail(inventoryData);
      }

      // Reset form
      setStockUpdateForm({
        variantType: "total",
        color: "",
        action: "set",
        stock: 0,
      });
    } catch (err) {
      console.error("Error fetching inventory detail:", err);
      showToast("Lỗi khi tải chi tiết tồn kho", "error");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật stock
  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    try {
      const updateData = {
        action: stockUpdateForm.action,
        stock: Number(stockUpdateForm.stock),
      };

      // Thêm thông tin variant type
      if (stockUpdateForm.variantType !== "total") {
        updateData.variantType = stockUpdateForm.variantType;
      }

      if (stockUpdateForm.variantType === "color") {
        if (!stockUpdateForm.color) {
          showToast("Vui lòng chọn màu sắc", "error");
          return;
        }
        updateData.color = stockUpdateForm.color;
      }

      const res = await updateProductStock(selectedProduct._id, updateData);

      if (res.data?.success) {
        showToast(res.data.message || "Cập nhật tồn kho thành công", "success");
        // Refresh inventory detail
        await handleSelectProduct(selectedProduct);
        // Refresh lists
        fetchProducts();
        fetchLowStockProducts();
        fetchOutOfStockProducts();
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      showToast(
        err.response?.data?.message || "Lỗi khi cập nhật tồn kho",
        "error",
      );
    }
  };

  // Lấy status badge
  const getStatusBadge = (stock) => {
    if (stock === 0) {
      return <span className="status-badge out-of-stock">🔴 Hết hàng</span>;
    } else if (stock <= 10) {
      return <span className="status-badge low-stock">🟡 Sắp hết</span>;
    } else {
      return <span className="status-badge in-stock">🟢 Còn hàng</span>;
    }
  };

  // Render danh sách sản phẩm theo tab
  const renderProductList = () => {
    let displayProducts = [];

    switch (activeTab) {
      case "low-stock":
        displayProducts = lowStockProducts;
        break;
      case "out-of-stock":
        displayProducts = outOfStockProducts;
        break;
      default:
        displayProducts = products;
    }

    if (loading && displayProducts.length === 0) {
      return <div className="loading-spinner">Đang tải...</div>;
    }

    if (displayProducts.length === 0) {
      return (
        <div className="empty-state">
          <p>Không có sản phẩm nào</p>
        </div>
      );
    }

    return (
      <div className="products-grid">
        {displayProducts.map((product) => (
          <div
            key={product._id}
            className={`product-card ${
              selectedProduct?._id === product._id ? "selected" : ""
            }`}
            onClick={() => handleSelectProduct(product)}
          >
            <img
              src={getImageProduct(product.images?.[0])}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-price">
                {product.price?.toLocaleString("vi-VN")}đ
              </p>
              <div className="stock-info">
                <span className="stock-number">Stock: {product.stock}</span>
                {getStatusBadge(product.stock)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render chi tiết inventory
  const renderInventoryDetail = () => {
    if (!inventoryDetail) {
      return (
        <div className="inventory-detail-empty">
          <p>Chọn một sản phẩm để xem chi tiết tồn kho</p>
        </div>
      );
    }

    const { stockSummary, colorVariants, ramStorageVariants } = inventoryDetail;

    return (
      <div className="inventory-detail">
        <div className="detail-header">
          <h3>{inventoryDetail.productName}</h3>
          <span className="category-badge">
            {inventoryDetail.category} - {inventoryDetail.brand}
          </span>
        </div>

        {/* Stock Summary */}
        <div className="stock-summary">
          <h4>📦 Tổng quan Tồn kho</h4>
          <div className="summary-cards">
            <div className="summary-card primary">
              <label>
                Tổng Stock
                <span
                  className="info-tooltip"
                  title="Stock tổng được tính TỰ ĐỘNG từ variants"
                >
                  ℹ️
                </span>
              </label>
              <div className="summary-value">
                <span className="stock-number">{stockSummary.totalStock}</span>
                {getStatusBadge(stockSummary.totalStock)}
              </div>
              <small className="summary-note">
                {colorVariants && colorVariants.length > 0
                  ? "✅ Tự động = Tổng stock các màu"
                  : "Cập nhật thủ công (nếu không có màu)"}
              </small>
            </div>
            <div className="summary-card">
              <label>
                Stock theo Màu
                <span
                  className="info-tooltip"
                  title="Stock QUẢN LÝ theo màu sắc"
                >
                  ✅
                </span>
              </label>
              <span className="stock-number">
                {stockSummary.colorVariantsStock || 0}
              </span>
              <small className="summary-note">
                {colorVariants && colorVariants.length > 0
                  ? `${colorVariants.length} màu - QUẢN LÝ STOCK`
                  : "Chưa có"}
              </small>
            </div>
          </div>
        </div>

        {/* Color Variants */}
        {colorVariants && colorVariants.length > 0 && (
          <div className="variants-section">
            <h4>🎨 Stock theo Màu sắc</h4>
            <table className="variants-table">
              <thead>
                <tr>
                  <th>Màu sắc</th>
                  <th>Mã màu</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {colorVariants.map((variant, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="color-cell">
                        <span
                          className="color-preview"
                          style={{ backgroundColor: variant.colorCode }}
                        ></span>
                        {variant.color}
                      </div>
                    </td>
                    <td>{variant.colorCode}</td>
                    <td>{variant.sku || "-"}</td>
                    <td className="stock-cell">{variant.stock}</td>
                    <td>{getStatusBadge(variant.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RAM/Storage Variants - CHỈ HIỂN THỊ GIÁ */}
        {ramStorageVariants && ramStorageVariants.length > 0 && (
          <div className="variants-section">
            <h4>
              💾 Cấu hình (RAM/Storage)
              <span
                className="info-tooltip"
                title="CHỈ hiển thị giá, KHÔNG quản lý stock"
              >
                ℹ️
              </span>
            </h4>
            
            <table className="variants-table">
              <thead>
                <tr>
                  <th>RAM</th>
                  <th>Storage</th>
                  <th>Giá</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {ramStorageVariants.map((variant, idx) => (
                  <tr key={idx}>
                    <td>{variant.ram}GB</td>
                    <td>{variant.storage}GB</td>
                    <td>{variant.price?.toLocaleString("vi-VN")}đ</td>
                    <td className="note-cell">CHỈ hiển thị giá</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Stock Form */}
        <div className="update-stock-form">
          <h4>🔄 Cập nhật Tồn kho</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Loại cập nhật</label>
              <select
                value={stockUpdateForm.variantType}
                onChange={(e) =>
                  setStockUpdateForm({
                    ...stockUpdateForm,
                    variantType: e.target.value,
                    color: "",
                  })
                }
              >
                <option value="total">Stock tổng</option>
                {colorVariants?.length > 0 && (
                  <option value="color">Theo màu (QUẢN LÝ STOCK)</option>
                )}
              </select>
            </div>

            {/* Color Selection */}
            {stockUpdateForm.variantType === "color" && colorVariants && (
              <div className="form-group">
                <label>Màu sắc</label>
                <select
                  value={stockUpdateForm.color}
                  onChange={(e) =>
                    setStockUpdateForm({
                      ...stockUpdateForm,
                      color: e.target.value,
                    })
                  }
                >
                  <option value="">-- Chọn màu --</option>
                  {colorVariants.map((variant, idx) => (
                    <option key={idx} value={variant.color}>
                      {variant.color} (Stock: {variant.stock})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Hành động</label>
              <select
                value={stockUpdateForm.action}
                onChange={(e) =>
                  setStockUpdateForm({
                    ...stockUpdateForm,
                    action: e.target.value,
                  })
                }
              >
                <option value="set">Gán giá trị</option>
                <option value="add">Cộng thêm</option>
                <option value="subtract">Trừ đi</option>
              </select>
            </div>

            <div className="form-group">
              <label>Số lượng</label>
              <input
                type="number"
                min="0"
                value={stockUpdateForm.stock}
                onChange={(e) =>
                  setStockUpdateForm({
                    ...stockUpdateForm,
                    stock: e.target.value,
                  })
                }
                placeholder="Nhập số lượng"
              />
            </div>
          </div>

          {/* Alert về việc stock tổng tự động tính */}
          {stockUpdateForm.variantType === "color" && (
            <div className="auto-recalc-alert">
              <strong>⚡ Lưu ý:</strong> Khi cập nhật stock theo màu, hệ thống
              sẽ <strong>TỰ ĐỘNG tính lại</strong> tổng stock của sản phẩm!
            </div>
          )}

          
          <button
            className="btn-update-stock"
            onClick={handleUpdateStock}
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật Tồn kho"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="inventory-management">
      <div className="inventory-header">
        <h2>📦 Quản lý Tồn kho</h2>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Tổng sản phẩm</span>
            <span className="stat-value">{products.length}</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-label">Sắp hết hàng</span>
            <span className="stat-value">{lowStockProducts.length}</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-label">Hết hàng</span>
            <span className="stat-value">{outOfStockProducts.length}</span>
          </div>
        </div>
      </div>

      <div className="inventory-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả sản phẩm
        </button>
        <button
          className={`tab-btn ${activeTab === "low-stock" ? "active" : ""}`}
          onClick={() => setActiveTab("low-stock")}
        >
          Sắp hết hàng ({lowStockProducts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "out-of-stock" ? "active" : ""}`}
          onClick={() => setActiveTab("out-of-stock")}
        >
          Hết hàng ({outOfStockProducts.length})
        </button>
      </div>

      <div className="inventory-content">
        <div className="products-panel">{renderProductList()}</div>
        <div className="detail-panel">{renderInventoryDetail()}</div>
      </div>
    </div>
  );
};

export default InventoryManagement;
