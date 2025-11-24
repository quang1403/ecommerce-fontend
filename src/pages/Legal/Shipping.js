import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const Shipping = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-shipping-fast"></i> Chính Sách Giao Hàng
          </h1>
          <p className="subtitle">
            Cam kết giao hàng nhanh chóng, an toàn và uy tín trên toàn quốc
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
            <Link to="/return-policy">Đổi trả - Hoàn tiền</Link>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Phạm Vi Giao Hàng</h2>
            <div className="highlight-box">
              <h4>
                <i className="fas fa-globe-asia"></i> Giao hàng toàn quốc
              </h4>
              <p>
                PhoneStore cung cấp dịch vụ giao hàng trên toàn lãnh thổ Việt
                Nam, từ thành phố lớn đến vùng sâu vùng xa.
              </p>
            </div>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Khu vực</th>
                  <th>Thời gian giao hàng</th>
                  <th>Phí giao hàng</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Nội thành TP.HCM</strong>
                  </td>
                  <td>2-4 giờ</td>
                  <td>Miễn phí</td>
                  <td>Giao hàng trong ngày</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nội thành Hà Nội</strong>
                  </td>
                  <td>2-4 giờ</td>
                  <td>Miễn phí</td>
                  <td>Giao hàng trong ngày</td>
                </tr>
                <tr>
                  <td>
                    <strong>Các tỉnh thành phố trực thuộc TW</strong>
                  </td>
                  <td>1-2 ngày</td>
                  <td>30.000đ</td>
                  <td>Đà Nẵng, Cần Thơ, Hải Phòng</td>
                </tr>
                <tr>
                  <td>
                    <strong>Thành phố tỉnh lẻ</strong>
                  </td>
                  <td>2-3 ngày</td>
                  <td>40.000đ</td>
                  <td>Trung tâm tỉnh lẻ</td>
                </tr>
                <tr>
                  <td>
                    <strong>Huyện, thị xã</strong>
                  </td>
                  <td>3-5 ngày</td>
                  <td>50.000đ</td>
                  <td>Khu vực ngoại thành</td>
                </tr>
                <tr>
                  <td>
                    <strong>Vùng sâu, vùng xa</strong>
                  </td>
                  <td>5-7 ngày</td>
                  <td>80.000đ</td>
                  <td>Miền núi, hải đảo</td>
                </tr>
              </tbody>
            </table>

            <div className="important-notice">
              <i className="fas fa-info-circle notice-icon"></i>
              <p>
                Thời gian giao hàng được tính từ khi xác nhận đơn hàng và thanh
                toán thành công. Không tính thứ 7, chủ nhật và các ngày lễ.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>2. Chính Sách Miễn Phí Giao Hàng</h2>

            <h3>2.1. Điều kiện miễn phí</h3>
            <div className="highlight-box">
              <h4>🆓 Miễn phí giao hàng khi</h4>
              <ul>
                <li>
                  <strong>Đơn hàng từ 500.000đ:</strong> Miễn phí toàn quốc
                </li>
                <li>
                  <strong>Khách hàng VIP:</strong> Miễn phí mọi đơn hàng
                </li>
                <li>
                  <strong>Sản phẩm cao cấp:</strong> iPhone, Samsung Galaxy S
                </li>
                <li>
                  <strong>Chương trình khuyến mãi:</strong> Theo từng chương
                  trình
                </li>
                <li>
                  <strong>Đơn hàng bù:</strong> Do lỗi từ PhoneStore
                </li>
              </ul>
            </div>

            <h3>2.2. Ưu đãi giao hàng</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Chương trình</th>
                  <th>Điều kiện</th>
                  <th>Ưu đãi</th>
                  <th>Thời gian áp dụng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Happy Hour</td>
                  <td>Đặt hàng 9-11h, 14-16h</td>
                  <td>Miễn phí ship đơn từ 300K</td>
                  <td>Thứ 2-6</td>
                </tr>
                <tr>
                  <td>Weekend Deal</td>
                  <td>Đặt hàng cuối tuần</td>
                  <td>Giảm 50% phí ship</td>
                  <td>Thứ 7, Chủ nhật</td>
                </tr>
                <tr>
                  <td>Flash Sale</td>
                  <td>Sản phẩm flash sale</td>
                  <td>Miễn phí ship mọi đơn</td>
                  <td>Theo sự kiện</td>
                </tr>
                <tr>
                  <td>Loyal Customer</td>
                  <td>Mua 3 lần trong năm</td>
                  <td>Miễn phí ship trọn đời</td>
                  <td>Không giới hạn</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>3. Đối Tác Vận Chuyển</h2>

            <h3>3.1. Mạng lưới vận chuyển</h3>
            <div className="highlight-box">
              <h4>🚚 Đối tác uy tín</h4>
              <p>
                Chúng tôi hợp tác với các đơn vị vận chuyển hàng đầu để đảm bảo
                chất lượng dịch vụ.
              </p>
            </div>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Đối tác</th>
                  <th>Khu vực phục vụ</th>
                  <th>Ưu điểm</th>
                  <th>Dịch vụ đặc biệt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Giao Hàng Nhanh (GHN)</strong>
                  </td>
                  <td>Toàn quốc</td>
                  <td>Nhanh, đa dạng dịch vụ</td>
                  <td>COD, giao hàng trong ngày</td>
                </tr>
                <tr>
                  <td>
                    <strong>Giao Hàng Tiết Kiệm (GHTK)</strong>
                  </td>
                  <td>Toàn quốc</td>
                  <td>Giá cạnh tranh</td>
                  <td>Giao hàng vùng xa</td>
                </tr>
                <tr>
                  <td>
                    <strong>J&T Express</strong>
                  </td>
                  <td>Toàn quốc</td>
                  <td>Mạng lưới rộng</td>
                  <td>Express delivery</td>
                </tr>
                <tr>
                  <td>
                    <strong>VNPost</strong>
                  </td>
                  <td>Toàn quốc + quốc tế</td>
                  <td>Uy tín, bưu điện nhà nước</td>
                  <td>EMS, chuyển phát nhanh</td>
                </tr>
                <tr>
                  <td>
                    <strong>Đội xe riêng PhoneStore</strong>
                  </td>
                  <td>TP.HCM, Hà Nội</td>
                  <td>Kiểm soát chất lượng 100%</td>
                  <td>Giao hàng trong 2h</td>
                </tr>
              </tbody>
            </table>

            <h3>3.2. Dịch vụ giao hàng đặc biệt</h3>
            <ul>
              <li>
                🚀 <strong>Express 2h:</strong> Giao hàng trong 2 giờ (nội thành
                HCM, HN)
              </li>
              <li>
                🌙 <strong>Giao hàng tối:</strong> Từ 18h-21h cho khách hàng bận
              </li>
              <li>
                📅 <strong>Hẹn giờ giao:</strong> Chọn khung giờ phù hợp
              </li>
              <li>
                🏢 <strong>Giao tại văn phòng:</strong> Giao hàng đến công ty
              </li>
              <li>
                🏠 <strong>Giao tận nhà:</strong> Lên tận cửa nhà
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Quy Trình Giao Hàng</h2>

            <h3>4.1. Từ khi đặt hàng đến nhận hàng</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Bước</th>
                  <th>Hoạt động</th>
                  <th>Thời gian</th>
                  <th>Thông báo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Nhận đơn hàng</td>
                  <td>Tức thì</td>
                  <td>Email + SMS xác nhận</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Xác nhận thanh toán</td>
                  <td>15 phút</td>
                  <td>Thông báo thanh toán</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Chuẩn bị hàng</td>
                  <td>1-2 giờ</td>
                  <td>Đóng gói hoàn tất</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Bàn giao vận chuyển</td>
                  <td>30 phút</td>
                  <td>Mã vận đơn</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Đang vận chuyển</td>
                  <td>Theo khu vực</td>
                  <td>Cập nhật vị trí</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Giao hàng thành công</td>
                  <td>-</td>
                  <td>Xác nhận nhận hàng</td>
                </tr>
              </tbody>
            </table>

            <h3>4.2. Theo dõi đơn hàng</h3>
            <div className="highlight-box">
              <h4>📱 Nhiều cách theo dõi</h4>
              <ul>
                <li>
                  <strong>Website:</strong> Đăng nhập tài khoản để xem chi tiết
                </li>
                <li>
                  <strong>SMS:</strong> Nhận tin nhắn cập nhật tự động
                </li>
                <li>
                  <strong>Email:</strong> Thông báo chi tiết qua email
                </li>
                <li>
                  <strong>App:</strong> Push notification real-time
                </li>
                <li>
                  <strong>Hotline:</strong> Gọi 1900 1234 để kiểm tra
                </li>
              </ul>
            </div>

            <h3>4.3. Đóng gói chuyên nghiệp</h3>
            <ul>
              <li>
                📦 <strong>Hộp carton chắc chắn:</strong> Chống sốc, chống ẩm
              </li>
              <li>
                🛡️ <strong>Màng bọc khí:</strong> Bảo vệ sản phẩm trong quá
                trình vận chuyển
              </li>
              <li>
                🔒 <strong>Niêm phong bảo mật:</strong> Tem chống giả, chống mở
                trộm
              </li>
              <li>
                📋 <strong>Hóa đơn VAT:</strong> Đính kèm hóa đơn và giấy tờ
                liên quan
              </li>
              <li>
                🎁 <strong>Túi xách cao cấp:</strong> Đối với sản phẩm premium
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Nhận Hàng và Kiểm Tra</h2>

            <h3>5.1. Quy trình nhận hàng</h3>
            <div className="highlight-box">
              <h4>📋 Checklist khi nhận hàng</h4>
              <ol>
                <li>
                  <strong>Kiểm tra thông tin:</strong> Tên, địa chỉ, số điện
                  thoại
                </li>
                <li>
                  <strong>Kiểm tra bao bì:</strong> Nguyên vẹn, không rách, ướt
                </li>
                <li>
                  <strong>Kiểm tra sản phẩm:</strong> Model, màu sắc, số lượng
                </li>
                <li>
                  <strong>Kiểm tra phụ kiện:</strong> Sạc, tai nghe, sách hướng
                  dẫn
                </li>
                <li>
                  <strong>Test sản phẩm:</strong> Bật máy, kiểm tra chức năng cơ
                  bản
                </li>
                <li>
                  <strong>Ký nhận:</strong> Xác nhận đã nhận hàng đầy đủ
                </li>
              </ol>
            </div>

            <h3>5.2. Quyền từ chối nhận hàng</h3>
            <div className="important-notice">
              <i className="fas fa-hand-paper notice-icon"></i>
              <p>
                <strong>
                  Bạn có quyền từ chối nhận hàng trong các trường hợp:
                </strong>
              </p>
            </div>
            <ul>
              <li>🚫 Bao bì bị rách, ướt, biến dạng</li>
              <li>🚫 Sản phẩm không đúng như đặt hàng</li>
              <li>🚫 Thiếu phụ kiện hoặc quà tặng</li>
              <li>🚫 Sản phẩm có dấu hiệu đã qua sử dụng</li>
              <li>🚫 Màn hình vỡ, trầy xước</li>
              <li>🚫 Không bật được máy</li>
            </ul>

            <h3>5.3. Thanh toán khi nhận hàng (COD)</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Phương thức</th>
                  <th>Mô tả</th>
                  <th>Phí COD</th>
                  <th>Giới hạn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tiền mặt</td>
                  <td>Trả bằng tiền mặt</td>
                  <td>Miễn phí</td>
                  <td>Dưới 50 triệu</td>
                </tr>
                <tr>
                  <td>Chuyển khoản tại chỗ</td>
                  <td>Banking app</td>
                  <td>Miễn phí</td>
                  <td>Không giới hạn</td>
                </tr>
                <tr>
                  <td>QR Code</td>
                  <td>Quét mã thanh toán</td>
                  <td>Miễn phí</td>
                  <td>Không giới hạn</td>
                </tr>
                <tr>
                  <td>POS di động</td>
                  <td>Quẹt thẻ tại nhà</td>
                  <td>1.5% giá trị đơn</td>
                  <td>Theo yêu cầu</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>6. Giao Hàng Đặc Biệt</h2>

            <h3>6.1. Sản phẩm có giá trị cao</h3>
            <div className="highlight-box">
              <h4>💎 Quy trình đặc biệt cho sản phẩm từ 20 triệu trở lên</h4>
              <ul>
                <li>
                  <strong>Giao hàng bằng xe riêng:</strong> Đội ngũ nhân viên
                  PhoneStore
                </li>
                <li>
                  <strong>Bảo hiểm hàng hóa:</strong> 100% giá trị sản phẩm
                </li>
                <li>
                  <strong>Hỗ trợ setup:</strong> Cài đặt, chuyển dữ liệu miễn
                  phí
                </li>
                <li>
                  <strong>Ưu tiên giao hàng:</strong> Trong vòng 4 giờ
                </li>
              </ul>
            </div>

            <h3>6.2. Giao hàng vùng xa</h3>
            <ul>
              <li>
                🏔️ <strong>Miền núi:</strong> Phối hợp với bưu điện địa phương
              </li>
              <li>
                🏝️ <strong>Hải đảo:</strong> Vận chuyển bằng tàu thủy/máy bay
              </li>
              <li>
                📞 <strong>Liên hệ trước:</strong> Xác nhận địa chỉ và thời gian
              </li>
              <li>
                💰 <strong>Phí đặc biệt:</strong> Tính theo khoảng cách thực tế
              </li>
            </ul>

            <h3>6.3. Giao hàng khẩn cấp</h3>
            <div className="important-notice">
              <i className="fas fa-bolt notice-icon"></i>
              <p>
                <strong>Dịch vụ giao hàng khẩn cấp trong 2 giờ:</strong>
              </p>
            </div>
            <ul>
              <li>⚡ Phí dịch vụ: 100.000đ</li>
              <li>🏃‍♂️ Chỉ áp dụng nội thành HCM, HN</li>
              <li>📱 Liên hệ hotline để đặt lịch</li>
              <li>✅ Cam kết hoàn tiền nếu trễ</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Các Trường Hợp Đặc Biệt</h2>

            <h3>7.1. Giao hàng không thành công</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Lý do</th>
                  <th>Xử lý</th>
                  <th>Thời gian chờ</th>
                  <th>Chi phí</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Khách không có nhà</td>
                  <td>Giao lại lần 2</td>
                  <td>24 giờ</td>
                  <td>Miễn phí</td>
                </tr>
                <tr>
                  <td>Từ chối nhận hàng</td>
                  <td>Trả hàng về kho</td>
                  <td>48 giờ</td>
                  <td>Phí vận chuyển 2 chiều</td>
                </tr>
                <tr>
                  <td>Địa chỉ sai</td>
                  <td>Liên hệ xác nhận lại</td>
                  <td>24 giờ</td>
                  <td>Phí giao bổ sung</td>
                </tr>
                <tr>
                  <td>Máy liên lạc không được</td>
                  <td>Gửi đến địa chỉ</td>
                  <td>72 giờ</td>
                  <td>Theo thỏa thuận</td>
                </tr>
              </tbody>
            </table>

            <h3>7.2. Thời tiết xấu</h3>
            <div className="highlight-box">
              <h4>🌧️ Chính sách trong điều kiện thời tiết xấu</h4>
              <ul>
                <li>
                  <strong>Mưa lớn:</strong> Hoãn giao hàng để bảo vệ sản phẩm
                </li>
                <li>
                  <strong>Bão lụt:</strong> Tạm ngừng giao hàng khu vực nguy
                  hiểm
                </li>
                <li>
                  <strong>Đường ngập:</strong> Chờ nước rút mới giao hàng
                </li>
                <li>
                  <strong>Thông báo:</strong> SMS/call thông báo cho khách hàng
                </li>
              </ul>
            </div>

            <h3>7.3. Dịp lễ tết</h3>
            <ul>
              <li>
                🎉 <strong>Tết Nguyên Đán:</strong> Nghỉ 3 ngày, giao hàng chậm
              </li>
              <li>
                🎊 <strong>Lễ lớn:</strong> 30/4, 1/5, 2/9 - giao hàng bình
                thường
              </li>
              <li>
                📅 <strong>Thông báo trước:</strong> 7 ngày trước khi nghỉ lễ
              </li>
              <li>
                🚀 <strong>Giao hàng trước lễ:</strong> Ưu tiên giao trước ngày
                nghỉ
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Cam Kết Dịch Vụ</h2>

            <h3>8.1. Cam kết chất lượng</h3>
            <div className="highlight-box">
              <h4>✅ Những gì chúng tôi đảm bảo</h4>
              <ul>
                <li>
                  <strong>Đúng hẹn:</strong> Giao hàng đúng thời gian cam kết
                </li>
                <li>
                  <strong>An toàn:</strong> Sản phẩm nguyên vẹn 100%
                </li>
                <li>
                  <strong>Chính xác:</strong> Đúng sản phẩm, đúng địa chỉ
                </li>
                <li>
                  <strong>Chuyên nghiệp:</strong> Nhân viên giao hàng được đào
                  tạo
                </li>
                <li>
                  <strong>Hỗ trợ 24/7:</strong> Luôn sẵn sàng giải đáp thắc mắc
                </li>
              </ul>
            </div>

            <h3>8.2. Bồi thường khi có sai sót</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Sai sót</th>
                  <th>Mức bồi thường</th>
                  <th>Điều kiện</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Giao hàng trễ</td>
                  <td>50.000đ voucher</td>
                  <td>Trễ hơn 1 ngày</td>
                </tr>
                <tr>
                  <td>Hư hỏng do vận chuyển</td>
                  <td>100% giá trị sản phẩm</td>
                  <td>Có bằng chứng</td>
                </tr>
                <tr>
                  <td>Giao sai hàng</td>
                  <td>200.000đ voucher + đổi hàng</td>
                  <td>Lỗi từ PhoneStore</td>
                </tr>
                <tr>
                  <td>Mất hàng</td>
                  <td>150% giá trị sản phẩm</td>
                  <td>Có bảo hiểm</td>
                </tr>
              </tbody>
            </table>

            <h3>8.3. Dịch vụ khách hàng VIP</h3>
            <div className="important-notice">
              <i className="fas fa-crown notice-icon"></i>
              <p>
                <strong>Đặc quyền cho khách hàng VIP:</strong>
              </p>
            </div>
            <ul>
              <li>🚀 Giao hàng ưu tiên - trong 2 giờ</li>
              <li>🆓 Miễn phí giao hàng mọi đơn hàng</li>
              <li>🎯 Đội giao hàng riêng biệt</li>
              <li>📞 Hotline riêng 24/7</li>
              <li>🏠 Giao hàng tận giường (theo yêu cầu)</li>
              <li>🔧 Hỗ trợ setup tại nhà miễn phí</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Liên Hệ Giao Hàng</h2>

            <div className="contact-info">
              <h3>Bộ phận giao hàng</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234 (24/7)</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>giaohang@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-globe"></i>
                  <span>phonestore.vn/theo-doi-don-hang</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-comments"></i>
                  <span>Live Chat 8:00 - 22:00</span>
                </div>
              </div>

              <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                🚚 Hotline giao hàng nhanh
              </h4>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 4: Theo dõi đơn hàng</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 5: Giao hàng khẩn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 6: Khiếu nại giao hàng</span>
                </div>
              </div>

              <p style={{ marginTop: "1rem", color: "#6c757d" }}>
                Cam kết phản hồi mọi yêu cầu về giao hàng trong vòng 15 phút.
              </p>
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Cập nhật lần cuối: 01/10/2025 | Phiên bản: 2.8
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
