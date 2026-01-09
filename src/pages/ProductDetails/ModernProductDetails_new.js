import {
  getProductById,
  getCommentsProduct,
  createCommentProduct,
  getProducts,
  getProductVariants,
  getReplies,
} from "../../services/Api";
import Http from "../../services/Http";
import axios from "axios";
import { BASE_API } from "../../shared/constants/app";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getImageProduct } from "../../shared/utils";
import { setCart } from "../../redux-setup/reducers/cart";
import { getCartByToken, addToCart } from "../../services/Api";
import { useDispatch, useSelector } from "react-redux";
import "../Products/AllProducts";

// StarRating Component
const StarRating = ({
  rating = 5,
  interactive = false,
  onRatingChange = null,
  showCount = false,
  count = 0,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`star-rating ${interactive ? "interactive" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`fas fa-star star ${
            star <= (interactive && hoverRating > 0 ? hoverRating : rating)
              ? "filled"
              : ""
          }`}
          onClick={interactive ? () => onRatingChange(star) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          style={interactive ? { cursor: "pointer" } : {}}
        ></i>
      ))}
      {showCount && <span className="rating-count">({count} đánh giá)</span>}
    </div>
  );
};

const ModernProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [colorVariants, setColorVariants] = useState([]);
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [loadingColors, setLoadingColors] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [form, setForm] = useState({ content: "", rating: 5 });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({
    storage: "default",
    condition: "99%",
    connectionType: "",
  });
  const [activeTab, setActiveTab] = useState("description");
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(
    (state) => state.auth?.login?.currentCustomer
  );
  const isLoggedIn = !!currentUser && !!localStorage.getItem("accessToken");

  const [productVariants, setProductVariants] = useState({
    storage: [],
    conditions: [],
  });

  const [missingFields, setMissingFields] = useState([]);

  // Determine product type based on category and specs
  const isHeadphoneProduct = () => {
    const categoryName = product.category?.name?.toLowerCase() || "";

    if (
      categoryName.includes("tai nghe") ||
      categoryName.includes("headphone") ||
      categoryName.includes("earphone") ||
      categoryName.includes("earbud") ||
      categoryName.includes("phụ kiện")
    ) {
      return true;
    }

    if (
      product.specs &&
      Object.keys(product.specs).some((key) =>
        [
          "connectionType",
          "driverSize",
          "impedance",
          "frequency",
          "noiseReduction",
          "batteryLife",
        ].includes(key)
      )
    ) {
      return true;
    }

    return false;
  };

  // Fetch replies for a comment
  const fetchRepliesForComment = async (commentId) => {
    try {
      const res = await getReplies(commentId);
      setReplies((prev) => ({ ...prev, [commentId]: res.data?.data || [] }));
    } catch (err) {
      setReplies((prev) => ({ ...prev, [commentId]: [] }));
    }
  };

  // useEffect hooks - keep all existing logic
  useEffect(() => {
    const fetchProductAndVariants = async () => {
      try {
        const response = await getProductById(id);
        const productData = response.data.data;
        setProduct(productData);

        if (productData.variants && Array.isArray(productData.variants)) {
          const storageOptions = [
            { label: "Mặc định", value: "default", price: 0 },
            ...productData.variants.map((variant) => ({
              label: `${variant.ram}GB / ${variant.storage}GB`,
              value: `${variant.storage}GB`,
              price: variant.price,
              ram: variant.ram,
            })),
          ];

          const conditionOptions = [
            { label: "99% - Like New", value: "99%", discount: 0 },
            { label: "98% - Đẹp", value: "98%", discount: 200000 },
            { label: "97% - Khá đẹp", value: "97%", discount: 400000 },
          ];

          setProductVariants({
            storage: storageOptions,
            conditions: conditionOptions,
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductAndVariants();
  }, [id]);

  useEffect(() => {
    const fetchColorVariants = async () => {
      if (!product._id) return;

      setLoadingColors(true);
      try {
        const response = await getProductVariants(product._id);
        const variantsData = response.data?.data || [];
        setColorVariants(variantsData);

        if (variantsData.length > 0) {
          const firstAvailableVariant =
            variantsData.find((v) => v.stock > 0) || variantsData[0];
          setSelectedColorVariant(firstAvailableVariant);
          setCurrentImages(firstAvailableVariant.images || []);
        }
      } catch (error) {
        console.error("Error fetching color variants:", error);
        setColorVariants([]);
      } finally {
        setLoadingColors(false);
      }
    };

    if (product._id) {
      fetchColorVariants();
    }
  }, [product._id]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product.category?._id) return;

      try {
        const response = await getProducts({
          category: product.category._id,
          limit: 8,
        });
        const allProducts = response.data.data || [];
        const filtered = allProducts.filter((p) => p._id !== product._id);
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (product.category?._id) {
      fetchRelatedProducts();
    }
  }, [product.category, product._id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsProduct(id);
        const commentsData = response.data.data || [];
        setComments(commentsData);

        commentsData.forEach((comment) => {
          fetchRepliesForComment(comment._id);
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
      navigate("/login");
      return;
    }

    try {
      await createCommentProduct(id, form);
      const updatedComments = await getCommentsProduct(id);
      setComments(updatedComments.data.data);

      (updatedComments.data.data || []).forEach((comment) => {
        fetchRepliesForComment(comment._id);
      });

      setForm({ content: "", rating: 5 });
      alert("Đánh giá của bạn đã được gửi thành công!");
    } catch (error) {
      console.error("Error creating comment:", error);
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        navigate("/login");
      } else {
        alert("Có lỗi xảy ra khi gửi đánh giá!");
      }
    }
  };

  const clickAddToCart = async (type) => {
    const fields = [];

    if (!isHeadphoneProduct() && !selectedColorVariant) {
      fields.push("color");
    }

    if (!isHeadphoneProduct()) {
      if (!selectedVariant.storage) fields.push("storage");
      if (!selectedVariant.condition) fields.push("condition");
    }

    if (fields.length > 0) {
      setMissingFields(fields);
      return;
    }

    if (
      !isHeadphoneProduct() &&
      selectedColorVariant &&
      selectedColorVariant.stock === 0
    ) {
      alert("Màu này đã hết hàng. Vui lòng chọn màu khác!");
      return;
    }

    try {
      const variantInfo = isHeadphoneProduct()
        ? {
            color: selectedColorVariant?.color || "Default",
            colorVariantId: selectedColorVariant?._id,
          }
        : {
            storage: selectedVariant.storage,
            color: selectedColorVariant?.color || "Default",
            colorVariantId: selectedColorVariant?._id,
            condition: selectedVariant.condition,
            ram: selectedVariant.ram,
          };

      const productData = {
        productId: product._id,
        quantity: 1,
        variant: variantInfo,
        price: calculateFinalPrice(),
      };

      if (isLoggedIn) {
        await addToCart(productData);
        const cartResponse = await getCartByToken();
        dispatch(setCart(cartResponse.data.data));
      } else {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push(productData);
        localStorage.setItem("cart", JSON.stringify(cart));
        dispatch(setCart(cart));
      }

      if (type === "buy-now") {
        navigate("/cart");
      } else {
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  const calculateFinalPrice = () => {
    let basePrice = product.price || 0;

    if (product.discount > 0) {
      basePrice = basePrice * (1 - product.discount / 100);
    }

    if (
      Array.isArray(product.variants) &&
      selectedVariant.storage &&
      selectedVariant.storage !== "default"
    ) {
      const variant = product.variants.find(
        (v) => `${v.storage}GB` === selectedVariant.storage
      );
      if (variant) {
        basePrice += variant.price;
      }
    }

    const conditionOption = productVariants.conditions.find(
      (c) => c.value === selectedVariant.condition
    );
    if (conditionOption) {
      basePrice -= conditionOption.discount;
    }

    return basePrice;
  };

  const renderStarRating = (
    rating = 5,
    interactive = false,
    onRatingChange = null
  ) => {
    return (
      <StarRating
        rating={rating}
        interactive={interactive}
        onRatingChange={onRatingChange}
        showCount={!interactive && !onRatingChange}
        count={comments.length}
      />
    );
  };

  const handleBuyNow = () => {
    clickAddToCart("buy-now");
  };

  const handleInstallment = () => {
    const fields = [];

    if (!selectedColorVariant) fields.push("color");
    if (!isHeadphoneProduct()) {
      if (!selectedVariant.storage) fields.push("storage");
      if (!selectedVariant.condition) fields.push("condition");
    }

    if (fields.length > 0) {
      setMissingFields(fields);
      return;
    }

    if (selectedColorVariant && selectedColorVariant.stock === 0) {
      alert("Màu này đã hết hàng. Vui lòng chọn màu khác!");
      return;
    }

    const variantInfo = isHeadphoneProduct()
      ? {
          color: selectedColorVariant.color,
          colorVariantId: selectedColorVariant._id,
        }
      : {
          storage: selectedVariant.storage,
          color: selectedColorVariant.color,
          colorVariantId: selectedColorVariant._id,
          condition: selectedVariant.condition,
          ram: selectedVariant.ram,
        };

    navigate(`/installment/${product._id}`, {
      state: {
        variant: variantInfo,
        price: calculateFinalPrice(),
      },
    });
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const ytRegex =
      /(?:youtube\.com\/(?:.*v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(ytRegex);
    return match ? match[1] : null;
  };

  if (!product._id) {
    return (
      <div className="product-details-loading-container">
        <div className="product-details-loading-spinner"></div>
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Breadcrumb */}
      <div className="product-details-breadcrumb-container">
        <nav className="product-details-breadcrumb">
          <a href="/">Trang chủ</a>
          <span className="separator">›</span>
          <a href="/products">Điện thoại</a>
          <span className="separator">›</span>
          <span className="current">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section - 3 Column Layout */}
      <div className="product-details-main">
        <div className="product-details-3col-container">
          {/* Column 1: Image Gallery */}
          <div className="product-details-col-image">
            <div className="product-details-gallery">
              <div className="product-details-main-image">
                <img
                  src={getImageProduct(
                    currentImages[activeImageIndex] ||
                      currentImages[0] ||
                      product.images?.[0]
                  )}
                  alt={product.name}
                  className="img-fluid"
                />
              </div>
              {currentImages.length > 1 && (
                <div className="product-details-thumbnail-list">
                  {currentImages.map((image, index) => (
                    <div
                      key={index}
                      className={`product-details-thumbnail ${
                        index === activeImageIndex ? "active" : ""
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={getImageProduct(image)}
                        alt={`Thumb ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="product-details-contact-info">
              <div className="product-details-promo-banner">
                <div className="product-details-promo-text">
                  <strong>Khuyến mãi:</strong> Miễn phí BHV lần thứ 5
                </div>
              </div>

              <div className="product-details-contact-methods">
                <div className="product-details-contact-item">
                  <i className="fab fa-facebook-messenger"></i>
                  <span>Chat Zalo: 0969.120.120</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Product Info */}
          <div className="product-details-col-info">
            <div className="product-details-info">
              <div className="product-details-header">
                <h1 className="product-details-title">{product.name}</h1>
                {renderStarRating()}

                <div className="product-details-price-section">
                  <div className="product-details-current-price">
                    {calculateFinalPrice().toLocaleString("vi-VN")}₫
                  </div>
                  {product.discount > 0 && (
                    <div className="product-details-original-price">
                      {product.price?.toLocaleString("vi-VN")}₫
                    </div>
                  )}
                </div>
              </div>

              <div className="product-details-variants">
                <div className="product-details-variant-group">
                  <label
                    className="product-details-variant-label"
                    data-field="color"
                  >
                    Chọn màu:
                    {missingFields.includes("color") && (
                      <span className="product-details-field-warning">
                        {" "}
                        Vui lòng không để trống thông tin
                      </span>
                    )}
                  </label>
                  <div className="product-details-color-options">
                    {loadingColors ? (
                      <span>Đang tải màu sắc...</span>
                    ) : colorVariants.length === 0 ? (
                      <span>Không có màu sắc cho sản phẩm này.</span>
                    ) : (
                      colorVariants.map((variant) => (
                        <button
                          key={variant._id}
                          className={`product-details-color-option ${
                            selectedColorVariant?._id === variant._id
                              ? "active"
                              : ""
                          } ${variant.stock === 0 ? "out-of-stock" : ""}`}
                          onClick={() => {
                            setSelectedColorVariant(variant);
                            setCurrentImages(variant.images || []);
                            setActiveImageIndex(0);
                          }}
                          disabled={variant.stock === 0}
                          title={variant.color}
                        >
                          <span
                            className="product-details-color-dot"
                            style={{ backgroundColor: variant.colorCode }}
                          />
                          <span className="product-details-color-name">
                            {variant.color}
                          </span>
                          <span className="product-details-stock-status-inline">
                            {variant.stock > 0 ? (
                              <span className="in-stock">
                                Còn {variant.stock}
                              </span>
                            ) : (
                              <span className="sold-out">Hết hàng</span>
                            )}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {selectedColorVariant && (
                  <div className="selected-variant-info">
                    <p>
                      <strong>Màu đã chọn:</strong> {selectedColorVariant.color}
                    </p>
                    <p>
                      <strong>Tình trạng:</strong>{" "}
                      {selectedColorVariant.stock > 0 ? (
                        <span className="text-success">
                          Còn hàng ({selectedColorVariant.stock} sản phẩm)
                        </span>
                      ) : (
                        <span className="text-danger">Hết hàng</span>
                      )}
                    </p>
                    {selectedColorVariant.sku && (
                      <p>
                        <strong>SKU:</strong> {selectedColorVariant.sku}
                      </p>
                    )}
                  </div>
                )}

                {!isHeadphoneProduct() && (
                  <>
                    <div className="product-details-variant-group">
                      <label className="product-details-variant-label">
                        Bộ nhớ:
                      </label>
                      <div className="product-details-storage-options">
                        <button
                          className={`product-details-storage-option ${
                            selectedVariant.storage === "default"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedVariant({
                              ...selectedVariant,
                              storage: "default",
                            })
                          }
                        >
                          <span>Mặc định</span>
                        </button>
                        {product.variants?.map((variant, idx) => (
                          <button
                            key={idx}
                            className={`product-details-storage-option ${
                              selectedVariant.storage === `${variant.storage}GB`
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedVariant({
                                ...selectedVariant,
                                storage: `${variant.storage}GB`,
                                ram: variant.ram,
                              })
                            }
                          >
                            <span>
                              {variant.ram}GB / {variant.storage}GB
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="product-details-variant-group">
                      <label className="product-details-variant-label">
                        Tình trạng:
                      </label>
                      <div className="product-details-condition-options">
                        {productVariants.conditions.map((condition) => (
                          <button
                            key={condition.value}
                            className={`product-details-condition-option ${
                              selectedVariant.condition === condition.value
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setSelectedVariant({
                                ...selectedVariant,
                                condition: condition.value,
                              })
                            }
                          >
                            <span>{condition.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="product-details-action-buttons">
                <button
                  className="product-details-btn-buy-now btn"
                  onClick={handleBuyNow}
                >
                  <i className="fas fa-bolt"></i>
                  Mua ngay
                </button>
                <button
                  className="product-details-btn-add-cart btn"
                  onClick={() => clickAddToCart()}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Thêm vào giỏ
                </button>
                <button
                  className="product-details-btn-installment btn"
                  onClick={handleInstallment}
                >
                  <i className="fas fa-credit-card"></i>
                  Trả góp 0%
                </button>
              </div>

              <div className="product-details-features">
                <div className="product-details-feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Bảo hành 12 tháng</span>
                </div>
                <div className="product-details-feature-item">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Giao hàng miễn phí</span>
                </div>
                <div className="product-details-feature-item">
                  <i className="fas fa-undo"></i>
                  <span>Đổi trả 15 ngày</span>
                </div>
                <div className="product-details-feature-item">
                  <i className="fas fa-certificate"></i>
                  <span>Chính hãng 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Related Products */}
          <div className="product-details-col-related">
            {relatedProducts.length > 0 && (
              <>
                <h3 className="related-sidebar-title">
                  <i className="fas fa-star"></i>
                  Sản phẩm gợi ý
                </h3>
                <div className="related-sidebar-list">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <div
                      key={relatedProduct._id}
                      className="related-sidebar-item"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        navigate(`/product/${relatedProduct._id}`);
                      }}
                    >
                      <div className="related-sidebar-image">
                        <img
                          src={getImageProduct(relatedProduct.images?.[0])}
                          alt={relatedProduct.name}
                        />
                        {relatedProduct.discount > 0 && (
                          <span className="related-sidebar-badge">
                            -{relatedProduct.discount}%
                          </span>
                        )}
                      </div>
                      <div className="related-sidebar-info">
                        <h5>{relatedProduct.name}</h5>
                        <div className="related-sidebar-price">
                          {relatedProduct.price?.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Specs and Video Section */}
      <div className="specs-video-wrapper">
        <div className="container">
          <div className="specs-video-container">
            <div className="specs-column">
              <h3>
                <i className="fas fa-microchip"></i>
                Thông số kỹ thuật
              </h3>
              <table className="specs-table-compact">
                <tbody>
                  <tr>
                    <td>Màn hình</td>
                    <td>
                      {product.displaySize}" {product.displayType || "OLED"}
                    </td>
                  </tr>
                  <tr>
                    <td>CPU</td>
                    <td>{product.chipset || "Apple A15"}</td>
                  </tr>
                  <tr>
                    <td>RAM</td>
                    <td>{product.ram || "4"}GB</td>
                  </tr>
                  <tr>
                    <td>Bộ nhớ</td>
                    <td>{product.storage || "128"}GB</td>
                  </tr>
                  <tr>
                    <td>Camera</td>
                    <td>{product.cameraRear || "12MP"}</td>
                  </tr>
                  <tr>
                    <td>Pin</td>
                    <td>{product.battery || "3000"}mAh</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="video-column">
              <h3>
                <i className="fas fa-play-circle"></i>
                Video sản phẩm
              </h3>
              {product.youtubeUrl && getYouTubeVideoId(product.youtubeUrl) ? (
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      product.youtubeUrl
                    )}`}
                    title="Product video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="no-video-message">
                  <i className="fas fa-video-slash"></i>
                  <p>Chưa có video giới thiệu cho sản phẩm này</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="product-tabs">
        <div className="container">
          <div className="tab-navigation">
            <button
              className={`tab-btn ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              <i className="fas fa-align-left"></i>
              <span>Mô tả</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "warranty" ? "active" : ""}`}
              onClick={() => setActiveTab("warranty")}
            >
              <i className="fas fa-shield-alt"></i>
              <span>Bảo hành</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <i className="fas fa-star"></i>
              <span>Đánh giá ({comments.length})</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div
                className="product-description"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description ||
                    "<p>Chưa có mô tả chi tiết cho sản phẩm này.</p>",
                }}
              />
            )}

            {activeTab === "warranty" && (
              <div className="warranty-policy">
                <h4>Chính sách bảo hành</h4>
                <ul>
                  <li>Bảo hành 12 tháng chính hãng</li>
                  <li>Đổi mới trong 15 ngày đầu</li>
                  <li>Sửa chữa miễn phí trong thời gian bảo hành</li>
                  <li>Hỗ trợ kỹ thuật trọn đời</li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-section">
                <div className="comment-form">
                  <h4>Viết đánh giá sản phẩm</h4>
                  {isLoggedIn ? (
                    <form onSubmit={handleSubmit}>
                      <div className="rating-input">
                        <label>Đánh giá của bạn:</label>
                        {renderStarRating(form.rating, true, (rating) =>
                          setForm({ ...form, rating })
                        )}
                      </div>
                      <div className="form-group">
                        <label>Nội dung:</label>
                        <textarea
                          name="content"
                          value={form.content}
                          onChange={handleChange}
                          placeholder="Chia sẻ trải nghiệm..."
                          required
                          rows={4}
                          className="form-control"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-paper-plane"></i>
                        Gửi đánh giá
                      </button>
                    </form>
                  ) : (
                    <div className="login-prompt">
                      <p>Vui lòng đăng nhập để đánh giá</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate("/login")}
                      >
                        Đăng nhập
                      </button>
                    </div>
                  )}
                </div>

                <div className="comments-list">
                  <h5>Đánh giá từ khách hàng ({comments.length})</h5>
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <strong>
                              {comment.userId?.fullName || "Khách hàng"}
                            </strong>
                            {renderStarRating(comment.rating || 5)}
                          </div>
                          <div className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                        <div className="comment-content">
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-comments">
                      <i className="fas fa-comments"></i>
                      <p>Chưa có đánh giá nào</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProductDetails;
