import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const Warranty = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-shield-alt"></i> Chính Sách Bảo Hành
          </h1>
          <p className="subtitle">
            Cam kết bảo hành toàn diện cho tất cả sản phẩm điện thoại và phụ
            kiện tại PhoneStore
          </p>
        </div>

        {/* Navigation */}
        <div className="legal-navigation">
          <h4>Trang pháp lý khác</h4>
          <div className="legal-nav-links">
            <Link to="/privacy">Chính sách bảo mật</Link>
            <Link to="/terms">Điều khoản dịch vụ</Link>
            <Link to="/cookies">Chính sách Cookie</Link>
            <Link to="/return-policy">Đổi trả - Hoàn tiền</Link>
            <Link to="/shipping">Chính sách giao hàng</Link>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Cam Kết Bảo Hành</h2>
            <div className="highlight-box">
              <h4>
                <i className="fas fa-handshake"></i> Cam kết của PhoneStore
              </h4>
              <p>
                Chúng tôi cam kết cung cấp dịch vụ bảo hành chuyên nghiệp, nhanh
                chóng và đáng tin cậy cho tất cả sản phẩm được mua tại
                PhoneStore. Mọi sản phẩm đều được bảo hành chính hãng theo tiêu
                chuẩn quốc tế.
              </p>
            </div>
            <p>
              Chính sách bảo hành này áp dụng cho tất cả sản phẩm được mua từ
              PhoneStore, bao gồm điện thoại di động, tablet, phụ kiện và các
              sản phẩm công nghệ khác.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Thời Gian Bảo Hành</h2>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Loại sản phẩm</th>
                  <th>Thời gian bảo hành</th>
                  <th>Phạm vi bảo hành</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Điện thoại di động</strong>
                  </td>
                  <td>12 tháng</td>
                  <td>Toàn quốc</td>
                  <td>Bao gồm pin, sạc</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tablet</strong>
                  </td>
                  <td>12 tháng</td>
                  <td>Toàn quốc</td>
                  <td>Bao gồm sạc, cable</td>
                </tr>
                <tr>
                  <td>
                    <strong>Tai nghe</strong>
                  </td>
                  <td>6-12 tháng</td>
                  <td>Toàn quốc</td>
                  <td>Tùy theo thương hiệu</td>
                </tr>
                <tr>
                  <td>
                    <strong>Sạc, Cable</strong>
                  </td>
                  <td>6 tháng</td>
                  <td>Toàn quốc</td>
                  <td>Chính hãng</td>
                </tr>
                <tr>
                  <td>
                    <strong>Ốp lưng, kính cường lực</strong>
                  </td>
                  <td>3 tháng</td>
                  <td>Toàn quốc</td>
                  <td>Lỗi sản xuất</td>
                </tr>
                <tr>
                  <td>
                    <strong>Pin dự phòng</strong>
                  </td>
                  <td>12 tháng</td>
                  <td>Toàn quốc</td>
                  <td>Bảo hành dung lượng</td>
                </tr>
              </tbody>
            </table>

            <div className="important-notice">
              <i className="fas fa-info-circle notice-icon"></i>
              <p>
                Thời gian bảo hành được tính từ ngày giao hàng thành công và
                được ghi nhận trong hệ thống của chúng tôi.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>3. Điều Kiện Bảo Hành</h2>

            <h3>3.1. Sản phẩm được bảo hành khi</h3>
            <div className="highlight-box">
              <h4>✅ Điều kiện hợp lệ</h4>
              <ul>
                <li>Sản phẩm được mua chính thức tại PhoneStore</li>
                <li>Còn trong thời gian bảo hành</li>
                <li>Có hóa đơn mua hàng hoặc thông tin đơn hàng</li>
                <li>Tem bảo hành còn nguyên vẹn (nếu có)</li>
                <li>Sản phẩm không bị can thiệp, sửa chữa bởi bên thứ ba</li>
                <li>Lỗi do nhà sản xuất hoặc lỗi kỹ thuật</li>
              </ul>
            </div>

            <h3>3.2. Sản phẩm KHÔNG được bảo hành khi</h3>
            <div className="important-notice">
              <i className="fas fa-times-circle notice-icon"></i>
              <p>
                <strong>Các trường hợp loại trừ bảo hành:</strong>
              </p>
            </div>
            <ul>
              <li>
                ❌ <strong>Hư hỏng do người dùng:</strong> Rơi vỡ, ngấm nước,
                cháy nổ
              </li>
              <li>
                ❌ <strong>Sử dụng sai mục đích:</strong> Quá tải, điện áp không
                ổn định
              </li>
              <li>
                ❌ <strong>Tác động từ bên ngoài:</strong> Thiên tai, hỏa hoạn,
                trộm cắp
              </li>
              <li>
                ❌ <strong>Hết thời gian bảo hành:</strong> Quá 12 tháng (hoặc
                theo quy định)
              </li>
              <li>
                ❌ <strong>Sửa chữa tự ý:</strong> Đã can thiệp, sửa chữa ở nơi
                khác
              </li>
              <li>
                ❌ <strong>Tem bảo hành bị rách:</strong> Tem bị xóa, rách, thay
                đổi
              </li>
              <li>
                ❌ <strong>Sản phẩm không chính hãng:</strong> Hàng nhái, hàng
                dựng
              </li>
              <li>
                ❌ <strong>Hao mòn tự nhiên:</strong> Pin chai, màn hình xước
                nhẹ do sử dụng
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Quy Trình Bảo Hành</h2>

            <h3>4.1. Cách thức tiếp nhận bảo hành</h3>
            <div className="highlight-box">
              <h4>📱 Nhiều kênh hỗ trợ</h4>
              <ol>
                <li>
                  <strong>Trực tiếp tại cửa hàng:</strong> Mang sản phẩm đến các
                  cửa hàng PhoneStore
                </li>
                <li>
                  <strong>Hotline:</strong> Gọi 1900 1234 để được tư vấn và
                  hướng dẫn
                </li>
                <li>
                  <strong>Website:</strong> Đăng ký bảo hành online tại website
                </li>
                <li>
                  <strong>Ứng dụng mobile:</strong> Sử dụng app PhoneStore (sắp
                  ra mắt)
                </li>
                <li>
                  <strong>Bảo hành tận nơi:</strong> Đối với sản phẩm cao cấp
                  (iPhone, Samsung Galaxy S)
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
                  <td>Tiếp nhận và kiểm tra sản phẩm</td>
                  <td>30 phút</td>
                  <td>Tại cửa hàng hoặc online</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Chẩn đoán lỗi và báo giá</td>
                  <td>1-2 giờ</td>
                  <td>Miễn phí chẩn đoán</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Xác nhận sửa chữa</td>
                  <td>15 phút</td>
                  <td>Khách hàng đồng ý</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Sửa chữa/thay thế</td>
                  <td>1-7 ngày</td>
                  <td>Tùy mức độ hư hỏng</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Kiểm tra chất lượng</td>
                  <td>30 phút</td>
                  <td>Đảm bảo hoạt động tốt</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Bàn giao sản phẩm</td>
                  <td>15 phút</td>
                  <td>Hướng dẫn sử dụng</td>
                </tr>
              </tbody>
            </table>

            <h3>4.3. Thời gian xử lý cụ thể</h3>
            <ul>
              <li>
                🚀 <strong>Sửa chữa nhanh:</strong> 2-4 giờ (thay màn hình, pin,
                loa)
              </li>
              <li>
                ⚡ <strong>Sửa chữa tiêu chuẩn:</strong> 1-3 ngày (lỗi phần mềm,
                bo mạch nhỏ)
              </li>
              <li>
                🔧 <strong>Sửa chữa phức tạp:</strong> 5-7 ngày (lỗi bo mạch
                chính)
              </li>
              <li>
                📦 <strong>Đổi sản phẩm mới:</strong> 1-2 ngày (nếu không sửa
                được)
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Dịch Vụ Bảo Hành Nâng Cao</h2>

            <h3>5.1. Bảo hành mở rộng (Extended Warranty)</h3>
            <div className="highlight-box">
              <h4>🔄 Gia hạn bảo hành</h4>
              <p>
                Khách hàng có thể mua thêm gói bảo hành mở rộng để tăng thời
                gian bảo hành lên 24 hoặc 36 tháng.
              </p>
            </div>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Gói bảo hành</th>
                  <th>Thời gian</th>
                  <th>Phí</th>
                  <th>Lợi ích</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Extended 12</td>
                  <td>+12 tháng</td>
                  <td>10% giá sản phẩm</td>
                  <td>Bảo hành toàn diện</td>
                </tr>
                <tr>
                  <td>Extended 24</td>
                  <td>+24 tháng</td>
                  <td>15% giá sản phẩm</td>
                  <td>Bảo hành + ưu tiên hỗ trợ</td>
                </tr>
                <tr>
                  <td>Premium Care</td>
                  <td>+36 tháng</td>
                  <td>20% giá sản phẩm</td>
                  <td>Toàn diện + máy thay thế</td>
                </tr>
              </tbody>
            </table>

            <h3>5.2. Care Diamond - Bảo hành rơi vỡ, ngấm nước</h3>
            <div className="highlight-box">
              <h4>💎 Bảo vệ toàn diện</h4>
              <p>
                Gói bảo hành đặc biệt cho các trường hợp rơi vỡ, ngấm nước -
                những tình huống thường không được bảo hành.
              </p>
            </div>
            <ul>
              <li>
                🛡️ <strong>Bảo vệ rơi vỡ:</strong> Thay màn hình, khung viền
              </li>
              <li>
                💧 <strong>Bảo vệ ngấm nước:</strong> Vệ sinh, sấy khô, thay
                linh kiện
              </li>
              <li>
                ⚡ <strong>Sửa chữa nhanh:</strong> Trong vòng 4 giờ
              </li>
              <li>
                🔄 <strong>Máy thay thế:</strong> Cho vay máy khi sửa chữa lâu
              </li>
              <li>
                📞 <strong>Hỗ trợ 24/7:</strong> Tư vấn khẩn cấp mọi lúc
              </li>
            </ul>

            <h3>5.3. Care X60 - Bảo hành cao cấp</h3>
            <div className="important-notice">
              <i className="fas fa-crown notice-icon"></i>
              <p>
                <strong>Gói bảo hành cao cấp nhất:</strong> Rơi vỡ ngấm nước vẫn
                đổi mới trong 60 ngày đầu
              </p>
            </div>
            <ul>
              <li>
                🆕 <strong>Đổi mới 60 ngày:</strong> Bất kể lý do gì (trừ mất
                trộm)
              </li>
              <li>
                🚚 <strong>Bảo hành tận nơi:</strong> Đến tận nhà/văn phòng
              </li>
              <li>
                📱 <strong>Máy dự phòng:</strong> Cung cấp máy tạm thời
              </li>
              <li>
                🎯 <strong>Ưu tiên tuyệt đối:</strong> Xử lý trong vòng 2 giờ
              </li>
              <li>
                👨‍💼 <strong>Chuyên viên riêng:</strong> Được phân công chuyên
                viên chăm sóc
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Bảo Hành Theo Thương Hiệu</h2>

            <h3>6.1. iPhone (Apple)</h3>
            <div className="highlight-box">
              <h4>🍎 Bảo hành Apple Authorized</h4>
              <p>
                PhoneStore là đại lý ủy quyền của Apple, đảm bảo bảo hành chính
                hãng toàn cầu.
              </p>
            </div>
            <ul>
              <li>✅ Bảo hành chính hãng Apple 12 tháng</li>
              <li>✅ Hỗ trợ AppleCare+ nếu khách hàng đăng ký</li>
              <li>✅ Sử dụng linh kiện Apple chính hãng</li>
              <li>✅ Cập nhật iOS và hỗ trợ kỹ thuật</li>
              <li>✅ Bảo hành toàn cầu (có thể bảo hành ở nước ngoài)</li>
            </ul>

            <h3>6.2. Samsung</h3>
            <div className="highlight-box">
              <h4>📱 Samsung Authorized Service</h4>
              <p>Trung tâm bảo hành ủy quyền Samsung với tiêu chuẩn quốc tế.</p>
            </div>
            <ul>
              <li>✅ Bảo hành chính hãng Samsung 12 tháng</li>
              <li>✅ Hỗ trợ Samsung Care+ cho máy cao cấp</li>
              <li>✅ Linh kiện Samsung Original</li>
              <li>✅ Cập nhật One UI và bảo mật</li>
              <li>✅ Hỗ trợ Samsung Members</li>
            </ul>

            <h3>6.3. Xiaomi</h3>
            <ul>
              <li>✅ Bảo hành chính hãng Xiaomi 18 tháng</li>
              <li>✅ Hỗ trợ MIUI và Mi Mover</li>
              <li>✅ Linh kiện chính hãng từ Xiaomi</li>
              <li>✅ Cập nhật MIUI định kỳ</li>
            </ul>

            <h3>6.4. OPPO & OnePlus</h3>
            <ul>
              <li>✅ Bảo hành chính hãng 12 tháng</li>
              <li>✅ Hỗ trợ ColorOS và OxygenOS</li>
              <li>✅ Dịch vụ sửa chữa nhanh</li>
              <li>✅ Clone Phone hỗ trợ chuyển dữ liệu</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Trung Tâm Bảo Hành</h2>

            <h3>7.1. Hệ thống trung tâm bảo hành</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Khu vực</th>
                  <th>Địa chỉ</th>
                  <th>Giờ làm việc</th>
                  <th>Hotline</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>TP.HCM</strong>
                  </td>
                  <td>123 Nguyễn Huệ, Q1</td>
                  <td>8:00 - 20:00</td>
                  <td>028 3825 1234</td>
                </tr>
                <tr>
                  <td>
                    <strong>Hà Nội</strong>
                  </td>
                  <td>456 Hoàng Kiếm, Hoàn Kiếm</td>
                  <td>8:00 - 20:00</td>
                  <td>024 3936 5678</td>
                </tr>
                <tr>
                  <td>
                    <strong>Đà Nẵng</strong>
                  </td>
                  <td>789 Trần Phú, Hải Châu</td>
                  <td>8:00 - 19:00</td>
                  <td>0236 3650 999</td>
                </tr>
                <tr>
                  <td>
                    <strong>Cần Thơ</strong>
                  </td>
                  <td>321 Ninh Kiều, Ninh Kiều</td>
                  <td>8:00 - 19:00</td>
                  <td>0292 3831 888</td>
                </tr>
              </tbody>
            </table>

            <h3>7.2. Trang thiết bị hiện đại</h3>
            <div className="highlight-box">
              <h4>🔧 Đầu tư công nghệ hàng đầu</h4>
              <ul>
                <li>Máy hàn BGA cho bo mạch chính</li>
                <li>Buồng sấy khô chuyên dụng</li>
                <li>Máy kiểm tra pin chính xác</li>
                <li>Kho linh kiện chính hãng đầy đủ</li>
                <li>Hệ thống quản lý bảo hành tự động</li>
              </ul>
            </div>

            <h3>7.3. Đội ngũ kỹ thuật viên</h3>
            <ul>
              <li>
                👨‍🔧 <strong>Được đào tạo chính hãng:</strong> Apple, Samsung,
                Xiaomi certified
              </li>
              <li>
                📚 <strong>Cập nhật kiến thức thường xuyên:</strong> Theo kịp
                công nghệ mới
              </li>
              <li>
                🏆 <strong>Kinh nghiệm dày dặn:</strong> Trung bình 5+ năm kinh
                nghiệm
              </li>
              <li>
                💯 <strong>Chất lượng đảm bảo:</strong> Cam kết sửa chữa đúng
                lỗi
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Quyền Lợi Khách Hàng</h2>

            <h3>8.1. Cam kết chất lượng</h3>
            <div className="highlight-box">
              <h4>✅ Những gì chúng tôi đảm bảo</h4>
              <ul>
                <li>
                  <strong>Miễn phí:</strong> Sửa chữa trong thời gian bảo hành
                </li>
                <li>
                  <strong>Chính hãng:</strong> Chỉ sử dụng linh kiện Original
                </li>
                <li>
                  <strong>Bảo đảm:</strong> Bảo hành 3 tháng cho phần đã sửa
                </li>
                <li>
                  <strong>Minh bạch:</strong> Báo giá và tiến độ rõ ràng
                </li>
                <li>
                  <strong>Hỗ trợ:</strong> Tư vấn kỹ thuật trọn đời
                </li>
              </ul>
            </div>

            <h3>8.2. Chính sách đổi sản phẩm</h3>
            <div className="important-notice">
              <i className="fas fa-sync-alt notice-icon"></i>
              <p>
                <strong>Đổi sản phẩm mới khi:</strong>
              </p>
            </div>
            <ul>
              <li>🔄 Sửa chữa 3 lần cùng 1 lỗi mà không khắc phục được</li>
              <li>⏰ Thời gian sửa chữa quá 15 ngày làm việc</li>
              <li>🚫 Không có linh kiện thay thế</li>
              <li>💔 Bo mạch chính bị hỏng không sửa được</li>
              <li>🔋 Pin phồng trong thời gian bảo hành</li>
            </ul>

            <h3>8.3. Bồi thường thiệt hại</h3>
            <p>Trong trường hợp lỗi do PhoneStore gây ra:</p>
            <ul>
              <li>
                💰 <strong>Bồi thường 100% giá trị sản phẩm</strong> nếu làm
                hỏng
              </li>
              <li>
                🎁 <strong>Tặng voucher 500K</strong> nếu sửa chữa quá thời gian
                cam kết
              </li>
              <li>
                📱 <strong>Cho vay máy miễn phí</strong> khi sửa chữa kéo dài
              </li>
              <li>
                🚚 <strong>Miễn phí vận chuyển</strong> đi lại nhiều lần
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Hướng Dẫn Bảo Quản</h2>

            <h3>9.1. Cách sử dụng để kéo dài tuổi thọ</h3>
            <div className="highlight-box">
              <h4>📱 Bảo vệ điện thoại hiệu quả</h4>
              <ul>
                <li>
                  <strong>Sử dụng ốp lưng và dán màn hình:</strong> Bảo vệ khỏi
                  va đập
                </li>
                <li>
                  <strong>Tránh nhiệt độ cao:</strong> Không để dưới ánh nắng
                  trực tiếp
                </li>
                <li>
                  <strong>Sạc đúng cách:</strong> Dùng sạc chính hãng, không sạc
                  qua đêm
                </li>
                <li>
                  <strong>Cập nhật phần mềm:</strong> Thường xuyên cập nhật
                  iOS/Android
                </li>
                <li>
                  <strong>Vệ sinh định kỳ:</strong> Lau khô, tránh bụi bẩn
                </li>
              </ul>
            </div>

            <h3>9.2. Cách nhận biết cần bảo hành</h3>
            <div className="important-notice">
              <i className="fas fa-exclamation-triangle notice-icon"></i>
              <p>
                <strong>Dấu hiệu cần mang bảo hành ngay:</strong>
              </p>
            </div>
            <ul>
              <li>🔋 Pin sụt nhanh, sạc không vào</li>
              <li>📱 Màn hình xuất hiện vệt, chấm lạ</li>
              <li>🔊 Loa, micro không hoạt động</li>
              <li>📶 Mất sóng, không bắt được mạng</li>
              <li>🔥 Máy nóng bất thường</li>
              <li>💧 Vào nước, ẩm ướt</li>
              <li>🚫 Đơ, lag, tự khởi động lại</li>
            </ul>

            <h3>9.3. Backup dữ liệu trước khi bảo hành</h3>
            <p>
              <strong>Quan trọng:</strong> Luôn sao lưu dữ liệu trước khi mang
              bảo hành
            </p>
            <ul>
              <li>
                ☁️ <strong>iCloud/Google Drive:</strong> Sao lưu ảnh, video,
                danh bạ
              </li>
              <li>
                💾 <strong>iTunes/Smart Switch:</strong> Backup toàn bộ dữ liệu
              </li>
              <li>
                📝 <strong>Ghi chú mật khẩu:</strong> Các ứng dụng quan trọng
              </li>
              <li>
                📱 <strong>Thoát tài khoản:</strong> iCloud, Google, Samsung
                account
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>10. Liên Hệ Bảo Hành</h2>

            <div className="contact-info">
              <h3>Trung tâm chăm sóc khách hàng</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234 (24/7)</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>warranty@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-globe"></i>
                  <span>phonestore.vn/bao-hanh</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-comments"></i>
                  <span>Live Chat 8:00 - 22:00</span>
                </div>
              </div>

              <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                🚀 Hotline bảo hành nhanh
              </h4>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 1: Bảo hành</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 2: Kỹ thuật</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 3: Khiếu nại</span>
                </div>
              </div>
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Cập nhật lần cuối: 01/10/2025 | Phiên bản: 3.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;
