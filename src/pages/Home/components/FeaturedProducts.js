import { useNavigate } from "react-router-dom";
import "./FeaturedProducts.css";
import { getImageProduct } from "../../../shared/utils";

const FeaturedProducts = ({ products }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleBuyNow = (product) => {
    navigate(`/product/${product._id}`);
  };

  if (!products || products.length === 0) {
    return (
      <div className="FeaturedProducts">
        <div className="featured-products">
          <div className="no-products">
            <p>Không có sản phẩm nổi bật nào</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="FeaturedProducts">
      <div className="featured-products-section">
        <div className="featured-products-grid">
          {products.slice(0, 8).map((product) => (
            <div key={product._id} className="featured-product-card">
              <div className="featured-product-card-image">
                <img
                  src={getImageProduct(product.images?.[0])}
                  alt="Ảnh sản phẩm"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />
                {product.discount > 0 && (
                  <div className="featured-product-discount-badge">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="featured-product-card-content">
                <h3 className="featured-product-card-title">{product.name}</h3>
                <p className="featured-product-card-brand">
                  {product.brand?.name || "Không xác định"}
                </p>
                <div className="featured-product-card-price">
                  {product.discount && product.discount > 0 ? (
                    <>
                      <span className="featured-product-price-current">
                        {formatPrice(
                          product.price * (1 - product.discount / 100)
                        )}
                      </span>
                      <span className="featured-product-price-original">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="featured-product-price-current">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <div className="featured-product-card-actions">
                  <button
                    className="featured-product-view-btn"
                    onClick={() => handleViewDetail(product._id)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="featured-product-cart-btn"
                    onClick={() => handleBuyNow(product)}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
