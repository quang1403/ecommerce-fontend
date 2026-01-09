import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getImageProduct } from "../../shared/utils";
import { setCart } from "../../redux-setup/reducers/cart";
import {
  getCartByToken,
  updateCartItem,
  removeItemFromCart,
} from "../../services/Api";

const ModernCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const login = useSelector(({ auth }) => auth.login);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});

  // Fetch cart khi user đã login
  useEffect(() => {
    if (login.loggedIn) {
      setLoading(true);
      getCartByToken()
        .then((res) => {
          dispatch(
            setCart(
              (res.data.items || []).map((item) => ({
                _id: item._id,
                productId: item.productId,
                quantity: Number(item.quantity),
                price: item.variant?.price || item.price, // Ưu tiên giá từ variant
                variant: item.variant,
                ram: item.variant?.ram || item.ram,
                storage: item.variant?.storage || item.storage,
              }))
            )
          );
        })
        .catch((err) => {
          console.error("Lỗi lấy giỏ hàng:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [login, dispatch]);

  const changeQty = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdating((prev) => ({ ...prev, [itemId]: true }));

    try {
      await updateCartItem({ id: itemId, quantity: Number(newQuantity) });
      const res = await getCartByToken();
      dispatch(
        setCart(
          (res.data.items || []).map((item) => ({
            _id: item._id,
            productId: item.productId,
            quantity: Number(item.quantity),
            price: item.price,
            variant: item.variant,
            ram: item.ram,
            storage: item.storage,
          }))
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId) => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
    );

    if (!isConfirm) return;

    setUpdating((prev) => ({ ...prev, [itemId]: true }));

    try {
      const item = items.find((i) => i._id === itemId);
      await removeItemFromCart({ productId: item.productId._id });
      const res = await getCartByToken();
      dispatch(
        setCart(
          (res.data.items || []).map((item) => ({
            _id: item._id,
            productId: item.productId,
            quantity: Number(item.quantity),
            price: item.price,
            variant: item.variant,
            ram: item.ram,
            storage: item.storage,
          }))
        )
      );
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) =>
        total + item.quantity * (item.variant?.price || item.price || 0),
      0
    );
  };

  const calculateItemTotal = (item) => {
    return item.quantity * (item.variant?.price || item.price || 0);
  };

  const handleInstallment = (item) => {
    // Chuyển đến trang trả góp với sản phẩm đã chọn
    navigate(`/installment/${item.productId._id}`, {
      state: {
        variant: item.variant,
        quantity: item.quantity,
        fromCart: true,
      },
    });
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-container-inner">
          <div className="cart-loading-container">
            <div className="cart-loading-spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-container-inner">
        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-title">
            <i className="fas fa-shopping-cart"></i>
            Giỏ hàng của bạn
          </h1>
          <div className="cart-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="separator">›</span>
            <span className="current">Giỏ hàng</span>
          </div>
        </div>

        {items.length === 0 ? (
          // Empty Cart State
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-arrow-left"></i>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-main">
              <div className="cart-items">
                <div className="cart-items-header">
                  <h3>Sản phẩm ({items.length})</h3>
                </div>

                {items.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img
                        src={getImageProduct(item.productId?.images?.[0])}
                        alt={item.productId?.name}
                      />
                    </div>

                    <div className="item-details">
                      <h4 className="item-name">{item.productId?.name}</h4>
                      <div className="item-specs">
                        {/* Hiển thị màu sắc đã chọn nếu có */}
                        {item.variant?.color && (
                          <span className="spec">
                            Màu: {item.variant.color}
                          </span>
                        )}
                        {/* Hiển thị bộ nhớ và RAM nếu có */}
                        {item.variant?.ram && (
                          <span className="spec">
                            RAM: {item.variant.ram}GB
                          </span>
                        )}
                        {item.variant?.storage && (
                          <span className="spec">
                            Bộ nhớ: {item.variant.storage}
                          </span>
                        )}
                        
                      </div>
                      <div className="item-price">
                        <span className="price">
                          {(
                            item.variant?.price ||
                            item.price ||
                            0
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                    </div>

                    <div className="item-quantity-static">
                      <span className="qty-label">Số lượng:</span>
                      <span className="qty-value">{item.quantity}</span>
                    </div>

                    <div className="item-total">
                      <div className="total-price">
                        {calculateItemTotal(item).toLocaleString("vi-VN")}₫
                      </div>
                      <div className="item-actions">
                        <button
                          className="installment-item-btn"
                          onClick={() => handleInstallment(item)}
                          title="Trả góp sản phẩm này"
                        >
                          <i className="fas fa-percentage"></i>
                          Trả góp
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item._id)}
                          disabled={updating[item._id]}
                          title="Xóa sản phẩm"
                        >
                          {updating[item._id] ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="continue-shopping">
                <Link to="/" className="btn btn-outline">
                  <i className="fas fa-arrow-left"></i>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-sidebar">
              <div className="cart-summary">
                <h3>Tóm tắt đơn hàng</h3>
                <div className="summary-row">
                  <span>Tạm tính ({items.length} sản phẩm):</span>
                  <span className="price">
                    {calculateTotal().toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span className="free">Miễn phí</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span className="price total-price">
                    {calculateTotal().toLocaleString("vi-VN")}₫
                  </span>
                </div>

                {/* Checkout Actions */}
                <div className="checkout-actions">
                  {login.loggedIn ? (
                    <Link
                      to="/Payment"
                      className="btn btn-primary btn-checkout"
                    >
                      <i className="fas fa-credit-card"></i>
                      Tiến hành thanh toán
                    </Link>
                  ) : (
                    <Link to="/Login" className="btn btn-primary btn-checkout">
                      <i className="fas fa-sign-in-alt"></i>
                      Đăng nhập để mua hàng
                    </Link>
                  )}
                </div>

                {/* Info text */}
                <div className="installment-info">
                  <i className="fas fa-info-circle"></i>
                  <span>
                    Bạn có thể chọn trả góp cho từng sản phẩm bằng cách nhấn nút
                    "Trả góp" bên cạnh sản phẩm
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="badge-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>Bảo hành chính hãng</span>
                  </div>
                  <div className="badge-item">
                    <i className="fas fa-shipping-fast"></i>
                    <span>Giao hàng miễn phí</span>
                  </div>
                  <div className="badge-item">
                    <i className="fas fa-undo"></i>
                    <span>Đổi trả 15 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCart;
