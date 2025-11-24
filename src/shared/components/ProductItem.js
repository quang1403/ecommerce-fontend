import { getImageProduct } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, getCartByToken } from "../../services/Api";
import { setCart } from "../../redux-setup/reducers/cart";
import { useState } from "react";
import "./ProductItem.css";

const ProductItem = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (type = "add") => {
    const token = localStorage.getItem("accessToken");

    // Nếu là "buy-now", chuyển hướng trực tiếp tới trang chi tiết sản phẩm
    if (type === "buy-now") {
      navigate(`/product/${item._id}`);
      return;
    }

    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await addToCart({
        productId: item._id,
        quantity: 1,
      });

      // Cập nhật giỏ hàng từ server
      const res = await getCartByToken();
      dispatch(
        setCart(
          (res.data.items || []).map((cartItem) => ({
            _id: cartItem._id,
            productId: cartItem.productId,
            quantity: Number(cartItem.quantity),
          }))
        )
      );

      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="product-item card text-center">
      <Link to={`/product/${item._id}`} className="product-link">
        <img src={getImageProduct(item.images[0])} alt="" />
      </Link>
      <div className="product-content">
        <h4>
          <Link to={`/product/${item._id}`} className="product-name">
            {item.name}
          </Link>
        </h4>
        <p className="product-price">
          Giá: <span>{formatPrice(item.price)}đ</span>
        </p>
        <div className="product-actions">
          <button
            className="btn btn-outline-primary btn-sm me-2 product-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart("add");
            }}
            disabled={loading}
            title="Thêm vào giỏ hàng"
          >
            {loading ? "..." : <i className="fas fa-shopping-cart"></i>}
          </button>
          <button
            className="btn btn-home-buy btn-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart("buy-now");
            }}
            disabled={loading}
          >
            {loading ? "..." : "Mua ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductItem;
