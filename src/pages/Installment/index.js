import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  calculateInstallment,
  getProductById,
  createOrder,
  uploadImages,
} from "../../services/Api";
import { getImageProduct } from "../../shared/utils";

const INSTALLMENT_TYPES = [
  { value: "creditCard", label: "Thẻ tín dụng", icon: "💳" },
  { value: "financeCompany", label: "Công ty tài chính", icon: "🏦" },
];

const MONTH_OPTIONS = [3, 6, 9, 12, 18, 24];

// Lãi suất theo số tháng trả góp (công ty tài chính) - tính theo %/tháng
const INTEREST_RATES = {
  3: 1.5, // 3 tháng: 1.5%/tháng
  6: 1.67, // 6 tháng: 1.67%/tháng (20%/năm)
  9: 1.83, // 9 tháng: 1.83%/tháng (22%/năm)
  12: 2, // 12 tháng: 2%/tháng (24%/năm)
  18: 2.17, // 18 tháng: 2.17%/tháng (26%/năm)
  24: 2.33, // 24 tháng: 2.33%/tháng (28%/năm)
};

function InstallmentPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [type, setType] = useState("creditCard");
  const [upfront, setUpfront] = useState(0);
  const [months, setMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(INTEREST_RATES[12]); // Lãi suất tự động theo số tháng

  // Cập nhật lãi suất khi thay đổi số tháng
  useEffect(() => {
    if (type === "financeCompany") {
      setInterestRate(INTEREST_RATES[months] || 2);
    }
  }, [months, type]);

  // Credit card info
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    bank: "",
    address: "",
    phone: "",
  });

  // Finance company info
  const [financeInfo, setFinanceInfo] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",
    monthlyIncome: "",
    relativePhone1: "",
    relativePhone2: "",
  });

  // Upload files for finance company
  const [uploadedFiles, setUploadedFiles] = useState({
    idCardFront: null,
    idCardBack: null,
    householdBook: null,
    incomeProof: null,
  });

  // URLs của ảnh đã upload lên server
  const [uploadedUrls, setUploadedUrls] = useState({
    idCardFront: "",
    idCardBack: "",
    householdBook: "",
    incomeProof: "",
  });

  const [transactionId, setTransactionId] = useState("");
  const [result, setResult] = useState(null);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(productId);
        setProduct(res.data.data);

        // Lấy thông tin variant từ location state
        if (location.state?.variant) {
          setSelectedVariant(location.state.variant);
          setSelectedPrice(location.state.price || res.data.data.price);
        } else {
          setSelectedPrice(res.data.data.price);
        }

        setUpfront(0);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, location.state]);

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    setUploadedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    try {
      // Upload file lên server ngay
      const res = await uploadImages([file]);

      // Backend trả về: { data: ['/uploads/xxx.jpg'] }
      if (res.data && res.data.data && res.data.data.length > 0) {
        // Lưu URL vào state
        const uploadedUrl = res.data.data[0];
        setUploadedUrls((prev) => ({
          ...prev,
          [field]: uploadedUrl,
        }));
        alert(`Upload ${field} thành công!`);
      } else {
        alert(`Lỗi: Server không trả về URL cho ${field}`);
      }
    } catch (err) {
      alert(`Lỗi upload ${field}: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleCalculate = async () => {
    // Validate form
    if (type === "creditCard") {
      if (
        !cardInfo.cardNumber ||
        !cardInfo.cardHolder ||
        !cardInfo.expiryDate ||
        !cardInfo.cvv ||
        !cardInfo.bank ||
        !cardInfo.address ||
        !cardInfo.phone
      ) {
        setError("Vui lòng điền đầy đủ thông tin thẻ tín dụng");
        return;
      }
      // Hiển thị popup xác nhận cho thẻ tín dụng
      setShowConfirmModal(true);
    } else {
      if (
        !financeInfo.fullName ||
        !financeInfo.idNumber ||
        !financeInfo.phone ||
        !financeInfo.email ||
        !financeInfo.address
      ) {
        setError("Vui lòng điền đầy đủ thông tin cá nhân");
        return;
      }
      // Kiểm tra upload file
      if (
        !uploadedFiles.idCardFront ||
        !uploadedFiles.idCardBack ||
        !uploadedFiles.incomeProof
      ) {
        setError(
          "Vui lòng upload đầy đủ giấy tờ: CMND/CCCD (2 mặt) và giấy tờ chứng minh thu nhập"
        );
        return;
      }
      // Hiển thị popup thông báo cho công ty tài chính
      setShowFinanceModal(true);
    }
  };

  const handleConfirmCalculate = async () => {
    setCalculating(true);
    setError("");
    try {
      const res = await calculateInstallment({
        productId,
        upfront,
        months,
        interestRate,
        type,
        ...(type === "creditCard" ? { cardInfo } : { financeInfo }),
      });
      setResult(res.data);

      // Nếu là thẻ tín dụng, hiển thị modal thanh toán để nhận transactionId
      if (type === "creditCard" && res.data.success) {
        setShowPaymentModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi tính trả góp");
      setResult(null);
    }
    setCalculating(false);
  };

  const handleSimulatePayment = () => {
    // Mô phỏng thanh toán thẻ tín dụng và nhận transactionId
    const mockTransactionId = `TXN${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;
    setTransactionId(mockTransactionId);
    setShowPaymentModal(false);
  };

  const handleConfirmOrder = async () => {
    if (!result || !result.success) return;

    // Kiểm tra transactionId cho thẻ tín dụng
    if (type === "creditCard" && !transactionId) {
      setError("Vui lòng hoàn tất thanh toán trước khi xác nhận đơn hàng");
      return;
    }

    setCalculating(true);
    setError("");
    try {
      // Lấy thông tin địa chỉ và phone từ user hoặc từ form
      const address =
        financeInfo.address || cardInfo.address || "Địa chỉ mặc định";
      const phone = financeInfo.phone || cardInfo.phone || "0000000000";

      // Chuẩn bị thông tin đơn hàng
      const orderData = {
        items: [
          {
            productId: productId,
            quantity: 1,
            price: selectedPrice,
            variant: selectedVariant || {},
          },
        ],
        address,
        phone,
        note: `Đơn hàng trả góp - ${
          type === "creditCard" ? "Thẻ tín dụng" : "Công ty tài chính"
        }`,
        paymentMethod: type === "creditCard" ? "creditCard" : "installment",
        total: result.totalPayment,
        installment: {
          isInstallment: true,
          type: type,
          upfront: upfront,
          months: months,
          interestRate: interestRate,
          monthlyPayment: result.monthlyPayment,
          totalPayment: result.totalPayment,
          transactionId: type === "creditCard" ? transactionId : "",
          financeStatus: "pending",
          customerInfo: type === "creditCard" ? cardInfo : financeInfo,
          // Thêm thông tin file upload cho công ty tài chính (gửi URLs đã upload)
          uploadedDocuments:
            type === "financeCompany"
              ? {
                  idCardFront: uploadedUrls.idCardFront || "",
                  idCardBack: uploadedUrls.idCardBack || "",
                  householdBook: uploadedUrls.householdBook || "",
                  incomeProof: uploadedUrls.incomeProof || "",
                }
              : null,
        },
      };

      const res = await createOrder(orderData);

      if (res.data) {
        // Chuyển hướng đến trang đơn hàng
        navigate("/OrderList", {
          state: {
            fromInstallment: true,
            message: "Đơn hàng trả góp của bạn đã được tạo thành công!",
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi tạo đơn hàng");
    }
    setCalculating(false);
  };

  if (loading) {
    return <div className="installment-loading">Đang tải...</div>;
  }

  if (!product) {
    return <div className="installment-error">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="installment-container">
      <div className="installment-wrapper">
        {/* Product Info Section */}
        <div className="installment-product-section">
          <h2 className="installment-title">Trả góp sản phẩm</h2>
          <div className="installment-product-card">
            <img
              src={getImageProduct(product.images?.[0])}
              alt={product.name}
              className="installment-product-image"
            />
            <div className="installment-product-info">
              <h3>{product.name}</h3>

              {/* Hiển thị thông tin variant đã chọn */}
              {selectedVariant && (
                <div className="installment-variant-info">
                  {selectedVariant.color && (
                    <div className="variant-item">
                      <span className="variant-label">Màu sắc:</span>
                      <span className="variant-value">
                        {selectedVariant.color}
                      </span>
                    </div>
                  )}
                  {selectedVariant.storage && (
                    <div className="variant-item">
                      <span className="variant-label">Bộ nhớ:</span>
                      <span className="variant-value">
                        {selectedVariant.ram && `${selectedVariant.ram} / `}
                        {selectedVariant.storage}
                      </span>
                    </div>
                  )}
                  {selectedVariant.condition && (
                    <div className="variant-item">
                      <span className="variant-label">Tình trạng:</span>
                      <span className="variant-value">
                        {selectedVariant.condition}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="installment-product-price">
                <span className="price-label">Giá sản phẩm:</span>
                <span className="price-value">
                  {selectedPrice?.toLocaleString("vi-VN")}₫
                </span>
              </div>
              {product.discount > 0 && (
                <div className="installment-product-discount">
                  Giảm {product.discount}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Installment Form Section */}
        <div className="installment-form-section">
          {/* Type Selection */}
          <div className="installment-type-selection">
            <label className="section-label">Chọn hình thức trả góp</label>
            <div className="installment-type-group">
              {INSTALLMENT_TYPES.map((t) => (
                <div
                  key={t.value}
                  className={`installment-type-card ${
                    type === t.value ? "active" : ""
                  }`}
                  onClick={() => setType(t.value)}
                >
                  <span className="type-icon">{t.icon}</span>
                  <span className="type-label">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Plan */}
          <div className="installment-payment-plan">
            <label className="section-label">Kế hoạch thanh toán</label>
            <div className="form-group">
              <label>Trả trước (VNĐ)</label>
              <input
                type="number"
                className="form-control"
                value={upfront}
                onChange={(e) => setUpfront(Number(e.target.value))}
                min={0}
                max={selectedPrice}
                placeholder="Nhập số tiền trả trước"
              />
              <small className="form-hint">
                Còn lại:{" "}
                {((selectedPrice || 0) - upfront).toLocaleString("vi-VN")}₫
              </small>
            </div>

            <div className="form-group">
              <label>Số tháng trả góp</label>
              <div className="month-options">
                {MONTH_OPTIONS.map((m) => (
                  <button
                    key={m}
                    className={`month-btn ${months === m ? "active" : ""}`}
                    onClick={() => setMonths(m)}
                  >
                    {m} tháng
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Credit Card Form */}
          {type === "creditCard" && (
            <div className="installment-details-form">
              <label className="section-label">Thông tin thẻ tín dụng</label>
              <div className="form-group">
                <label>Ngân hàng phát hành</label>
                <select
                  className="form-control"
                  value={cardInfo.bank}
                  onChange={(e) =>
                    setCardInfo({ ...cardInfo, bank: e.target.value })
                  }
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="BIDV">BIDV</option>
                  <option value="VietinBank">VietinBank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="ACB">ACB</option>
                  <option value="MB">MB</option>
                  <option value="Sacombank">Sacombank</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số thẻ</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardInfo.cardNumber}
                  onChange={(e) =>
                    setCardInfo({ ...cardInfo, cardNumber: e.target.value })
                  }
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>
              <div className="form-group">
                <label>Tên chủ thẻ</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardInfo.cardHolder}
                  onChange={(e) =>
                    setCardInfo({
                      ...cardInfo,
                      cardHolder: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="NGUYEN VAN A"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày hết hạn</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardInfo.expiryDate}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, expiryDate: e.target.value })
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardInfo.cvv}
                    onChange={(e) =>
                      setCardInfo({ ...cardInfo, cvv: e.target.value })
                    }
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardInfo.address}
                  onChange={(e) =>
                    setCardInfo({ ...cardInfo, address: e.target.value })
                  }
                  placeholder="Nhập địa chỉ nhận hàng"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  value={cardInfo.phone}
                  onChange={(e) =>
                    setCardInfo({ ...cardInfo, phone: e.target.value })
                  }
                  placeholder="0912345678"
                />
              </div>
            </div>
          )}

          {/* Finance Company Form */}
          {type === "financeCompany" && (
            <div className="installment-details-form">
              <label className="section-label">Thông tin cá nhân</label>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={financeInfo.fullName}
                  onChange={(e) =>
                    setFinanceInfo({ ...financeInfo, fullName: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="form-group">
                <label>CMND/CCCD</label>
                <input
                  type="text"
                  className="form-control"
                  value={financeInfo.idNumber}
                  onChange={(e) =>
                    setFinanceInfo({ ...financeInfo, idNumber: e.target.value })
                  }
                  placeholder="001234567890"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={financeInfo.phone}
                    onChange={(e) =>
                      setFinanceInfo({ ...financeInfo, phone: e.target.value })
                    }
                    placeholder="0987654321"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={financeInfo.email}
                    onChange={(e) =>
                      setFinanceInfo({ ...financeInfo, email: e.target.value })
                    }
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  value={financeInfo.address}
                  onChange={(e) =>
                    setFinanceInfo({ ...financeInfo, address: e.target.value })
                  }
                  placeholder="Số nhà, đường, phường, quận, thành phố"
                />
              </div>
              <div className="form-group">
                <label>Thu nhập hàng tháng (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  value={financeInfo.monthlyIncome}
                  onChange={(e) =>
                    setFinanceInfo({
                      ...financeInfo,
                      monthlyIncome: e.target.value,
                    })
                  }
                  placeholder="10000000"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SĐT người thân 1</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={financeInfo.relativePhone1}
                    onChange={(e) =>
                      setFinanceInfo({
                        ...financeInfo,
                        relativePhone1: e.target.value,
                      })
                    }
                    placeholder="0987654321"
                  />
                </div>
                <div className="form-group">
                  <label>SĐT người thân 2</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={financeInfo.relativePhone2}
                    onChange={(e) =>
                      setFinanceInfo({
                        ...financeInfo,
                        relativePhone2: e.target.value,
                      })
                    }
                    placeholder="0987654321"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Lãi suất (%/tháng)</label>
                <input
                  type="number"
                  className="form-control"
                  value={interestRate}
                  disabled
                  readOnly
                  step="0.01"
                />
                <small className="form-hint">
                  Lãi suất {interestRate}%/tháng áp dụng cho kỳ hạn {months}{" "}
                  tháng (tương đương {(interestRate * 12).toFixed(2)}%/năm)
                </small>
              </div>

              {/* File Upload Section */}
              <label className="section-label">Upload giấy tờ cần thiết</label>
              <div className="upload-section">
                <div className="upload-item">
                  <label htmlFor="idCardFront">
                    CMND/CCCD (Mặt trước) <span className="required">*</span>
                  </label>
                  <input
                    id="idCardFront"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("idCardFront", e.target.files[0])
                    }
                  />
                  {uploadedFiles.idCardFront && (
                    <span className="file-name">
                      ✓ {uploadedFiles.idCardFront.name}
                    </span>
                  )}
                </div>
                <div className="upload-item">
                  <label htmlFor="idCardBack">
                    CMND/CCCD (Mặt sau) <span className="required">*</span>
                  </label>
                  <input
                    id="idCardBack"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("idCardBack", e.target.files[0])
                    }
                  />
                  {uploadedFiles.idCardBack && (
                    <span className="file-name">
                      ✓ {uploadedFiles.idCardBack.name}
                    </span>
                  )}
                </div>
                <div className="upload-item">
                  <label htmlFor="householdBook">Sổ hộ khẩu (Tùy chọn)</label>
                  <input
                    id="householdBook"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload("householdBook", e.target.files[0])
                    }
                  />
                  {uploadedFiles.householdBook && (
                    <span className="file-name">
                      ✓ {uploadedFiles.householdBook.name}
                    </span>
                  )}
                </div>
                <div className="upload-item">
                  <label htmlFor="incomeProof">
                    Giấy tờ chứng minh thu nhập{" "}
                    <span className="required">*</span>
                  </label>
                  <input
                    id="incomeProof"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      handleFileUpload("incomeProof", e.target.files[0])
                    }
                  />
                  {uploadedFiles.incomeProof && (
                    <span className="file-name">
                      ✓ {uploadedFiles.incomeProof.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="installment-error-msg">{error}</div>}

          {/* Calculate Button */}
          <button
            className="installment-calculate-btn"
            onClick={handleCalculate}
            disabled={calculating}
          >
            {calculating ? "Đang tính toán..." : "Tính trả góp"}
          </button>
        </div>

        {/* Modal xác nhận cho thẻ tín dụng */}
        {showConfirmModal && (
          <div
            className="modal-overlay"
            onClick={() =>
              !calculating && !result && setShowConfirmModal(false)
            }
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{result ? "Kết quả trả góp" : "Xác nhận thông tin"}</h3>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setResult(null);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                {!result ? (
                  <>
                    <p className="modal-description">
                      Vui lòng kiểm tra lại thông tin trước khi hoàn tất:
                    </p>
                    <div className="confirm-info">
                      <div className="info-row">
                        <span className="info-label">Chủ thẻ:</span>
                        <span className="info-value">
                          {cardInfo.cardHolder}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Số thẻ:</span>
                        <span className="info-value">
                          **** **** **** {cardInfo.cardNumber.slice(-4)}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Ngân hàng:</span>
                        <span className="info-value">{cardInfo.bank}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Số tiền trả trước:</span>
                        <span className="info-value">
                          {upfront.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Số tháng trả góp:</span>
                        <span className="info-value">{months} tháng</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {result.success ? (
                      <div className="result-content">
                        <div className="result-summary">
                          <div className="summary-item">
                            <span className="summary-label">Trả trước</span>
                            <span className="summary-value">
                              {result.upfront?.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <div className="summary-item highlight">
                            <span className="summary-label">
                              Trả hàng tháng
                            </span>
                            <span className="summary-value large">
                              {result.monthlyPayment?.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Tổng phải trả</span>
                            <span className="summary-value">
                              {result.totalPayment?.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Số tháng</span>
                            <span className="summary-value">
                              {result.months} tháng
                            </span>
                          </div>
                        </div>

                        <div className="result-detail">
                          <p>{result.detail}</p>
                        </div>

                        {result.extraInfo && (
                          <div className="result-extra-info">
                            <div className="extra-info-item">
                              <strong>📋 Yêu cầu:</strong>{" "}
                              {result.extraInfo.required}
                            </div>
                            <div className="extra-info-item">
                              <strong>⚠️ Lưu ý:</strong> {result.extraInfo.note}
                            </div>
                          </div>
                        )}

                        {transactionId && (
                          <div className="transaction-info">
                            <div className="extra-info-item">
                              <strong>✓ Mã giao dịch:</strong> {transactionId}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="error-message">{error}</div>
                    )}
                  </>
                )}

                {calculating && (
                  <div className="calculating-indicator">
                    <div className="spinner"></div>
                    <p>Đang tính toán...</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!result ? (
                  <>
                    <button
                      className="btn-cancel"
                      onClick={() => setShowConfirmModal(false)}
                      disabled={calculating}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn-confirm"
                      onClick={handleConfirmCalculate}
                      disabled={calculating}
                    >
                      {calculating ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setShowConfirmModal(false);
                        setResult(null);
                      }}
                      disabled={calculating}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleConfirmOrder}
                      disabled={
                        calculating || (type === "creditCard" && !transactionId)
                      }
                    >
                      {calculating ? "Đang xử lý..." : "Xác nhận đơn hàng"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal thanh toán thẻ tín dụng */}
        {showPaymentModal && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Xác thực thanh toán</h3>
              </div>
              <div className="modal-body">
                <div className="payment-simulation">
                  <div className="payment-icon">💳</div>
                  <p className="payment-text">
                    Đang kết nối với cổng thanh toán...
                  </p>
                  <p className="payment-subtext">
                    Trong thực tế, đây sẽ là trang thanh toán của ngân hàng/cổng
                    thanh toán.
                  </p>
                  <p className="payment-subtext">
                    Hiện tại chúng tôi đang mô phỏng quá trình này.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-confirm full-width"
                  onClick={handleSimulatePayment}
                >
                  Mô phỏng thanh toán thành công
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal thông báo cho công ty tài chính */}
        {showFinanceModal && (
          <div
            className="modal-overlay"
            onClick={() =>
              !calculating && !result && setShowFinanceModal(false)
            }
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{result ? "Kết quả trả góp" : "Thông báo xác thực"}</h3>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowFinanceModal(false);
                    setResult(null);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                {!result ? (
                  <div className="finance-notice">
                    <div className="notice-icon">📞</div>
                    <p className="notice-text">
                      Bạn sẽ nhận được cuộc gọi từ công ty tài chính trong vòng
                      24 giờ để xác thực thông tin.
                    </p>
                    <p className="notice-subtext">
                      Vui lòng giữ máy và chuẩn bị sẵn các giấy tờ cần thiết:
                    </p>
                    <ul className="notice-list">
                      <li>Chứng minh nhân dân/Căn cước công dân</li>
                      <li>Sổ hộ khẩu (nếu có)</li>
                      <li>Giấy tờ chứng minh thu nhập</li>
                    </ul>
                  </div>
                ) : (
                  <>
                    {result.success ? (
                      <div className="result-content">
                        <div className="result-summary">
                          <div className="summary-item">
                            <span className="summary-label">Trả trước</span>
                            <span className="summary-value">
                              {result.upfront?.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <div className="summary-item highlight">
                            <span className="summary-label">
                              Trả hàng tháng
                            </span>
                            <span className="summary-value large">
                              {result.monthlyPayment?.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Tổng phải trả</span>
                            <span className="summary-value">
                              {result.totalPayment?.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <div className="summary-item">
                            <span className="summary-label">Số tháng</span>
                            <span className="summary-value">
                              {result.months} tháng
                            </span>
                          </div>
                        </div>

                        <div className="result-detail">
                          <p>{result.detail}</p>
                        </div>

                        {result.extraInfo && (
                          <div className="result-extra-info">
                            <div className="extra-info-item">
                              <strong>📋 Yêu cầu:</strong>{" "}
                              {result.extraInfo.required}
                            </div>
                            <div className="extra-info-item">
                              <strong>⚠️ Lưu ý:</strong> {result.extraInfo.note}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="error-message">{error}</div>
                    )}
                  </>
                )}

                {calculating && (
                  <div className="calculating-indicator">
                    <div className="spinner"></div>
                    <p>Đang tính toán...</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!result ? (
                  <button
                    className="btn-confirm full-width"
                    onClick={handleConfirmCalculate}
                    disabled={calculating}
                  >
                    {calculating ? "Đang xử lý..." : "Đã hiểu"}
                  </button>
                ) : (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setShowFinanceModal(false);
                        setResult(null);
                      }}
                      disabled={calculating}
                    >
                      Hủy
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleConfirmOrder}
                      disabled={calculating}
                    >
                      {calculating ? "Đang xử lý..." : "Xác nhận đơn hàng"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstallmentPage;
