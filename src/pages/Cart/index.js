import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getImageProduct } from "../../shared/utils";
import { setCart } from "../../redux-setup/reducers/cart";
import {
  getCartByToken,
  updateCartItem,
  removeItemFromCart,
} from "../../services/Api";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const login = useSelector(({ auth }) => auth.login);

  // Khi user đã login thì fetch giỏ hàng từ API
  useEffect(() => {
    if (login.loggedIn) {
      getCartByToken()
        .then((res) => {
          console.log("Cart API:", res.data); // Log để debug
          dispatch(setCart(res.data.items || [])); // Lưu items vào redux
        })
        .catch((err) => {
          console.error("Lỗi lấy giỏ hàng:", err);
        });
    }
  }, [login, dispatch]);

  const changeQty = async (e, id) => {
    const { value } = e.target;
    if (value <= 0) {
      const isConfirm = window.confirm(
        "Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?"
      );
      if (isConfirm) {
        // Tìm productId của item cần xóa
        const item = items.find((i) => i._id === id);
        const removeRes = await removeItemFromCart({
          productId: item.productId._id,
        });
        console.log("Remove response:", removeRes);
        const res = await getCartByToken();
        console.log("Cart after remove:", res.data);
        dispatch(
          setCart(
            (res.data.items || []).map((item) => ({
              _id: item._id,
              productId: item.productId,
              quantity: Number(item.quantity),
            }))
          )
        );
      }
    } else {
      const updateRes = await updateCartItem({ id, quantity: Number(value) });
      const res = await getCartByToken();
      dispatch(
        setCart(
          (res.data.items || []).map((item) => ({
            _id: item._id,
            productId: item.productId,
            quantity: Number(item.quantity),
          }))
        )
      );
    }
  };

  const clickDeleteItemCart = async (e, id) => {
    e.preventDefault();

    const isConfirm = window.confirm(
      "Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?"
    );
    if (isConfirm) {
      // Tìm productId của item cần xóa
      const item = items.find((i) => i._id === id);
      const removeRes = await removeItemFromCart({
        productId: item.productId._id,
      });
      const res = await getCartByToken();
      dispatch(
        setCart(
          (res.data.items || []).map((item) => ({
            _id: item._id,
            productId: item.productId,
            quantity: Number(item.quantity),
          }))
        )
      );
    }
  };

  return (
    <div>
      {/*	Cart	*/}
      <div id="my-cart">
        <div className="row">
          <div className="cart-nav-item col-lg-7 col-md-7 col-sm-12">
            Thông tin sản phẩm
          </div>
          <div className="cart-nav-item col-lg-2 col-md-2 col-sm-12">
            Số lượng
          </div>
          <div className="cart-nav-item col-lg-3 col-md-3 col-sm-12">Giá</div>
        </div>
        <form method="post">
          {items?.map((item) => (
            <div className="cart-item row" key={item._id}>
              <div className="cart-thumb col-lg-7 col-md-7 col-sm-12">
                <img
                  src={getImageProduct(item.productId?.images?.[0])}
                  alt={item.productId?.name}
                />
                <h4>{item.productId?.name}</h4>
                {/* Hiển thị màu sắc đã chọn nếu có */}
                {item.variant?.color && (
                  <div className="cart-variant-info">
                    <span>
                      Màu sắc: <b>{item.variant.color}</b>
                    </span>
                  </div>
                )}
                {/* Hiển thị bộ nhớ và RAM nếu có */}
                {item.variant?.storage && (
                  <div className="cart-variant-info">
                    <span>
                      Bộ nhớ: <b>{item.variant.storage}</b>
                    </span>
                  </div>
                )}
                {item.variant?.ram && (
                  <div className="cart-variant-info">
                    <span>
                      RAM: <b>{item.variant.ram}</b>
                    </span>
                  </div>
                )}
                {item.variant?.condition && (
                  <div className="cart-variant-info">
                    <span>
                      Tình trạng: <b>{item.variant.condition}</b>
                    </span>
                  </div>
                )}
              </div>
              <div className="cart-quantity col-lg-2 col-md-2 col-sm-12">
                <input
                  onChange={(e) => changeQty(e, item._id)}
                  type="number"
                  id="quantity"
                  className="form-control form-blue quantity"
                  value={item.quantity}
                />
              </div>
              <div className="cart-price col-lg-3 col-md-3 col-sm-12">
                <b>
                  {(
                    item.quantity * (item.productId?.price || 0)
                  ).toLocaleString("vi-VN")}
                  đ
                </b>
                <a onClick={(e) => clickDeleteItemCart(e, item._id)} href="#">
                  Xóa
                </a>
              </div>
            </div>
          ))}

          <div className="row">
            <div className="cart-thumb col-lg-7 col-md-7 col-sm-12"></div>
            <div className="cart-total col-lg-2 col-md-2 col-sm-12">
              <b>Tổng cộng:</b>
            </div>
            <div className="cart-price col-lg-3 col-md-3 col-sm-12">
              <b>
                {items
                  .reduce(
                    (total, item) =>
                      total + item.quantity * (item.productId?.price || 0),
                    0
                  )
                  .toLocaleString("vi-VN")}
                đ
              </b>
            </div>
          </div>
        </form>
      </div>
      {/*	End Cart	*/}

      {/*	Customer Info	*/}
      <div id="customer">
        <div className="row">
          <div className="by-now col-lg-6 col-md-6 col-sm-12">
            {login.loggedIn ? (
              <Link to="/Payment">
                <b>Mua ngay</b>
                <span>Giao hàng tận nơi siêu tốc</span>
              </Link>
            ) : (
              <Link to="/Login">
                <b>Đăng nhập</b>
                <span>Đăng nhập để mua hàng</span>
              </Link>
            )}
          </div>
          <div className="by-now col-lg-6 col-md-6 col-sm-12">
            <a href="#">
              <b>Trả góp Online</b>
              <span>Vui lòng call (+84) 0988 550 553</span>
            </a>
          </div>
        </div>
      </div>
      {/*	End Customer Info	*/}
    </div>
  );
};

export default Cart;
