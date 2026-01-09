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
import "../Products/AllProducts"; // Import CSS để sử dụng button styles

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
  const [colorVariants, setColorVariants] = useState([]); // Array of color variants from API
  const [selectedColorVariant, setSelectedColorVariant] = useState(null); // Selected color variant object
  const [currentImages, setCurrentImages] = useState([]); // Images for selected color
  const [loadingColors, setLoadingColors] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({}); // {commentId: [reply, ...]}
  const [form, setForm] = useState({ content: "", rating: 5 });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({
    storage: "default",
    condition: "99%",
    connectionType: "", // For headphones
  });
  const [activeTab, setActiveTab] = useState("specs");
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from Redux store
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

    // Check category name
    if (
      categoryName.includes("tai nghe") ||
      categoryName.includes("headphone") ||
      categoryName.includes("earphone") ||
      categoryName.includes("earbud") ||
      categoryName.includes("phụ kiện")
    ) {
      return true;
    }

    // Check specs for headphone-specific fields
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

  const clickAddToCart = async (type) => {
    // Kiểm tra đủ trường trước khi thêm vào giỏ
    const fields = [];

    // Chỉ require màu cho điện thoại, tai nghe không bắt buộc
    if (!isHeadphoneProduct() && !selectedColorVariant) {
      fields.push("color");
    }

    if (!isHeadphoneProduct()) {
      if (!selectedVariant.storage) fields.push("storage");
      if (!selectedVariant.condition) fields.push("condition");
    }
    if (fields.length > 0) {
      setMissingFields(fields);
      scrollToField(fields[0]);
      return;
    }

    // Check stock - chỉ check nếu đã chọn màu và không phải tai nghe
    if (
      !isHeadphoneProduct() &&
      selectedColorVariant &&
      selectedColorVariant.stock === 0
    ) {
      alert("Màu này đã hết hàng. Vui lòng chọn màu khác!");
      return;
    }

    try {
      const cartData = {
        productId: id,
        quantity: 1,
        price: calculateFinalPrice(),
      };

      // Thêm thông tin màu nếu đã chọn
      if (selectedColorVariant) {
        cartData.colorVariantId = selectedColorVariant._id;
        cartData.color = selectedColorVariant.color;
      }

      // Add appropriate variant data based on product type
      if (isHeadphoneProduct()) {
        if (selectedColorVariant) {
          cartData.variant = {
            color: selectedColorVariant.color,
            colorVariantId: selectedColorVariant._id,
            price: calculateFinalPrice(),
          };
        } else {
          // Không có màu, chỉ có giá
          cartData.variant = {
            price: calculateFinalPrice(),
          };
        }
      } else {
        // Nếu chọn mặc định, lưu thông tin RAM và storage cụ thể từ specs của sản phẩm
        if (selectedVariant.storage === "default") {
          const defaultRam = product.ram || "4"; // Lấy RAM mặc định từ specs
          const defaultStorage = product.storage || "128"; // Lấy storage mặc định từ specs
          cartData.storage = `${defaultStorage}GB`;
          cartData.ram = `${defaultRam}GB`;
          cartData.variant = {
            ram: `${defaultRam}GB`,
            storage: `${defaultStorage}GB`,
            color: selectedColorVariant.color,
            colorVariantId: selectedColorVariant._id,
            price: calculateFinalPrice(),
            isDefault: true, // Đánh dấu đây là cấu hình mặc định
          };
        } else {
          cartData.storage = selectedVariant.storage;
          cartData.ram = selectedVariant.ram;
          cartData.variant = {
            ram: selectedVariant.ram,
            storage: selectedVariant.storage,
            color: selectedColorVariant.color,
            colorVariantId: selectedColorVariant._id,
            price: calculateFinalPrice(),
          };
        }
      }
      await addToCart(cartData);
      const res = await getCartByToken();
      dispatch(
        setCart(
          (res.data.items || []).map((item) => ({
            _id: item._id,
            productId: item.productId,
            quantity: Number(item.quantity),
            price: item.price, // luôn lưu giá đã tính theo variant
          }))
        )
      );
      if (type === "buy-now") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    if (id) {
      // Get product details
      getProductById(id)
        .then((res) => {
          setProduct(res.data.data);
        })
        .catch((error) => console.error("Error:", error));

      // Get color variants from new API
      setLoadingColors(true);
      axios
        .get(`${BASE_API}/products/${id}/color-variants`)
        .then((res) => {
          if (res.data.success) {
            const { variants, defaultImages } = res.data.data;
            setColorVariants(variants || []);

            // Tự động chọn variant đầu tiên hoặc dùng ảnh mặc định
            if (variants && variants.length > 0) {
              setSelectedColorVariant(variants[0]);
              setCurrentImages(variants[0].images || []);
            } else {
              setSelectedColorVariant(null);
              // Use defaultImages or product images as fallback
              getProductById(id).then((productRes) => {
                setCurrentImages(
                  defaultImages || productRes.data.data.images || []
                );
              });
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching color variants:", err);
          setColorVariants([]);
          // Fallback to product images
          getProductById(id).then((productRes) => {
            setCurrentImages(productRes.data.data.images || []);
          });
        })
        .finally(() => setLoadingColors(false));

      // Get comments
      getCommentsProduct(id)
        .then((res) => {
          setComments(res.data.data);
          // Fetch replies for each comment
          (res.data.data || []).forEach((comment) => {
            fetchRepliesForComment(comment._id);
          });
        })
        .catch((err) => console.error("Error:", err));

      // Get related products - Smart filtering based on category, brand, and price
      getProducts()
        .then((res) => {
          const allProducts = res.data.data;

          // Get current product details first
          getProductById(id).then((currentRes) => {
            const currentProduct = currentRes.data.data;

            // Filter logic: prioritize same category, brand, and similar price
            let related = allProducts.filter((p) => {
              if (p._id === id) return false; // Exclude current product

              // Same category and brand (highest priority)
              if (
                p.category?._id === currentProduct.category?._id &&
                p.brand?._id === currentProduct.brand?._id
              ) {
                return true;
              }

              // Same category only (medium priority)
              if (p.category?._id === currentProduct.category?._id) {
                return true;
              }

              return false;
            });

            // Sort by relevance: same brand first, then by price similarity
            related.sort((a, b) => {
              // Prioritize same brand
              const aSameBrand = a.brand?._id === currentProduct.brand?._id;
              const bSameBrand = b.brand?._id === currentProduct.brand?._id;

              if (aSameBrand && !bSameBrand) return -1;
              if (!aSameBrand && bSameBrand) return 1;

              // Then sort by price similarity
              const aPriceDiff = Math.abs(
                (a.price || 0) - (currentProduct.price || 0)
              );
              const bPriceDiff = Math.abs(
                (b.price || 0) - (currentProduct.price || 0)
              );

              return aPriceDiff - bPriceDiff;
            });

            // If not enough products, fallback to any products except current
            if (related.length < 4) {
              const fallback = allProducts
                .filter(
                  (p) => p._id !== id && !related.find((r) => r._id === p._id)
                )
                .slice(0, 4 - related.length);
              related = [...related, ...fallback];
            }

            setRelatedProducts(related.slice(0, 4));
          });
        })
        .catch((err) => console.error("Error fetching related products:", err));

      // Lấy cấu hình storage từ API
      getProductVariants(id).then((res) => {
        if (Array.isArray(res.data)) {
          setProductVariants({
            storage: res.data.map((v) => ({
              size: `${v.storage}GB`,
              price: v.price,
              available: true,
              ram: v.ram,
            })),
            conditions: [
              { label: "98% - PIN 8X", value: "98%-8x", discount: 200000 },
              { label: "98% - PIN 9X", value: "98%-9x", discount: 100000 },
              { label: "99% - PIN 8X", value: "99%-8x", discount: 50000 },
              { label: "99% - PIN 9X", value: "99%-9x", discount: 0 },
            ],
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const reviewData = {
        content: form.content,
        rating: form.rating,
      };

      const res = await createCommentProduct(id, reviewData);

      // Refresh comments list
      const updatedComments = await getCommentsProduct(id);
      setComments(updatedComments.data.data);
      // Fetch replies for new comments
      (updatedComments.data.data || []).forEach((comment) => {
        fetchRepliesForComment(comment._id);
      });

      // Reset form
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

  const calculateFinalPrice = () => {
    let basePrice = product.price || 0;

    // Áp dụng giảm giá nếu có
    if (product.discount > 0) {
      basePrice = basePrice * (1 - product.discount / 100);
    }

    // Nếu chọn mặc định thì không cộng thêm giá variant
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

    // Apply condition discount
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

  const isBuyDisabled =
    (!isHeadphoneProduct() &&
      (!selectedColorVariant || selectedColorVariant.stock <= 0)) ||
    (!isHeadphoneProduct() &&
      (!selectedVariant.storage ||
        selectedVariant.storage === "" ||
        !selectedVariant.condition));

  const scrollToField = (field) => {
    const el = document.querySelector(
      `.product-details-variant-label[data-field='${field}']`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleBuyNow = () => {
    const fields = [];

    if (!selectedColorVariant) fields.push("color");
    if (!isHeadphoneProduct()) {
      if (!selectedVariant.storage) fields.push("storage");
      if (!selectedVariant.condition) fields.push("condition");
    }

    if (fields.length > 0) {
      setMissingFields(fields);
      scrollToField(fields[0]);
      return;
    }

    if (selectedColorVariant && selectedColorVariant.stock === 0) {
      alert("Màu này đã hết hàng. Vui lòng chọn màu khác!");
      return;
    }

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
      scrollToField(fields[0]);
      return;
    }

    if (selectedColorVariant && selectedColorVariant.stock === 0) {
      alert("Màu này đã hết hàng. Vui lòng chọn màu khác!");
      return;
    }

    // Chuyển hướng với thông tin variant đã chọn
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

      {/* Main Product Section */}
      <div className="product-details-main">
        <div className="product-details-container-inner">
          <div className="product-details-row">
            {/* Image Gallery */}
            <div className="product-details-col-lg-6 product-details-col-md-6">
              <div className="product-details-gallery">
                <div className="product-details-main-image">
                  <img
                    src={getImageProduct(
                      currentImages[activeImageIndex] ||
                        currentImages[0] ||
                        product.images?.[0]
                    )}
                    alt={`${product.name}${
                      selectedColorVariant
                        ? ` - ${selectedColorVariant.color}`
                        : ""
                    }`}
                    className="img-fluid"
                  />
                  <div className="product-details-image-badges">
                    {product.discount > 0 && (
                      <span className="product-details-badge product-details-badge-sale">
                        -{product.discount}%
                      </span>
                    )}
                    <span className="product-details-badge product-details-badge-condition">
                      99% Like New
                    </span>
                  </div>
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
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact & Store Info - MobileCity style */}
              <div className="product-details-contact-info">
                <div className="product-details-promo-banner">
                  <div className="product-details-promo-text">
                    <strong>Khuyến mãi:</strong> Miễn phí BHV lần thứ 5, khi đã
                    mua BHV lần thứ 4
                  </div>
                </div>

                <div className="product-details-contact-methods">
                  <div className="product-details-contact-item">
                    <i className="fab fa-facebook-messenger"></i>
                    <span>Chat Zalo: 0969.120.120</span>
                  </div>
                  <div className="product-details-contact-section">
                    <div className="product-details-contact-item">
                      <i className="fas fa-phone"></i>
                      <span>Hà Nội: 097.120.6688</span>
                    </div>
                    <div className="product-details-contact-item">
                      <i className="fas fa-phone"></i>
                      <span>Tp.HCM: 0965.123.123</span>
                    </div>
                    <div className="product-details-contact-item">
                      <i className="fas fa-phone"></i>
                      <span>Đà Nẵng: 096.123.9797</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="product-details-col-lg-6 product-details-col-md-6">
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

                {/* Product Variants */}
                <div className="product-details-variants">
                  {/* Colors - lấy từ API */}
                  <div className="product-details-variant-group">
                    <label
                      className="product-details-variant-label"
                      data-field="color"
                    >
                      Chọn màu:
                      {selectedColorVariant && (
                        <span className="selected-color-name">
                          {" "}
                          {selectedColorVariant.color}
                        </span>
                      )}
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
                              setActiveImageIndex(0); // Reset về ảnh đầu tiên
                            }}
                            disabled={variant.stock === 0}
                            title={variant.color}
                          >
                            {/* Color dot */}
                            <span
                              className="product-details-color-dot"
                              style={{ backgroundColor: variant.colorCode }}
                            />

                            {/* Color name */}
                            <span className="product-details-color-name">
                              {variant.color}
                            </span>

                            {/* Stock status */}
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

                  {/* Selected variant info */}
                  {selectedColorVariant && (
                    <div className="selected-variant-info">
                      <p>
                        <strong>Màu đã chọn:</strong>{" "}
                        {selectedColorVariant.color}
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

                  {/* Storage - Only for phones */}
                  {!isHeadphoneProduct() && (
                    <div className="product-details-variant-group">
                      <label
                        className="product-details-variant-label"
                        data-field="storage"
                      >
                        Bộ nhớ:
                        {missingFields.includes("storage") && (
                          <span className="product-details-field-warning">
                            {" "}
                            Vui lòng không để trống thông tin
                          </span>
                        )}
                      </label>
                      <div className="product-details-storage-options">
                        {/* Option mặc định */}
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
                              ram: undefined,
                            })
                          }
                        >
                          <span className="product-details-storage-size">
                            Mặc định
                          </span>
                        </button>
                        {/* Các option variant */}
                        {Array.isArray(product.variants) &&
                        product.variants.length > 0 ? (
                          product.variants.map((variant, idx) => (
                            <button
                              key={idx}
                              className={`product-details-storage-option ${
                                selectedVariant.storage ===
                                `${variant.storage}GB`
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
                              <span className="product-details-storage-size">
                                {variant.ram}GB / {variant.storage}GB
                              </span>
                              {variant.price > 0 && (
                                <span className="product-details-storage-price">
                                  +{variant.price.toLocaleString()}₫
                                </span>
                              )}
                            </button>
                          ))
                        ) : (
                          <span>
                            Không có cấu hình bộ nhớ cho sản phẩm này.
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Condition - Only for phones */}
                  {!isHeadphoneProduct() && (
                    <div className="product-details-variant-group">
                      <label
                        className="product-details-variant-label"
                        data-field="condition"
                      >
                        Tình trạng:
                        {missingFields.includes("condition") && (
                          <span className="product-details-field-warning">
                            {" "}
                            Vui lòng không để trống thông tin
                          </span>
                        )}
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
                            {condition.discount > 0 && (
                              <span className="product-details-condition-discount">
                                -{condition.discount.toLocaleString()}₫
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="product-details-stock-status">
                  <div
                    className={`product-details-stock-indicator ${
                      isHeadphoneProduct() ||
                      (selectedColorVariant && selectedColorVariant.stock > 0)
                        ? "in-stock"
                        : "out-stock"
                    }`}
                  >
                    <i
                      className={`fas ${
                        isHeadphoneProduct() ||
                        (selectedColorVariant && selectedColorVariant.stock > 0)
                          ? "fa-check-circle"
                          : "fa-times-circle"
                      }`}
                    ></i>
                    <span>
                      {isHeadphoneProduct()
                        ? "Còn hàng"
                        : selectedColorVariant
                        ? selectedColorVariant.stock > 0
                          ? "Còn hàng"
                          : "Hết hàng"
                        : "Vui lòng chọn màu"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="product-details-action-buttons">
                  <button
                    className="product-details-btn-buy-now btn"
                    onClick={handleBuyNow}
                    disabled={
                      !isHeadphoneProduct() &&
                      (!selectedColorVariant || selectedColorVariant.stock <= 0)
                    }
                  >
                    <i className="fas fa-bolt"></i>
                    {!isHeadphoneProduct() && !selectedColorVariant
                      ? "Chọn màu"
                      : selectedColorVariant && selectedColorVariant.stock <= 0
                      ? "Hết hàng"
                      : "Mua ngay"}
                  </button>
                  <button
                    className="product-details-btn-add-cart btn"
                    onClick={() => clickAddToCart()}
                    disabled={
                      !isHeadphoneProduct() &&
                      (!selectedColorVariant || selectedColorVariant.stock <= 0)
                    }
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Thêm vào giỏ
                  </button>
                  <button
                    className="product-details-btn-installment btn"
                    onClick={handleInstallment}
                    disabled={
                      !isHeadphoneProduct() &&
                      (!selectedColorVariant || selectedColorVariant.stock <= 0)
                    }
                  >
                    <i className="fas fa-credit-card"></i>
                    Trả góp 0%
                  </button>
                </div>

                {/* Product Features */}
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
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="container">
          <div className="tab-navigation">
            <button
              className={`tab-btn tab-specs ${
                activeTab === "specs" ? "active" : ""
              }`}
              onClick={() => setActiveTab("specs")}
            >
              <i className="fas fa-microchip"></i>
              <span>Thông số kỹ thuật</span>
            </button>
            <button
              className={`tab-btn tab-description ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              <i className="fas fa-align-left"></i>
              <span>Mô tả sản phẩm</span>
            </button>
            <button
              className={`tab-btn tab-warranty ${
                activeTab === "warranty" ? "active" : ""
              }`}
              onClick={() => setActiveTab("warranty")}
            >
              <i className="fas fa-shield-alt"></i>
              <span>Chính sách bảo hành</span>
            </button>
            <button
              className={`tab-btn tab-reviews ${
                activeTab === "reviews" ? "active" : ""
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              <i className="fas fa-star"></i>
              <span>Đánh giá ({comments.length})</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "specs" && (
              <div className="specs-table">
                <table className="table">
                  <tbody>
                    {isHeadphoneProduct() ? (
                      // Headphone specifications
                      <>
                        <tr>
                          <td>Kiểu tai nghe</td>
                          <td>
                            {product.specs?.headphoneType ||
                              product.headphoneType ||
                              "Over-ear"}
                          </td>
                        </tr>
                        <tr>
                          <td>Kết nối</td>
                          <td>
                            {product.specs?.connectionType ||
                              product.connectionType ||
                              "Bluetooth 5.0"}
                          </td>
                        </tr>
                        <tr>
                          <td>Driver</td>
                          <td>
                            {product.specs?.driverSize ||
                              product.driverSize ||
                              "40"}
                            mm
                          </td>
                        </tr>
                        <tr>
                          <td>Trở kháng</td>
                          <td>
                            {product.specs?.impedance ||
                              product.impedance ||
                              "32"}
                            Ω
                          </td>
                        </tr>
                        <tr>
                          <td>Phản hồi tần số</td>
                          <td>
                            {product.specs?.frequency ||
                              product.frequency ||
                              "20Hz - 20kHz"}
                          </td>
                        </tr>
                        <tr>
                          <td>Thời lượng pin</td>
                          <td>
                            {product.specs?.batteryLife ||
                              product.batteryLife ||
                              "30"}{" "}
                            giờ
                          </td>
                        </tr>
                        {showFullSpecs && (
                          <>
                            <tr>
                              <td>Chống ồn</td>
                              <td>
                                {product.specs?.noiseReduction ||
                                  product.noiseReduction ||
                                  "Có"}
                              </td>
                            </tr>
                            <tr>
                              <td>Micro</td>
                              <td>
                                {product.specs?.microphone ||
                                  product.microphone ||
                                  "Có"}
                              </td>
                            </tr>
                            <tr>
                              <td>Trọng lượng</td>
                              <td>
                                {product.specs?.weight ||
                                  product.weight ||
                                  "250"}
                                g
                              </td>
                            </tr>
                            <tr>
                              <td>Màu sắc</td>
                              <td>
                                {product.specs?.availableColors ||
                                  product.availableColors ||
                                  "Đen, Trắng"}
                              </td>
                            </tr>
                          </>
                        )}
                      </>
                    ) : (
                      // Phone specifications
                      <>
                        <tr>
                          <td>Màn hình</td>
                          <td>
                            {product.displaySize}"{" "}
                            {product.displayType || "IPS LCD"}
                          </td>
                        </tr>
                        <tr>
                          <td>Hệ điều hành</td>
                          <td>{product.os || "iOS 15"}</td>
                        </tr>
                        <tr>
                          <td>Camera sau</td>
                          <td>{product.cameraRear || "12MP"}</td>
                        </tr>
                        <tr>
                          <td>Camera trước</td>
                          <td>{product.cameraFront || "7MP"}</td>
                        </tr>
                        <tr>
                          <td>CPU</td>
                          <td>{product.chipset || "Apple A15 Bionic"}</td>
                        </tr>
                        <tr>
                          <td>RAM</td>
                          <td>{product.ram || "4"}GB</td>
                        </tr>
                        <tr>
                          <td>Bộ nhớ trong</td>
                          <td>{product.storage || "128"}GB</td>
                        </tr>
                        <tr>
                          <td>Dung lượng pin</td>
                          <td>{product.battery || "3110"}mAh</td>
                        </tr>
                        {showFullSpecs && (
                          <>
                            <tr>
                              <td>Thẻ SIM</td>
                              <td>2 SIM (Nano-SIM và eSIM)</td>
                            </tr>
                            <tr>
                              <td>Thiết kế</td>
                              <td>Khung nhôm, mặt lưng kính</td>
                            </tr>
                          </>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
                <button
                  className="btn-show-more"
                  onClick={() => setShowFullSpecs(!showFullSpecs)}
                >
                  {showFullSpecs ? "Thu gọn" : "Xem thêm cấu hình chi tiết"}
                </button>
              </div>
            )}

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
                  <li>Đổi mới trong 15 ngày đầu nếu có lỗi từ nhà sản xuất</li>
                  <li>Sửa chữa miễn phí trong thời gian bảo hành</li>
                  <li>Hỗ trợ kỹ thuật trọn đời</li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-section">
                {/* Comment Form */}
                <div className="comment-form">
                  <h4>Viết đánh giá sản phẩm</h4>

                  {isLoggedIn ? (
                    <form onSubmit={handleSubmit}>
                      <div className="user-info">
                        <div className="user-avatar">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-details">
                          <strong>
                            {currentUser?.name || currentUser?.fullName}
                          </strong>
                          <span>Đang đánh giá với tư cách khách hàng</span>
                        </div>
                      </div>

                      <div className="rating-input">
                        <label>Đánh giá của bạn:</label>
                        {renderStarRating(form.rating, true, (rating) =>
                          setForm({ ...form, rating })
                        )}
                        <span className="rating-text">
                          {form.rating === 1 && "Rất tệ"}
                          {form.rating === 2 && "Tệ"}
                          {form.rating === 3 && "Bình thường"}
                          {form.rating === 4 && "Tốt"}
                          {form.rating === 5 && "Rất tốt"}
                        </span>
                      </div>

                      <div className="form-group">
                        <label>Nội dung đánh giá:</label>
                        <textarea
                          name="content"
                          value={form.content}
                          onChange={handleChange}
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                          required
                          rows={4}
                          className="form-control"
                          minLength={10}
                          maxLength={500}
                        />
                        <div className="char-count">
                          {form.content.length}/500 ký tự
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-paper-plane"></i>
                        Gửi đánh giá
                      </button>
                    </form>
                  ) : (
                    <div className="login-prompt">
                      <div className="login-message">
                        <i className="fas fa-sign-in-alt"></i>
                        <h5>Đăng nhập để đánh giá sản phẩm</h5>
                        <p>
                          Bạn cần đăng nhập để có thể viết đánh giá về sản phẩm
                          này
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate("/login")}
                        >
                          Đăng nhập ngay
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comments List */}
                <div className="comments-list">
                  <h5>Đánh giá từ khách hàng ({comments.length})</h5>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={comment._id || index} className="comment-item">
                        <div className="comment-header">
                          <div className="comment-author">
                            <div className="author-avatar">
                              <i className="fas fa-user-circle"></i>
                            </div>
                            <div className="author-info">
                              <strong>
                                {comment.userId?.fullName ||
                                  comment.userId?.name ||
                                  comment.name ||
                                  "Khách hàng"}
                              </strong>
                              {renderStarRating(comment.rating || 5)}
                            </div>
                          </div>
                          <div className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <div className="comment-content">
                          <p>{comment.content}</p>
                        </div>
                        {/* Hiển thị phản hồi admin nếu có */}
                        {replies[comment._id] &&
                          replies[comment._id].length > 0 && (
                            <div className="admin-reply-list">
                              <div className="admin-reply-header">
                                <span className="admin-badge">
                                  👨‍💼 Phản hồi từ Phone Store
                                </span>
                              </div>
                              {replies[comment._id].map((reply) => (
                                <div
                                  key={reply._id}
                                  className="admin-reply-item"
                                >
                                  <div className="admin-reply-meta">
                                    <span className="reply-date">
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <div className="admin-reply-content">
                                    {reply.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        {comment.userId &&
                          currentUser &&
                          comment.userId._id === currentUser._id && (
                            <div className="comment-actions">
                              <button className="edit-btn">
                                <i className="fas fa-edit"></i> Sửa
                              </button>
                            </div>
                          )}
                      </div>
                    ))
                  ) : (
                    <div className="no-comments">
                      <i className="fas fa-comments"></i>
                      <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                      <p>Hãy là người đầu tiên đánh giá!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="scoped-related-products">
          <div className="scoped-container">
            <h3 className="scoped-section-title">Sản phẩm tương tự</h3>
            <div className="scoped-row">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="scoped-col-lg-3 scoped-col-md-6 scoped-col-sm-6"
                >
                  <div className="scoped-product-card">
                    <div className="scoped-product-image">
                      <img
                        src={getImageProduct(relatedProduct.images?.[0])}
                        alt={relatedProduct.name}
                      />
                      {relatedProduct.discount > 0 && (
                        <span className="scoped-badge scoped-badge-sale">
                          -{relatedProduct.discount}%
                        </span>
                      )}
                    </div>
                    <div className="scoped-product-info">
                      <h5 className="scoped-product-name">
                        {relatedProduct.name}
                      </h5>
                      <div className="scoped-product-price">
                        <span className="scoped-current-price">
                          {relatedProduct.price?.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="allproducts-card-actions">
                        <button
                          className="allproducts-btn-view"
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            navigate(`/product/${relatedProduct._id}`);
                          }}
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="allproducts-btn-buy"
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            navigate(`/product/${relatedProduct._id}`);
                          }}
                        >
                          Mua ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernProductDetails;
