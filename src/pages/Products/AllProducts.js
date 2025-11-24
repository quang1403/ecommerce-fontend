import React, { useState, useEffect } from "react";
import { searchProducts, getCategories, getBrands } from "../../services/Api";
import { getImageProduct } from "../../shared/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, getCartByToken } from "../../services/Api";
import { setCart } from "../../redux-setup/reducers/cart";
import "../Products/AllProducts.css";

const AllProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // useSearchParams must be called before using it in useState
  const initialParams = Object.fromEntries([...searchParams]);
  const [filters, setFilters] = useState({
    category: initialParams.category || "",
    brand: initialParams.brandId || "",
    minPrice: initialParams.minPrice || "",
    maxPrice: initialParams.maxPrice || "",
    search: initialParams.search || "",
    sortBy: initialParams.sortBy || "name",
    sortOrder: initialParams.sortOrder || "asc",
    featured: initialParams.featured === "true",
    isLatest: initialParams.isLatest === "true",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 15,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper function để lấy category ID
  const getCategoryId = (categoryName) => {
    if (!categories.length) return "";
    const category = categories.find((cat) => cat.name === categoryName);
    return category?._id || "";
  };

  // Fetch categories + brands khi load lần đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          getCategories().catch(() => ({ data: [] })),
          getBrands().catch(() => ({ data: [] })),
        ]);
        setCategories(categoriesRes.data?.data || []);
        setBrands(brandsRes.data?.data || []);

        // Sau khi load categories, nếu không có category trong URL thì fetch điện thoại
        if (!searchParams.get("category")) {
          setTimeout(() => {
            fetchProducts();
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const params = {};
    // Chỉ truyền category nếu khác rỗng
    if (filters.category && filters.category !== "")
      params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.search) params.keyword = filters.search;
    // sort: price_asc, price_desc, name_asc, name_desc
    if (filters.sortBy && filters.sortOrder) {
      if (filters.sortBy === "price" || filters.sortBy === "name") {
        params.sort = `${filters.sortBy}_${filters.sortOrder}`;
      }
    }
    params.page = pagination.currentPage;
    params.limit = pagination.limit;

    // Tạo query string cho URL
    const queryString = Object.entries(params)
      .filter(([_, v]) => v !== "" && v !== false)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    navigate(`/products${queryString ? `?${queryString}` : ""}`);
    fetchProducts(params);
  }, [filters, pagination.currentPage]);

  // Khi URL params thay đổi, đồng bộ filters.brand với brandId trên URL
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    // Đồng bộ category khi URL thay đổi (ví dụ: chuyển từ header)
    if (params.category && params.category !== filters.category) {
      setFilters((prev) => ({ ...prev, category: params.category }));
    }
    if (params.brandId && params.brandId !== filters.brand) {
      setFilters((prev) => ({ ...prev, brand: params.brandId }));
    }
  }, [searchParams]);

  const fetchProducts = async (params) => {
    try {
      setLoading(true);
      // Nếu không có category trong filters và không có trong URL, mặc định hiển thị điện thoại
      let categoryToUse = filters.category;
      if (!categoryToUse && !searchParams.get("category")) {
        categoryToUse = getCategoryId("Điện thoại");
      }
      if (categoryToUse) params.category = categoryToUse;

      const response = await searchProducts(params);

      if (response?.data?.success && response.data.data) {
        setProducts(response.data.data);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalPages: response.data.pagination.totalPages || 1,
            totalProducts:
              response.data.pagination.totalProducts ||
              response.data.data.length,
          }));
        } else {
          setPagination((prev) => ({
            ...prev,
            totalPages: 1,
            totalProducts: response.data.data.length,
          }));
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    // Nếu thay đổi danh mục, cập nhật URL params và filters
    if (key === "category") {
      setFilters((prev) => ({ ...prev, category: value }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    // Xóa URL params và quay về trang mặc định (điện thoại)
    navigate("/products");

    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      search: "",
      sortBy: "name",
      sortOrder: "asc",
      featured: false,
      isLatest: false,
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleViewDetail = (productId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/product/${productId}`);
  };

  const handleBuyNow = async (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="allproducts-container">
      {/* Header */}
      <div className="allproducts-header">
        <h1>Tất cả sản phẩm</h1>
        <p>Khám phá bộ sưu tập điện thoại đa dạng của chúng tôi</p>
      </div>

      <div className="allproducts-content">
        {/* Sidebar Filter */}

        {/* Main Content */}
        <main className="allproducts-main">
          <div className="allproducts-toolbar">
            <div className="allproducts-results-info">
              <span>
                Hiển thị {products.length} trong số {pagination.totalProducts}{" "}
                sản phẩm
              </span>
            </div>
            <div className="allproducts-sort">
              <label>Sắp xếp theo:</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
                }}
                className="allproducts-sort-select"
              >
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="createdAt-desc">Mới nhất</option>
                <option value="createdAt-asc">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="allproducts-loading">
              <div className="allproducts-spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="allproducts-grid">
                {products.map((product) => (
                  <div key={product._id} className="allproducts-card">
                    <div className="allproducts-card-image">
                      <img
                        src={getImageProduct(product.images?.[0])}
                        alt={product.name}
                        onClick={() => handleViewDetail(product._id)}
                      />
                      {product.discount > 0 && (
                        <span className="allproducts-discount-badge">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="allproducts-card-content">
                      <h3
                        className="allproducts-card-title"
                        onClick={() => handleViewDetail(product._id)}
                      >
                        {product.name}
                      </h3>
                      <div className="allproducts-card-price">
                        {product.discount > 0 ? (
                          <>
                            <span
                              className="allproducts-price-sale"
                              style={{ color: "#dc2626", fontWeight: "bold" }}
                            >
                              {formatPrice(
                                product.price * (1 - product.discount / 100)
                              )}
                            </span>
                            <span
                              className="allproducts-price-original"
                              style={{
                                textDecoration: "line-through",
                                color: "#64748b",
                                marginLeft: 8,
                              }}
                            >
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span
                            className="allproducts-price-sale"
                            style={{ color: "#dc2626", fontWeight: "bold" }}
                          >
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <div className="allproducts-card-actions">
                        <button
                          className="allproducts-btn-view"
                          onClick={() => handleViewDetail(product._id)}
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="allproducts-btn-buy"
                          onClick={() => handleBuyNow(product)}
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Phân trang */}
              {pagination.totalPages > 1 && (
                <div className="allproducts-pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="allproducts-page-btn"
                  >
                    ‹ Trước
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === pagination.currentPage;
                    const showPage =
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - pagination.currentPage) <= 2;
                    if (!showPage) {
                      if (
                        page === pagination.currentPage - 3 ||
                        page === pagination.currentPage + 3
                      ) {
                        return (
                          <span key={page} className="allproducts-page-dots">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`allproducts-page-btn ${
                          isCurrentPage ? "allproducts-page-active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="allproducts-page-btn"
                  >
                    Sau ›
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="allproducts-no-products">
              <i className="fas fa-search"></i>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              <button className="allproducts-clear-btn" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllProducts;
