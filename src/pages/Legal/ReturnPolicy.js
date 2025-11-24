import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const ReturnPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-undo-alt"></i> Chính Sách Đổi Trả & Hoàn Tiền
          </h1>
          <p className="subtitle">
            Cam kết đổi trả linh hoạt và hoàn tiền nhanh chóng tại PhoneStore
          </p>
        </div>

        {/* Navigation */}
        <div className="legal-navigation">
          <h4>Trang pháp lý khác</h4>
          <div className="legal-nav-links">
            <Link to="/privacy">Chính sách bảo mật</Link>
            <Link to="/terms">Điều khoản dịch vụ</Link>
            <Link to="/cookies">Chính sách Cookie</Link>
            <Link to="/warranty">Chính sách bảo hành</Link>
            <Link to="/shipping">Chính sách giao hàng</Link>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Cam Kết Đổi Trả</h2>
            <div className="highlight-box">
              <h4>
                <i className="fas fa-handshake"></i> Đổi trả 100% hài lòng
              </h4>
              <p>
                Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời. Nếu
                bạn không hoàn toàn hài lòng với sản phẩm, hãy yên tâm đổi trả
                theo chính sách linh hoạt của chúng tôi.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>2. Thời Gian Đổi Trả</h2>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Loại sản phẩm</th>
                  <th>Đổi mới</th>
                  <th>Trả hàng</th>
                  <th>Điều kiện</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Điện thoại mới</strong>
                  </td>
                  <td>7 ngày</td>
                  <td>15 ngày</td>
                  <td>Còn nguyên seal hoặc lỗi kỹ thuật</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tablet</strong>
                  </td>
                  <td>7 ngày</td>
                  <td>15 ngày</td>
                  <td>Chưa kích hoạt hoặc lỗi</td>
                </tr>
                <tr>
                  <td>
                    <strong>Phụ kiện chính hãng</strong>
                  </td>
                  <td>7 ngày</td>
                  <td>30 ngày</td>
                  <td>Còn nguyên vẹn</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tai nghe</strong>
                  </td>
                  <td>3 ngày</td>
                  <td>7 ngày</td>
                  <td>Vệ sinh, chưa sử dụng</td>
                </tr>
                <tr>
                  <td>
                    <strong>Sạc, cable</strong>
                  </td>
                  <td>7 ngày</td>
                  <td>15 ngày</td>
                  <td>Lỗi hoặc không tương thích</td>
                </tr>
              </tbody>
            </table>

            <div className="important-notice">
              <i className="fas fa-clock notice-icon"></i>
              <p>
                Thời gian được tính từ ngày nhận hàng. Cuối tuần và ngày lễ
                không tính vào thời gian đổi trả.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>3. Điều Kiện Đổi Trả</h2>

            <h3>3.1. Sản phẩm được đổi trả khi</h3>
            <div className="highlight-box">
              <h4>✅ Trường hợp được chấp nhận</h4>
              <ul>
                <li>
                  <strong>Lỗi từ nhà sản xuất:</strong> Màn hình lỗi, loa không
                  hoạt động
                </li>
                <li>
                  <strong>Giao sai sản phẩm:</strong> Khác màu, model, cấu hình
                </li>
                <li>
                  <strong>Hàng bị hư hỏng:</strong> Do vận chuyển hoặc đóng gói
                </li>
                <li>
                  <strong>Không đúng mô tả:</strong> Thông số khác với quảng cáo
                </li>
                <li>
                  <strong>Đổi ý mua hàng:</strong> Trong thời gian quy định
                </li>
                <li>
                  <strong>Không vừa ý:</strong> Kích thước, màu sắc không phù
                  hợp
                </li>
              </ul>
            </div>

            <h3>3.2. Sản phẩm KHÔNG được đổi trả</h3>
            <div className="important-notice">
              <i className="fas fa-times-circle notice-icon"></i>
              <p>
                <strong>Các trường hợp từ chối đổi trả:</strong>
              </p>
            </div>
            <ul>
              <li>
                ❌ <strong>Quá thời hạn:</strong> Vượt quá thời gian đổi trả quy
                định
              </li>
              <li>
                ❌ <strong>Hư hỏng do người dùng:</strong> Rơi vỡ, ngấm nước,
                cháy nổ
              </li>
              <li>
                ❌ <strong>Đã sử dụng quá mức:</strong> Trầy xước, dính bẩn
              </li>
              <li>
                ❌ <strong>Thiếu phụ kiện:</strong> Hộp, sạc, tai nghe, sách
                hướng dẫn
              </li>
              <li>
                ❌ <strong>Tem bảo hành bị rách:</strong> Đã can thiệp, sửa chữa
              </li>
              <li>
                ❌ <strong>Sản phẩm khuyến mãi:</strong> Một số chương trình đặc
                biệt
              </li>
              <li>
                ❌ <strong>Không có hóa đơn:</strong> Không chứng minh được mua
                tại PhoneStore
              </li>
            </ul>

            <h3>3.3. Tình trạng sản phẩm khi trả</h3>
            <div className="highlight-box">
              <h4>📦 Yêu cầu về tình trạng sản phẩm</h4>
              <ul>
                <li>Còn nguyên hộp và toàn bộ phụ kiện đi kèm</li>
                <li>Không có dấu hiệu sử dụng quá mức</li>
                <li>Màn hình không trầy xước, vỡ</li>
                <li>Máy sạch sẽ, không dính bẩn</li>
                <li>Tem niêm phong (nếu có) vẫn còn nguyên</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>4. Quy Trình Đổi Trả</h2>

            <h3>4.1. Cách thức đổi trả</h3>
            <div className="highlight-box">
              <h4>🔄 Nhiều kênh hỗ trợ</h4>
              <ol>
                <li>
                  <strong>Trực tiếp tại cửa hàng:</strong> Mang sản phẩm đến cửa
                  hàng
                </li>
                <li>
                  <strong>Hotline:</strong> Gọi 1900 1234 để đăng ký đổi trả
                </li>
                <li>
                  <strong>Website:</strong> Đăng ký online, chúng tôi đến lấy
                  hàng
                </li>
                <li>
                  <strong>App mobile:</strong> Thao tác nhanh trên ứng dụng
                </li>
              </ol>
            </div>

            <h3>4.2. Quy trình xử lý</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Bước</th>
                  <th>Hoạt động</th>
                  <th>Thời gian</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Liên hệ đăng ký đổi trả</td>
                  <td>2 phút</td>
                  <td>Cung cấp mã đơn hàng</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Kiểm tra điều kiện</td>
                  <td>5 phút</td>
                  <td>Xác nhận đủ điều kiện</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Đóng gói và gửi hàng</td>
                  <td>30 phút</td>
                  <td>Hoặc mang đến cửa hàng</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Nhận và kiểm tra sản phẩm</td>
                  <td>2 giờ</td>
                  <td>Kiểm tra tình trạng</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Xử lý đổi/trả</td>
                  <td>1-3 ngày</td>
                  <td>Đổi mới hoặc hoàn tiền</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Giao hàng/hoàn tiền</td>
                  <td>1-5 ngày</td>
                  <td>Tùy phương thức</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>5. Chính Sách Hoàn Tiền</h2>

            <h3>5.1. Phương thức hoàn tiền</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Phương thức thanh toán gốc</th>
                  <th>Cách hoàn tiền</th>
                  <th>Thời gian</th>
                  <th>Phí</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chuyển khoản ngân hàng</td>
                  <td>Chuyển về tài khoản gốc</td>
                  <td>1-3 ngày</td>
                  <td>Miễn phí</td>
                </tr>
                <tr>
                  <td>Ví điện tử (MoMo, ZaloPay)</td>
                  <td>Hoàn về ví gốc</td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                </tr>
                <tr>
                  <td>Thanh toán khi nhận hàng</td>
                  <td>Chuyển khoản ngân hàng</td>
                  <td>1-3 ngày</td>
                  <td>Miễn phí</td>
                </tr>
                <tr>
                  <td>Thẻ tín dụng/ghi nợ</td>
                  <td>Hoàn về thẻ gốc</td>
                  <td>5-15 ngày</td>
                  <td>Miễn phí</td>
                </tr>
              </tbody>
            </table>

            <h3>5.2. Mức hoàn tiền</h3>
            <div className="highlight-box">
              <h4>💰 Tính toán hoàn tiền</h4>
              <ul>
                <li>
                  <strong>100% giá trị:</strong> Lỗi từ nhà sản xuất, giao sai
                  hàng
                </li>
                <li>
                  <strong>95% giá trị:</strong> Đổi ý trong 7 ngày đầu
                </li>
                <li>
                  <strong>90% giá trị:</strong> Đổi ý từ ngày 8-15
                </li>
                <li>
                  <strong>Trừ phí vận chuyển:</strong> Nếu khách hàng đổi ý
                </li>
              </ul>
            </div>

            <h3>5.3. Các khoản không hoàn</h3>
            <ul>
              <li>🚫 Phí vận chuyển (trừ trường hợp lỗi từ PhoneStore)</li>
              <li>🚫 Phí dịch vụ bổ sung (dán kính, ốp lưng đã sử dụng)</li>
              <li>🚫 Giá trị khuyến mãi, quà tặng kèm</li>
              <li>🚫 Phí chuyển đổi ngoại tệ (nếu có)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Đổi Sản Phẩm</h2>

            <h3>6.1. Đổi cùng model</h3>
            <div className="highlight-box">
              <h4>🔄 Đổi sang máy khác cùng loại</h4>
              <p>
                Miễn phí đổi sang màu khác, dung lượng khác của cùng model trong
                vòng 7 ngày.
              </p>
            </div>
            <ul>
              <li>✅ Đổi màu sắc: Miễn phí</li>
              <li>✅ Đổi dung lượng cao hơn: Trả thêm tiền chênh lệch</li>
              <li>✅ Đổi dung lượng thấp hơn: Hoàn lại tiền chênh lệch</li>
              <li>✅ Đổi phụ kiện tương thích: Theo giá niêm yết</li>
            </ul>

            <h3>6.2. Đổi model khác</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Loại đổi</th>
                  <th>Điều kiện</th>
                  <th>Phí</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Đổi lên model cao hơn</td>
                  <td>Trong 7 ngày</td>
                  <td>Trả thêm chênh lệch + 5%</td>
                  <td>Tức thì</td>
                </tr>
                <tr>
                  <td>Đổi xuống model thấp hơn</td>
                  <td>Trong 7 ngày</td>
                  <td>Nhận lại 90% chênh lệch</td>
                  <td>Tức thì</td>
                </tr>
                <tr>
                  <td>Đổi sang thương hiệu khác</td>
                  <td>Trong 3 ngày</td>
                  <td>Phí 10% giá trị sản phẩm</td>
                  <td>1-2 ngày</td>
                </tr>
              </tbody>
            </table>

            <h3>6.3. Trade-in (Thu cũ đổi mới)</h3>
            <div className="highlight-box">
              <h4>📱 Chương trình thu cũ đổi mới</h4>
              <p>
                Đổi máy cũ lấy máy mới với giá ưu đãi, thẩm định giá trị tại
                chỗ.
              </p>
            </div>
            <ul>
              <li>
                🔍 <strong>Thẩm định miễn phí:</strong> Kiểm tra tình trạng máy
                cũ
              </li>
              <li>
                💎 <strong>Giá thu cao:</strong> Giá thu cạnh tranh nhất thị
                trường
              </li>
              <li>
                ⚡ <strong>Xử lý nhanh:</strong> Thẩm định và đổi trong 30 phút
              </li>
              <li>
                🔒 <strong>Xóa dữ liệu an toàn:</strong> Đảm bảo bảo mật thông
                tin
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Trường Hợp Đặc Biệt</h2>

            <h3>7.1. Sản phẩm có lỗi</h3>
            <div className="important-notice">
              <i className="fas fa-tools notice-icon"></i>
              <p>
                <strong>Ưu tiên xử lý:</strong> Sản phẩm lỗi được ưu tiên đổi
                trả trong mọi trường hợp
              </p>
            </div>
            <ul>
              <li>
                🚀 <strong>Xử lý khẩn cấp:</strong> Trong vòng 4 giờ
              </li>
              <li>
                📱 <strong>Máy thay thế:</strong> Cho vay máy tạm thời
              </li>
              <li>
                🚚 <strong>Đến tận nơi:</strong> Lấy hàng tại nhà/văn phòng
              </li>
              <li>
                💰 <strong>Bồi thường:</strong> Nếu gây thiệt hại
              </li>
            </ul>

            <h3>7.2. Sản phẩm trong chương trình khuyến mãi</h3>
            <ul>
              <li>
                🎁 <strong>Quà tặng kèm:</strong> Phải trả lại cùng sản phẩm
              </li>
              <li>
                💸 <strong>Giảm giá:</strong> Hoàn tiền theo giá đã giảm
              </li>
              <li>
                🎫 <strong>Voucher:</strong> Hoàn lại voucher hoặc trừ vào tiền
                hoàn
              </li>
              <li>
                🔥 <strong>Flash sale:</strong> Không áp dụng đổi trả do đổi ý
              </li>
            </ul>

            <h3>7.3. Sản phẩm nhập khẩu</h3>
            <div className="highlight-box">
              <h4>🌍 Sản phẩm quốc tế</h4>
              <p>
                Thời gian đổi trả có thể dài hơn do cần kiểm tra với nhà cung
                cấp.
              </p>
            </div>
            <ul>
              <li>⏰ Thời gian xử lý: 7-14 ngày</li>
              <li>📋 Quy trình nghiêm ngặt hơn</li>
              <li>💰 Chi phí vận chuyển cao hơn</li>
              <li>🔍 Kiểm tra kỹ lưỡng trước khi nhận</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Phí Và Chi Phí</h2>

            <h3>8.1. Phí đổi trả</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Lý do đổi trả</th>
                  <th>Phí xử lý</th>
                  <th>Phí vận chuyển</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lỗi từ PhoneStore</td>
                  <td>Miễn phí</td>
                  <td>Miễn phí</td>
                  <td>Chúng tôi chịu toàn bộ chi phí</td>
                </tr>
                <tr>
                  <td>Lỗi từ nhà sản xuất</td>
                  <td>Miễn phí</td>
                  <td>Miễn phí</td>
                  <td>Bảo hành chính hãng</td>
                </tr>
                <tr>
                  <td>Khách hàng đổi ý</td>
                  <td>50.000đ</td>
                  <td>30.000đ</td>
                  <td>Chi phí xử lý và vận chuyển</td>
                </tr>
                <tr>
                  <td>Đổi model khác</td>
                  <td>100.000đ</td>
                  <td>50.000đ</td>
                  <td>Chi phí cao hơn do phức tạp</td>
                </tr>
              </tbody>
            </table>

            <h3>8.2. Miễn phí trong các trường hợp</h3>
            <div className="highlight-box">
              <h4>🆓 Hoàn toàn miễn phí khi</h4>
              <ul>
                <li>Khách hàng VIP (mua trên 10 triệu/năm)</li>
                <li>Sản phẩm cao cấp (từ 20 triệu trở lên)</li>
                <li>Chương trình khuyến mãi đặc biệt</li>
                <li>Lỗi từ phía PhoneStore</li>
                <li>Đổi cùng model, cùng giá</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>9. Quyền Lợi Khách Hàng</h2>

            <h3>9.1. Cam kết dịch vụ</h3>
            <div className="highlight-box">
              <h4>🌟 Những gì chúng tôi đảm bảo</h4>
              <ul>
                <li>
                  <strong>Tư vấn miễn phí:</strong> Hỗ trợ 24/7 qua hotline
                </li>
                <li>
                  <strong>Kiểm tra miễn phí:</strong> Đánh giá tình trạng sản
                  phẩm
                </li>
                <li>
                  <strong>Vận chuyển an toàn:</strong> Đóng gói chuyên nghiệp
                </li>
                <li>
                  <strong>Xử lý nhanh chóng:</strong> Cam kết thời gian rõ ràng
                </li>
                <li>
                  <strong>Theo dõi tiến độ:</strong> Cập nhật liên tục cho khách
                  hàng
                </li>
              </ul>
            </div>

            <h3>9.2. Bồi thường khi có sai sót</h3>
            <ul>
              <li>
                💰 <strong>Hoàn 200% giá trị:</strong> Nếu mất sản phẩm do lỗi
                vận chuyển
              </li>
              <li>
                🎁 <strong>Voucher 1 triệu:</strong> Nếu xử lý chậm quá 7 ngày
              </li>
              <li>
                📱 <strong>Upgrade miễn phí:</strong> Nếu không có sản phẩm
                tương đương
              </li>
              <li>
                🚚 <strong>Miễn phí ship 1 năm:</strong> Nếu sai sót nghiêm
                trọng
              </li>
            </ul>

            <h3>9.3. Hỗ trợ khách hàng VIP</h3>
            <div className="important-notice">
              <i className="fas fa-crown notice-icon"></i>
              <p>
                <strong>Dành riêng cho khách hàng thân thiết:</strong>
              </p>
            </div>
            <ul>
              <li>⚡ Xử lý ưu tiên trong 2 giờ</li>
              <li>🏠 Đổi trả tại nhà miễn phí</li>
              <li>📞 Hotline riêng 24/7</li>
              <li>🎁 Gia hạn thời gian đổi trả lên 30 ngày</li>
              <li>💯 Miễn phí tất cả các loại phí</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>10. Liên Hệ Đổi Trả</h2>

            <div className="contact-info">
              <h3>Bộ phận đổi trả</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234 (24/7)</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>doitra@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-globe"></i>
                  <span>phonestore.vn/doi-tra</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-comments"></i>
                  <span>Live Chat 8:00 - 22:00</span>
                </div>
              </div>

              <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                📍 Địa chỉ cửa hàng
              </h4>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Nguyễn Huệ, Q1, TP.HCM</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>456 Hoàng Kiếm, Hà Nội</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <span>8:00 - 20:00 hàng ngày</span>
                </div>
              </div>

              <p style={{ marginTop: "1rem", color: "#6c757d" }}>
                Cam kết xử lý yêu cầu đổi trả trong vòng 24 giờ kể từ khi nhận
                được thông tin.
              </p>
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Cập nhật lần cuối: 01/10/2025 | Phiên bản: 2.5
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
