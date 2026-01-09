import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { chatAsk, addToCart, getProductById } from "../../../services/Api";
import Http from "../../../services/Http";
import "./AIChatbot.css";

/**
 * ⭐ AI CHATBOT COMPONENT - PHIÊN BẢN ĐƠN GIẢN HÓA
 *
 * Sử dụng endpoint duy nhất: POST /api/chat/ask
 * Backend tự động nhận diện intent và xử lý phù hợp
 *
 * Cách hoạt động:
 * 1. FE gửi message + sessionId lên BE
 * 2. BE tự động:
 *    - Nhận diện intent (tư vấn, so sánh, tồn kho, v.v.)
 *    - Truy vấn database
 *    - Quản lý context và lịch sử chat
 *    - Trả về kết quả phù hợp
 * 3. FE chỉ cần hiển thị kết quả
 */

const AIChatbot = () => {
  const navigate = useNavigate();
  const login = useSelector(({ auth }) => auth.login);
  const isLoggedIn = login?.currentCustomer?.accessToken;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào! Tôi là trợ lý AI của PhoneStore. Tôi có thể giúp bạn:\n\n• Tư vấn sản phẩm\n• Gợi ý điện thoại phù hợp\n• So sánh sản phẩm\n• Kiểm tra tồn kho\n• Tra cứu đơn hàng\n\nBạn cần tôi giúp gì?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Variant modal state
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantModalData, setVariantModalData] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({
    color: "",
    storage: "default",
    ram: "",
  });
  const [availableColors, setAvailableColors] = useState([]);

  // ⭐ SessionId duy nhất cho phiên chat - giữ nguyên cho đến khi user đóng chat
  const sessionId = useRef(`session_${Date.now()}`);

  // Auto scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle action button click
  const handleAction = async (actionType, productId, message) => {
    console.log(
      "🔍 Action clicked:",
      actionType,
      "ProductID:",
      productId,
      "Type:",
      typeof productId
    );

    if (!productId || typeof productId !== "string") {
      console.error("❌ Invalid productId:", productId);
      alert("Không tìm thấy thông tin sản phẩm!");
      return;
    }

    // Kiểm tra đăng nhập
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      navigate("/login");
      return;
    }

    try {
      // Lấy thông tin đầy đủ của product từ API
      const productRes = await getProductById(productId);
      const fullProduct = productRes.data.data;

      // ✅ ƯU TIÊN dùng colorVariants từ message (đã có sẵn từ chatbot)
      let colorVariants = [];

      if (message?.colorVariants && message.colorVariants.length > 0) {
        // Có colorVariants từ chatbot response
        colorVariants = message.colorVariants;
        console.log(
          "✅ Dùng colorVariants từ chatbot response:",
          colorVariants.length
        );
      } else if (
        fullProduct?.colorVariants &&
        fullProduct.colorVariants.length > 0
      ) {
        // Fallback: dùng colorVariants từ product API
        colorVariants = fullProduct.colorVariants;
        console.log("⚠️ Fallback: dùng colorVariants từ product API");
      }

      // Extract màu sắc từ colorVariants
      const colors = colorVariants.map((v) => v.color);

      // Kiểm tra xem sản phẩm có cần chọn variant không
      const needsVariant =
        colors.length > 0 ||
        (fullProduct.variants && fullProduct.variants.length > 0);

      if (needsVariant) {
        // Hiển thị modal chọn variant
        setAvailableColors(colors);
        setVariantModalData({
          actionType,
          productId,
          product: fullProduct,
          colorVariants: colorVariants, // ✅ Lưu colorVariants vào modal data
        });
        setSelectedVariant({
          color: colors.length > 0 ? "" : "default",
          storage: "default",
          ram: "",
        });
        setShowVariantModal(true);
      } else {
        // Không cần chọn variant, thêm trực tiếp vào giỏ
        await addDirectToCart(actionType, productId, fullProduct, {
          color: "default",
          storage: "default",
        });
      }
    } catch (error) {
      console.error("Action error:", error);
      alert(error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  // Hàm tính giá cuối cùng dựa trên variant
  const calculateFinalPrice = (product, variant) => {
    let basePrice = product.price || 0;

    // Áp dụng giảm giá nếu có
    if (product.discount > 0) {
      basePrice = basePrice * (1 - product.discount / 100);
    }

    // Cộng thêm giá variant nếu không phải mặc định
    if (
      Array.isArray(product.variants) &&
      variant.storage &&
      variant.storage !== "default"
    ) {
      const selectedVariant = product.variants.find(
        (v) => `${v.storage}GB` === variant.storage
      );
      if (selectedVariant) {
        basePrice += selectedVariant.price;
      }
    }

    return basePrice;
  };

  // Thêm trực tiếp vào giỏ hàng (không cần modal)
  const addDirectToCart = async (actionType, productId, product, variant) => {
    try {
      const finalPrice = calculateFinalPrice(product, variant);
      const cartData = {
        productId: productId,
        quantity: 1,
        price: finalPrice,
      };

      // Thêm thông tin variant
      if (variant.storage === "default") {
        const defaultRam = product.ram || "4";
        const defaultStorage = product.storage || "128";
        cartData.storage = `${defaultStorage}GB`;
        cartData.ram = `${defaultRam}GB`;
        cartData.variant = {
          ram: `${defaultRam}GB`,
          storage: `${defaultStorage}GB`,
          color: variant.color || "default",
          price: finalPrice,
          isDefault: true,
        };
      } else {
        cartData.storage = variant.storage;
        cartData.ram = variant.ram;
        cartData.variant = {
          ram: variant.ram,
          storage: variant.storage,
          color: variant.color,
          price: finalPrice,
        };
      }

      await addToCart(cartData);
      alert("Đã thêm vào giỏ hàng!");

      // Xử lý theo action type
      if (actionType === "buy_now") {
        navigate("/cart");
      } else if (actionType === "installment") {
        navigate(`/installment/${productId}`);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Có lỗi khi thêm vào giỏ hàng!");
    }
  };

  // Xác nhận action sau khi chọn variant
  const confirmActionWithVariant = async () => {
    const { actionType, productId, product } = variantModalData;

    // Validate: Kiểm tra màu sắc nếu có danh sách màu
    if (availableColors.length > 0 && !selectedVariant.color) {
      alert("Vui lòng chọn màu sắc!");
      return;
    }

    try {
      await addDirectToCart(actionType, productId, product, selectedVariant);
      setShowVariantModal(false);
      setSelectedVariant({
        color: "",
        storage: "default",
        ram: "",
      });
      setVariantModalData(null);
    } catch (error) {
      console.error("Confirm action error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  // ⭐ Handle send message - ĐƠN GIẢN HÓA
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // ⭐ GỌI ENDPOINT DUY NHẤT - Backend tự xử lý mọi thứ
      // Không cần phân loại intent ở FE nữa!
      console.log("📤 Sending message:", {
        message: userInput,
        sessionId: sessionId.current,
      });

      const response = await chatAsk(userInput, sessionId.current);

      console.log("📥 Received response:", {
        sessionId: response.data.sessionId || "Not returned",
        intent: response.data.intent,
        reply: response.data.reply?.substring(0, 50) + "...",
      });

      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          response.data.reply ||
          response.data.message ||
          response.data.answer ||
          "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể diễn đạt lại được không?",
        timestamp: new Date().toISOString(),
        // Optional: hiển thị intent để debug (có thể bỏ trong production)
        intent: response.data.intent,
        // Product data và actions từ backend
        product: response.data.product,
        actions: response.data.actions,
        // ✅ ColorVariants từ chatbot response
        colorVariants: response.data.colorVariants,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Log để debug (có thể bỏ trong production)
      console.log("🔍 Intent detected:", response.data.intent);
      console.log("📦 Response data:", response.data);
    } catch (err) {
      console.error("❌ Chatbot error:", err);

      // Xác định loại lỗi
      let errorText =
        "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.";
      let userErrorMessage = "Có lỗi xảy ra";

      if (err.response) {
        const status = err.response.status;
        if (status === 404) {
          errorText =
            "Tính năng này chưa được kích hoạt. Vui lòng liên hệ quản trị viên.";
          userErrorMessage = "❌ Endpoint không tồn tại (404)";
        } else if (status === 401) {
          errorText = "Vui lòng đăng nhập để sử dụng tính năng này.";
          userErrorMessage = "❌ Chưa đăng nhập (401)";
        } else if (status === 500) {
          errorText = "Hệ thống AI đang bận. Vui lòng thử lại sau.";
          userErrorMessage = "❌ Lỗi server (500)";
        } else {
          errorText = `Lỗi hệ thống (${status}). Vui lòng thử lại.`;
          userErrorMessage = `❌ Lỗi HTTP ${status}`;
        }
      } else if (err.request) {
        errorText =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
        userErrorMessage = "❌ Không kết nối được server";
      }

      console.log("📊 Chi tiết lỗi:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
      });

      setError(userErrorMessage);

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: errorText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format message text with better styling
  const formatMessageText = (text) => {
    if (!text) return null;

    // Split by line breaks
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Check if line is a bullet point
      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        return (
          <div key={index} className="message-list-item">
            <span className="bullet">•</span>
            <span>{line.replace(/^[•\-]\s*/, "")}</span>
          </div>
        );
      }

      // Check if line is a numbered list
      if (/^\d+[\.)]\s/.test(line.trim())) {
        const match = line.match(/^(\d+[\.)]\s)(.*)/);
        return (
          <div key={index} className="message-list-item numbered">
            <span className="number">{match[1]}</span>
            <span>{match[2]}</span>
          </div>
        );
      }

      // Check if line contains price
      if (/\d+[.,]\d+.*(?:đ|vnd|₫)/i.test(line)) {
        return (
          <div key={index} className="message-price">
            {line}
          </div>
        );
      }

      // Check if line is a heading (starts with ##, ###, or all caps)
      if (
        line.trim().startsWith("#") ||
        (line === line.toUpperCase() && line.length > 3 && line.length < 50)
      ) {
        return (
          <div key={index} className="message-heading">
            {line.replace(/^#+\s*/, "")}
          </div>
        );
      }

      // Regular paragraph
      if (line.trim()) {
        return (
          <p key={index} className="message-paragraph">
            {line}
          </p>
        );
      }

      // Empty line
      return <br key={index} />;
    });
  };

  return (
    <div className="ai-chatbot-container">
      {/* Chatbot toggle button */}
      <button
        className={`chatbot-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-comments"></i>
        )}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h4>AI PhoneStore</h4>
                <span className="chatbot-status">
                  <span className="status-dot"></span> Đang hoạt động
                </span>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>

          {/* Messages area */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="message-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.sender === "bot" ? (
                      <div className="formatted-message">
                        {formatMessageText(message.text)}

                        {/* Product Card */}
                        {message.product && (
                          <div className="chat-product-card">
                            <img
                              src={
                                message.product.image ||
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"
                              }
                              alt={message.product.name}
                              onError={(e) => {
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                            <div className="chat-product-info">
                              <h4>{message.product.name}</h4>
                              <p className="chat-product-price">
                                {message.product.price?.toLocaleString()} đ
                              </p>
                              {message.product.stock !== undefined && (
                                <p className="chat-product-stock">
                                  Còn {message.product.stock} sản phẩm
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {message.actions &&
                          message.actions.length > 0 &&
                          message.product?._id && (
                            <div className="chat-action-buttons">
                              {message.actions.map((action, idx) => (
                                <button
                                  key={idx}
                                  className={`chat-action-btn ${action.type}`}
                                  style={
                                    action.color
                                      ? {
                                          background: action.color,
                                          color: "#fff",
                                        }
                                      : {}
                                  }
                                  onClick={() =>
                                    handleAction(
                                      action.type,
                                      message.product._id,
                                      message // ✅ Truyền message object
                                    )
                                  }
                                  disabled={!message.product._id}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                {message.sender === "user" && (
                  <div className="message-avatar user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-content">
                  <div className="message-bubble loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="chatbot-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="chatbot-input-area">
            <textarea
              className="chatbot-input"
              placeholder="Nhập câu hỏi của bạn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              className="chatbot-send-btn"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            <small>Powered by OpenAI</small>
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {showVariantModal && variantModalData && (
        <div
          className="variant-modal-overlay"
          onClick={() => setShowVariantModal(false)}
        >
          <div
            className="variant-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Chọn phiên bản sản phẩm</h3>
            <p className="product-name">{variantModalData.product?.name}</p>

            {/* Hiển thị giá */}
            <div className="variant-price-display">
              <span className="price-label">Giá:</span>
              <span className="price-value">
                {calculateFinalPrice(
                  variantModalData.product,
                  selectedVariant
                ).toLocaleString("vi-VN")}
                ₫
              </span>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="variant-section">
                <h4>
                  Màu sắc:{" "}
                  {!selectedVariant.color && (
                    <span className="field-required">*</span>
                  )}
                </h4>
                <div className="variant-options">
                  {variantModalData?.colorVariants &&
                  variantModalData.colorVariants.length > 0
                    ? // Hiển thị với thông tin đầy đủ từ colorVariants
                      variantModalData.colorVariants.map((variant) => (
                        <button
                          key={variant._id || variant.color}
                          className={`variant-option color-variant-option ${
                            selectedVariant.color === variant.color
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedVariant({
                              ...selectedVariant,
                              color: variant.color,
                            })
                          }
                          disabled={variant.stock === 0}
                        >
                          <div className="color-option-content">
                            {variant.colorCode && (
                              <span
                                className="color-preview"
                                style={{ backgroundColor: variant.colorCode }}
                              />
                            )}
                            <span className="color-name">{variant.color}</span>
                          </div>
                          {variant.stock !== undefined && (
                            <span
                              className={`stock-info ${
                                variant.stock === 0
                                  ? "out-of-stock"
                                  : variant.stock < 5
                                  ? "low-stock"
                                  : ""
                              }`}
                            >
                              {variant.stock === 0
                                ? "Hết hàng"
                                : `Còn ${variant.stock}`}
                            </span>
                          )}
                        </button>
                      ))
                    : // Fallback: Hiển thị đơn giản nếu không có colorVariants
                      availableColors.map((color) => (
                        <button
                          key={color}
                          className={`variant-option ${
                            selectedVariant.color === color ? "selected" : ""
                          }`}
                          onClick={() =>
                            setSelectedVariant({ ...selectedVariant, color })
                          }
                        >
                          {color}
                        </button>
                      ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {variantModalData.product?.variants &&
              variantModalData.product.variants.length > 0 && (
                <div className="variant-section">
                  <h4>Bộ nhớ:</h4>
                  <div className="variant-options variant-storage-grid">
                    {/* Option mặc định */}
                    <button
                      className={`variant-option variant-storage ${
                        selectedVariant.storage === "default" ? "selected" : ""
                      }`}
                      onClick={() =>
                        setSelectedVariant({
                          ...selectedVariant,
                          storage: "default",
                          ram: "",
                        })
                      }
                    >
                      <span className="storage-size">Mặc định</span>
                      <span className="storage-spec">
                        {variantModalData.product.ram || "4"}GB /{" "}
                        {variantModalData.product.storage || "128"}GB
                      </span>
                    </button>

                    {/* Các option variant */}
                    {variantModalData.product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        className={`variant-option variant-storage ${
                          selectedVariant.storage === `${variant.storage}GB`
                            ? "selected"
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
                        <span className="storage-size">
                          {variant.ram}GB / {variant.storage}GB
                        </span>
                        {variant.price > 0 && (
                          <span className="storage-price">
                            +{variant.price.toLocaleString()}₫
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="variant-modal-actions">
              <button
                className="variant-btn variant-btn-cancel"
                onClick={() => {
                  setShowVariantModal(false);
                  setSelectedVariant({
                    color: "",
                    storage: "default",
                    ram: "",
                  });
                  setVariantModalData(null);
                }}
              >
                Hủy
              </button>
              <button
                className="variant-btn variant-btn-confirm"
                onClick={() => confirmActionWithVariant()}
                disabled={availableColors.length > 0 && !selectedVariant.color}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
