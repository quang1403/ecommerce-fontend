import { useState, useEffect } from "react";
import { getProductsByBrand } from "../../services/Api";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getImageProduct } from "../../shared/utils";
const Category = () => {
  const { id } = useParams(); // brandId
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || "";
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    search: "",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [id, categoryId, filters, pagination.currentPage]);

  const fetchProducts = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Gọi API với cả brandId và categoryId nếu có
      const res = await getProductsByBrand(id, categoryId);
      let productsData = res.data.data || [];
      // Search
      if (filters.search) {
        productsData = productsData.filter((p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      // Price
      if (filters.minPrice) {
        productsData = productsData.filter(
          (p) => p.price >= Number(filters.minPrice)
        );
      }
      if (filters.maxPrice) {
        productsData = productsData.filter(
          (p) => p.price <= Number(filters.maxPrice)
        );
      }
      // Sort
      productsData = [...productsData].sort((a, b) => {
        if (filters.sortBy === "price") {
          return filters.sortOrder === "asc"
            ? a.price - b.price
            : b.price - a.price;
        } else if (filters.sortBy === "name") {
          return filters.sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return 0;
        }
      });
      // Pagination
      const totalProducts = productsData.length;
      const totalPages = Math.max(
        1,
        Math.ceil(totalProducts / pagination.limit)
      );
      const startIdx = (pagination.currentPage - 1) * pagination.limit;
      const pagedData = productsData.slice(
        startIdx,
        startIdx + pagination.limit
      );
      setProducts(pagedData);
      setPagination((prev) => ({
        ...prev,
        totalPages,
        totalProducts,
      }));
      // Lấy tên brand và category từ sản phẩm đầu tiên (nếu có)
      if (productsData.length > 0) {
        setBrandName(productsData[0].brand?.name || "");
        setCategoryName(productsData[0].category?.name || "");
      } else {
        setBrandName("");
        setCategoryName("");
      }
    } catch (error) {
      setProducts([]);
      setPagination((prev) => ({ ...prev, totalPages: 1, totalProducts: 0 }));
      setBrandName("");
      setCategoryName("");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      search: "",
      sortBy: "name",
      sortOrder: "asc",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="allproducts-container">
      <div className="allproducts-header">
        <h1>
          {brandName ? `Sản phẩm của ${brandName}` : `Sản phẩm của brand ${id}`}
          
        </h1>
    
      </div>
      <div className="allproducts-content">
        {/* Sidebar Filter */}
        
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
              </select>
            </div>
          </div>
          {loading ? (
            <div className="allproducts-no-results">Đang tải sản phẩm...</div>
          ) : products.length > 0 ? (
            <div className="allproducts-grid">
              {products.map((product) => (
                <div key={product._id} className="allproducts-card">
                  <div className="allproducts-card-image">
                    <img
                      src={getImageProduct(product.images?.[0])}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                    {product.discount > 0 && (
                      <div className="allproducts-discount-badge">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="allproducts-card-content">
                    <h3 className="allproducts-card-title">{product.name}</h3>
                    <p className="allproducts-card-brand">
                      {product.brand?.name || "Không xác định"}
                    </p>
                    <div className="allproducts-card-price">
                      {product.discount && product.discount > 0 ? (
                        <>
                          <span className="allproducts-price-sale">
                            {formatPrice(
                              product.price * (1 - product.discount / 100)
                            )}
                          </span>
                          <span className="allproducts-price-original">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="allproducts-price-sale">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <div className="allproducts-card-actions">
                      <button
                        className="allproducts-btn-view"
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="allproducts-btn-buy"
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="allproducts-no-results">Không có sản phẩm nào.</div>
          )}
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
        </main>
      </div>
    </div>
  );
};

export default Category;
