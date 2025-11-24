import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { searchProducts } from "../../services/Api";
import { getImageProduct } from "../../shared/utils";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 12,
  });
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("keyword") || ""
  );

  // Search khi location.search thay đổi (bao gồm cả lần đầu load)
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");

    if (urlKeyword) {
      setSearchKeyword(urlKeyword);
      performSearch(1, urlKeyword);
    } else {
      // Nếu không có keyword từ URL, clear results
      setProducts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 12,
      });
    }
  }, [location.search]); // Depend vào location.search để catch mọi thay đổi URL

  const performSearch = async (page = 1, keyword = null) => {
    const searchTerm = keyword || searchKeyword;

    if (!searchTerm?.trim()) {
      return;
    }

    setLoading(true);
    try {
      // Sử dụng API structure mới từ BE
      const apiParams = {
        keyword: searchTerm,
        page: page,
        limit: 12,
      };

      const response = await searchProducts(apiParams);

      if (response.data && response.data.data) {
        setProducts(response.data.data);
        if (response.data.pagination) {
          // Cập nhật pagination với structure từ BE
          setPagination({
            currentPage: response.data.pagination.page || 1,
            totalPages: response.data.pagination.totalPages || 1,
            totalProducts: response.data.pagination.total || 0,
            limit: response.data.pagination.limit || 12,
          });
        }
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      // Cập nhật URL để trigger useEffect
      navigate(
        `/products/search?keyword=${encodeURIComponent(searchKeyword.trim())}`
      );
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      performSearch(page);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBuyNow = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Header - chỉ hiển thị khi không có keyword từ URL */}
        {!searchParams.get("keyword") && (
          <div className="search-header">
            <h1>Tìm kiếm sản phẩm</h1>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Tìm kiếm theo thương hiệu điện thoại..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        )}

        {/* Search Header for URL search - hiển thị khi có keyword từ URL */}
        {searchParams.get("keyword") && (
          <div className="search-header compact">
            <h1>Kết quả tìm kiếm</h1>
            <div className="search-modify">
              <button
                className="modify-search-btn"
                onClick={() => {
                  navigate("/products/search");
                  setSearchKeyword("");
                }}
              >
                <i className="fas fa-edit"></i>
                Tìm kiếm khác
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="search-results">
          {loading && (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Đang tìm kiếm...</span>
            </div>
          )}

          {!loading && searchKeyword && (
            <div className="search-info">
              <p>
                Kết quả tìm kiếm cho: <strong>"{searchKeyword}"</strong>
              </p>
              <span>({pagination.totalProducts} sản phẩm)</span>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="search-card">
                  <div className="search-card-image">
                    <img
                      src={getImageProduct(product.images?.[0])}
                      alt={product.name}
                      onClick={() => handleViewDetail(product._id)}
                    />
                    {product.discount > 0 && (
                      <span className="search-discount-badge">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="search-card-content">
                    <h3
                      className="search-card-title"
                      onClick={() => handleViewDetail(product._id)}
                    >
                      {product.name}
                    </h3>
                    <div className="search-card-brand">
                      {product.brand?.name}
                    </div>
                    <div className="search-card-price">
                      {product.discount > 0 ? (
                        <>
                          <span className="search-price-sale">
                            {formatPrice(
                              product.price * (1 - product.discount / 100)
                            )}
                            đ
                          </span>
                          <span className="search-price-original">
                            {formatPrice(product.price)}đ
                          </span>
                        </>
                      ) : (
                        <span className="search-price-current">
                          {formatPrice(product.price)}đ
                        </span>
                      )}
                    </div>
                    <div className="search-card-actions">
                      <button
                        className="search-btn-view"
                        onClick={() => handleViewDetail(product._id)}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="search-btn-buy"
                        onClick={() => handleBuyNow(product)}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && searchKeyword && products.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Không có sản phẩm nào phù hợp với từ khóa "{searchKeyword}"</p>
            </div>
          )}

          {!loading && !searchKeyword && (
            <div className="search-placeholder">
              <i className="fas fa-search"></i>
              <h3>Tìm kiếm sản phẩm</h3>
              <p>Nhập tên thương hiệu để tìm kiếm sản phẩm</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && pagination.totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination">
                <button
                  className="page-btn prev"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                  Trước
                </button>

                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        className={`page-btn ${
                          pagination.currentPage === pageNumber ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}

                <button
                  className="page-btn next"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <div className="pagination-info">
                Trang {pagination.currentPage} / {pagination.totalPages} (
                {pagination.totalProducts} sản phẩm)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
