import React, { useState, useRef, useCallback, useEffect } from "react";
import { searchProducts } from "../../../services/Api";
import { getImageProduct } from "../../utils";
import { useNavigate } from "react-router-dom";
import { GEMINI_API_KEY, GEMINI_API_URL } from "../../constants/app";
import "./SmartChatbot.css";

const SmartChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      text: "👋 Xin chào! Tôi là AI Assistant thông minh của PhoneStore. Tôi có thể:\n\n🔍 Tìm kiếm sản phẩm điện thoại\n❓ Trả lời câu hỏi về giá, bảo hành, giao hàng\n🤖 Hỗ trợ tư vấn bằng AI thông minh\n📱 Giúp bạn chọn điện thoại phù hợp\n\nBạn cần hỗ trợ gì?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // E-commerce FAQ Knowledge Base cho điện thoại
  const faqDatabase = {
    // Sản phẩm và giá cả
    price: {
      keywords: ["giá", "bao nhiêu", "cost", "price", "tiền"],
      responses: [
        "Để kiểm tra giá sản phẩm, bạn có thể:\n• Tìm kiếm sản phẩm trên trang chủ\n• Xem chi tiết sản phẩm\n• Hoặc cho tôi biết tên điện thoại bạn quan tâm để tôi tìm giúp!",
      ],
    },

    // Bảo hành
    warranty: {
      keywords: ["bảo hành", "warranty", "bảo dưỡng", "sửa chữa"],
      responses: [
        "🛡️ Chính sách bảo hành PhoneStore:\n• Tất cả sản phẩm có bảo hành 12 tháng\n• Bảo hành 1 đổi 1 trong 30 ngày đầu\n• Hỗ trợ sửa chữa miễn phí theo quy định\n• Trung tâm bảo hành ủy quyền toàn quốc",
      ],
    },

    // Giao hàng
    shipping: {
      keywords: ["giao hàng", "ship", "delivery", "vận chuyển", "nhận hàng"],
      responses: [
        "🚚 Thông tin giao hàng:\n• Miễn phí ship đơn từ 500.000đ\n• Giao hàng toàn quốc\n• Thời gian: 1-3 ngày với nội thành\n• COD và thanh toán online\n• Kiểm tra hàng trước khi thanh toán",
      ],
    },

    // Khuyến mãi
    promotion: {
      keywords: ["khuyến mãi", "giảm giá", "sale", "promotion", "ưu đãi"],
      responses: [
        "🎉 Ưu đãi hiện tại:\n• Giảm 10% đơn đầu tiên\n• Tặng phụ kiện khi mua iPhone\n• Trả góp 0% lãi suất\n• Đổi cũ lấy mới giá cao\n\nKiểm tra trang khuyến mãi để cập nhật mới nhất!",
      ],
    },

    // Thanh toán
    payment: {
      keywords: ["thanh toán", "payment", "trả góp", "installment", "credit"],
      responses: [
        "💳 Hình thức thanh toán:\n• Tiền mặt khi nhận hàng (COD)\n• Chuyển khoản ngân hàng\n• Ví điện tử (Momo, ZaloPay)\n• Thẻ tín dụng\n• Trả góp 0% qua thẻ tín dụng",
      ],
    },

    // Sản phẩm phổ biến
    products: {
      keywords: [
        "iphone",
        "samsung",
        "xiaomi",
        "oppo",
        "vivo",
        "phone",
        "điện thoại",
      ],
      responses: [
        '📱 Tôi có thể giúp bạn tìm điện thoại phù hợp!\n\nHãy cho tôi biết:\n• Hãng nào bạn thích?\n• Mức giá mong muốn?\n• Mục đích sử dụng?\n\nVí dụ: "Tìm iPhone dưới 20 triệu" hoặc "Samsung chơi game tốt"',
      ],
    },
  };

  // Scroll to bottom when new message added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add message to conversation
  const addMessage = useCallback((message) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Handle FAQ responses
  const findFAQResponse = useCallback((userMessage) => {
    const message = userMessage.toLowerCase();

    for (const [category, data] of Object.entries(faqDatabase)) {
      if (data.keywords.some((keyword) => message.includes(keyword))) {
        return data.responses[
          Math.floor(Math.random() * data.responses.length)
        ];
      }
    }

    return null;
  }, []);

  // Search products functionality
  const searchProductsInChat = useCallback(async (query) => {
    try {
      const response = await searchProducts({
        keyword: query,
        page: 1,
        limit: 3,
      });

      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        const products = response.data.data.slice(0, 3);
        return {
          type: "products",
          products: products,
          message: `🔍 Tìm thấy ${products.length} sản phẩm phù hợp:`,
        };
      } else {
        return {
          type: "text",
          message:
            "😅 Không tìm thấy sản phẩm nào phù hợp. Bạn có thể thử từ khóa khác hoặc duyệt danh mục sản phẩm.",
        };
      }
    } catch (error) {
      console.error("Search error:", error);
      return {
        type: "text",
        message: "❌ Có lỗi khi tìm kiếm. Vui lòng thử lại sau.",
      };
    }
  }, []);

  // Gemini AI Integration
  const callGeminiAPI = useCallback(async (userMessage) => {
    try {
      if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        return {
          type: "text",
          message:
            "🤖 AI Assistant chưa được cấu hình. Vui lòng liên hệ admin để bật tính năng AI thông minh.",
        };
      }

      const prompt = `Bạn là trợ lý AI của PhoneStore - cửa hàng điện thoại di động. 
      Hãy trả lời câu hỏi sau một cách thân thiện, chuyên nghiệp và hữu ích.
      Nếu câu hỏi không liên quan đến điện thoại, hãy từ chối một cách lịch sự và gợi ý về sản phẩm điện thoại.
      
      Câu hỏi của khách hàng: "${userMessage}"`;

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        return {
          type: "text",
          message: `🤖 AI Assistant: ${aiResponse}`,
        };
      } else {
        throw new Error("Invalid Gemini response format");
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        type: "text",
        message:
          "😅 Xin lỗi, tôi gặp chút vấn đề kỹ thuật. Bạn có thể thử hỏi lại hoặc liên hệ hỗ trợ khách hàng.",
      };
    }
  }, []);

  // Process user message and generate response
  const processMessage = useCallback(
    async (userMessage) => {
      setIsTyping(true);

      // Simulate thinking time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        // Check if it's a product search
        const searchKeywords = [
          "tìm",
          "search",
          "iphone",
          "samsung",
          "xiaomi",
          "oppo",
          "vivo",
        ];
        if (
          searchKeywords.some((keyword) =>
            userMessage.toLowerCase().includes(keyword)
          )
        ) {
          const searchResult = await searchProductsInChat(userMessage);

          if (searchResult.type === "products") {
            addMessage({
              text: searchResult.message,
              sender: "bot",
              type: "products",
              products: searchResult.products,
            });
          } else {
            addMessage({
              text: searchResult.message,
              sender: "bot",
            });
          }
          return;
        }

        // Check FAQ database
        const faqResponse = findFAQResponse(userMessage);
        if (faqResponse) {
          addMessage({
            text: faqResponse,
            sender: "bot",
          });
          return;
        }

        // If no FAQ match, try Gemini AI for intelligent response
        setIsAIThinking(true);
        const geminiResponse = await callGeminiAPI(userMessage);
        setIsAIThinking(false);
        addMessage({
          text: geminiResponse.message,
          sender: "bot",
        });
      } catch (error) {
        console.error("Process message error:", error);
        addMessage({
          text: "😔 Xin lỗi, tôi gặp chút vấn đề. Vui lòng thử lại sau hoặc liên hệ hotline 1900-1234 để được hỗ trợ trực tiếp.",
          sender: "bot",
        });
      } finally {
        setIsTyping(false);
        setIsAIThinking(false);
      }
    },
    [addMessage, findFAQResponse, searchProductsInChat, callGeminiAPI]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!inputText.trim() || isTyping) return;

      const userMessage = inputText.trim();
      setInputText("");

      // Add user message
      addMessage({
        text: userMessage,
        sender: "user",
      });

      // Process and respond
      await processMessage(userMessage);
    },
    [inputText, isTyping, addMessage, processMessage]
  );

  // Handle product view
  const handleViewProduct = useCallback(
    (productId) => {
      navigate(`/product/${productId}`);
      setIsOpen(false);
    },
    [navigate]
  );

  // Format price
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  // Toggle chat
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="smart-chatbot">
      {/* Chat Interface */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar">🤖</div>
              <div className="bot-details">
                <h4>PhoneStore Assistant</h4>
                <span className="status">● Online</span>
              </div>
            </div>
            <button
              className="close-btn"
              onClick={toggleChat}
              aria-label="Đóng chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>

                  {/* Product Results */}
                  {message.type === "products" && message.products && (
                    <div className="product-results">
                      {message.products.map((product) => (
                        <div key={product._id} className="product-card">
                          <img
                            src={getImageProduct(product.hinhAnh)}
                            alt={product.tenSanPham}
                            className="product-image"
                          />
                          <div className="product-info">
                            <h5 className="product-name">
                              {product.tenSanPham}
                            </h5>
                            <p className="product-price">
                              {formatPrice(product.gia)}
                            </p>
                            <button
                              className="view-product-btn"
                              onClick={() => handleViewProduct(product._id)}
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  {isAIThinking ? (
                    <div className="ai-thinking">
                      🤖 AI đang suy nghĩ...
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  ) : (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isTyping}
              className="input-field"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="send-btn"
              aria-label="Gửi tin nhắn"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        {isOpen ? "✕" : "💬"}
        {!isOpen && <span className="notification-badge">AI</span>}
      </button>
    </div>
  );
};

export default SmartChatbot;
