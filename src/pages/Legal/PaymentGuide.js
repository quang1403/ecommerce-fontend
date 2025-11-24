import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const PaymentGuide = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-credit-card"></i> Hướng Dẫn Thanh Toán
          </h1>
          <p className="subtitle">
            Hướng dẫn chi tiết các phương thức thanh toán an toàn và tiện lợi
            tại PhoneStore
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
            <Link to="/shipping">Chính sách giao hàng</Link>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Tổng Quan Phương Thức Thanh Toán</h2>
            <div className="highlight-box">
              <h4>
                <i className="fas fa-shield-alt"></i> An toàn - Nhanh chóng -
                Tiện lợi
              </h4>
              <p>
                PhoneStore cung cấp đa dạng phương thức thanh toán để bạn có thể
                lựa chọn cách thức phù hợp nhất với nhu cầu của mình.
              </p>
            </div>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Phương thức</th>
                  <th>Thời gian xử lý</th>
                  <th>Phí giao dịch</th>
                  <th>Mức độ bảo mật</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Chuyển khoản ngân hàng</strong>
                  </td>
                  <td>Tức thì - 2 giờ</td>
                  <td>Miễn phí</td>
                  <td>⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td>
                    <strong>Ví điện tử</strong>
                  </td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                  <td>⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td>
                    <strong>QR Code Banking</strong>
                  </td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                  <td>⭐⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td>
                    <strong>Thanh toán khi nhận hàng</strong>
                  </td>
                  <td>Khi giao hàng</td>
                  <td>30.000đ (đơn dưới 1 triệu)</td>
                  <td>⭐⭐⭐⭐</td>
                </tr>
                <tr>
                  <td>
                    <strong>Trả góp 0%</strong>
                  </td>
                  <td>1-3 ngày</td>
                  <td>Theo chính sách đối tác</td>
                  <td>⭐⭐⭐⭐</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>2. Chuyển Khoản Ngân Hàng</h2>

            <h3>2.1. Thông tin tài khoản</h3>
            <div className="highlight-box">
              <h4>🏦 Tài khoản nhận thanh toán</h4>
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Ngân hàng</th>
                    <th>Số tài khoản</th>
                    <th>Chủ tài khoản</th>
                    <th>Chi nhánh</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>MB Bank</strong>
                    </td>
                    <td>0362782295</td>
                    <td>PHONESTORE COMPANY</td>
                    <td>PGD Tân Định</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Techcombank</strong>
                    </td>
                    <td>19028888888</td>
                    <td>PHONESTORE COMPANY</td>
                    <td>CN Nguyễn Huệ</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>VietcomBank</strong>
                    </td>
                    <td>0081234567890</td>
                    <td>PHONESTORE COMPANY</td>
                    <td>CN Sài Gòn</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>2.2. Hướng dẫn chuyển khoản</h3>
            <div className="highlight-box">
              <h4>📱 Chuyển khoản qua Internet Banking</h4>
              <ol>
                <li>
                  <strong>Đăng nhập:</strong> App/Website ngân hàng của bạn
                </li>
                <li>
                  <strong>Chọn chức năng:</strong> Chuyển khoản trong nước
                </li>
                <li>
                  <strong>Nhập thông tin:</strong> Số tài khoản và số tiền
                </li>
                <li>
                  <strong>Nội dung chuyển khoản:</strong> Mã đơn hàng (VD:
                  #PS123456)
                </li>
                <li>
                  <strong>Xác nhận:</strong> OTP và hoàn tất giao dịch
                </li>
                <li>
                  <strong>Lưu ảnh:</strong> Chụp màn hình để làm bằng chứng
                </li>
              </ol>
            </div>

            <h3>2.3. Lưu ý quan trọng</h3>
            <div className="important-notice">
              <i className="fas fa-exclamation-triangle notice-icon"></i>
              <p>
                <strong>Để đơn hàng được xử lý nhanh chóng:</strong>
              </p>
            </div>
            <ul>
              <li>
                💰 <strong>Chuyển đúng số tiền:</strong> Bao gồm cả phí ship
                (nếu có)
              </li>
              <li>
                📝 <strong>Ghi đúng nội dung:</strong> Mã đơn hàng hoặc số điện
                thoại
              </li>
              <li>
                ⏰ <strong>Chuyển trong giờ hành chính:</strong> 8h-17h để xử lý
                nhanh
              </li>
              <li>
                📷 <strong>Gửi bill chuyển khoản:</strong> Qua Zalo, email hoặc
                website
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. QR Code Banking</h2>

            <h3>3.1. Ưu điểm của VietQR</h3>
            <div className="highlight-box">
              <h4>⚡ Tại sao nên chọn QR Code?</h4>
              <ul>
                <li>
                  <strong>Siêu nhanh:</strong> Chỉ cần quét và xác nhận
                </li>
                <li>
                  <strong>Không nhập sai:</strong> Thông tin tự động điền
                </li>
                <li>
                  <strong>An toàn:</strong> Mã hóa end-to-end
                </li>
                <li>
                  <strong>Tiện lợi:</strong> Mọi lúc mọi nơi
                </li>
                <li>
                  <strong>Miễn phí:</strong> Không tốn phí giao dịch
                </li>
              </ul>
            </div>

            <h3>3.2. Cách thanh toán bằng QR Code</h3>
            <div className="highlight-box">
              <h4>📱 Hướng dẫn từng bước</h4>
              <ol>
                <li>
                  <strong>Mở app ngân hàng:</strong> Banking app của bạn
                </li>
                <li>
                  <strong>Chọn QR Pay:</strong> Tìm biểu tượng QR
                </li>
                <li>
                  <strong>Quét mã QR:</strong> Trên màn hình thanh toán
                </li>
                <li>
                  <strong>Kiểm tra thông tin:</strong> Số tiền và nội dung
                </li>
                <li>
                  <strong>Xác nhận:</strong> Mật khẩu/vân tay/khuôn mặt
                </li>
                <li>
                  <strong>Hoàn tất:</strong> Nhận thông báo thành công
                </li>
              </ol>
            </div>

            <h3>3.3. Ngân hàng hỗ trợ VietQR</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Ngân hàng</th>
                  <th>App</th>
                  <th>Tính năng QR</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vietcombank</td>
                  <td>VCB Digibank</td>
                  <td>QR Pay</td>
                  <td>Hỗ trợ đầy đủ</td>
                </tr>
                <tr>
                  <td>BIDV</td>
                  <td>BIDV SmartBanking</td>
                  <td>QR Payment</td>
                  <td>Hỗ trợ đầy đủ</td>
                </tr>
                <tr>
                  <td>Techcombank</td>
                  <td>Techcombank Mobile</td>
                  <td>QR Code</td>
                  <td>Hỗ trợ đầy đủ</td>
                </tr>
                <tr>
                  <td>MB Bank</td>
                  <td>MB Bank</td>
                  <td>QR Pay</td>
                  <td>Khuyến nghị</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>4. Ví Điện Tử</h2>

            <h3>4.1. Các ví điện tử được hỗ trợ</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Ví điện tử</th>
                  <th>Thời gian xử lý</th>
                  <th>Phí giao dịch</th>
                  <th>Ưu đãi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>MoMo</strong>
                  </td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                  <td>Hoàn 1% (tối đa 50K/tháng)</td>
                </tr>
                <tr>
                  <td>
                    <strong>ZaloPay</strong>
                  </td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                  <td>Voucher giảm giá</td>
                </tr>
                <tr>
                  <td>
                    <strong>VNPay</strong>
                  </td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                  <td>Tích điểm đổi quà</td>
                </tr>
                <tr>
                  <td>
                    <strong>ShopeePay</strong>
                  </td>
                  <td>Tức thì</td>
                  <td>Miễn phí</td>
                  <td>Xu ShopeePay</td>
                </tr>
              </tbody>
            </table>

            <h3>4.2. Hướng dẫn thanh toán MoMo</h3>
            <div className="highlight-box">
              <h4>💙 Thanh toán bằng MoMo</h4>
              <ol>
                <li>
                  <strong>Chọn MoMo:</strong> Tại trang thanh toán
                </li>
                <li>
                  <strong>Nhập số điện thoại:</strong> Số ĐT liên kết MoMo
                </li>
                <li>
                  <strong>Xác nhận OTP:</strong> Mã xác thực gửi về SĐT
                </li>
                <li>
                  <strong>Chọn nguồn tiền:</strong> Ví MoMo hoặc thẻ liên kết
                </li>
                <li>
                  <strong>Nhập mã PIN:</strong> Mã PIN MoMo của bạn
                </li>
                <li>
                  <strong>Hoàn tất:</strong> Nhận thông báo thành công
                </li>
              </ol>
            </div>

            <h3>4.3. Bảo mật với ví điện tử</h3>
            <div className="important-notice">
              <i className="fas fa-lock notice-icon"></i>
              <p>
                <strong>Bảo mật thông tin ví điện tử:</strong>
              </p>
            </div>
            <ul>
              <li>
                🔒 <strong>Mã PIN mạnh:</strong> 6 số, không dễ đoán
              </li>
              <li>
                📱 <strong>Sinh trắc học:</strong> Vân tay/khuôn mặt
              </li>
              <li>
                🚫 <strong>Không chia sẻ:</strong> OTP, PIN với ai
              </li>
              <li>
                📧 <strong>Kiểm tra email:</strong> Thông báo giao dịch
              </li>
              <li>
                🔄 <strong>Cập nhật app:</strong> Phiên bản mới nhất
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Thanh Toán Khi Nhận Hàng (COD)</h2>

            <h3>5.1. Cách thức thanh toán COD</h3>
            <div className="highlight-box">
              <h4>💰 Trả tiền khi nhận hàng</h4>
              <p>
                Phương thức thanh toán truyền thống, an toàn cho người mua lần
                đầu.
              </p>
            </div>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Loại thanh toán</th>
                  <th>Mô tả</th>
                  <th>Ưu điểm</th>
                  <th>Nhược điểm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Tiền mặt</strong>
                  </td>
                  <td>Trả bằng tiền mặt</td>
                  <td>Đơn giản, quen thuộc</td>
                  <td>Cần chuẩn bị tiền lẻ</td>
                </tr>
                <tr>
                  <td>
                    <strong>Chuyển khoản tại chỗ</strong>
                  </td>
                  <td>Banking app</td>
                  <td>Không cần tiền mặt</td>
                  <td>Cần có mạng internet</td>
                </tr>
                <tr>
                  <td>
                    <strong>QR Code</strong>
                  </td>
                  <td>Quét mã thanh toán</td>
                  <td>Nhanh, chính xác</td>
                  <td>Cần smartphone</td>
                </tr>
                <tr>
                  <td>
                    <strong>POS di động</strong>
                  </td>
                  <td>Quẹt thẻ ATM/Credit</td>
                  <td>Dùng thẻ, có hóa đơn</td>
                  <td>Phí 1.5%</td>
                </tr>
              </tbody>
            </table>

            <h3>5.2. Phí dịch vụ COD</h3>
            <ul>
              <li>
                💸 <strong>Đơn dưới 1 triệu:</strong> Phí COD 30.000đ
              </li>
              <li>
                ✅ <strong>Đơn từ 1 triệu trở lên:</strong> Miễn phí COD
              </li>
              <li>
                👑 <strong>Khách hàng VIP:</strong> Miễn phí mọi đơn hàng
              </li>
              <li>
                🎯 <strong>Sản phẩm cao cấp:</strong> iPhone, Samsung Galaxy -
                miễn phí
              </li>
            </ul>

            <h3>5.3. Lưu ý khi thanh toán COD</h3>
            <div className="important-notice">
              <i className="fas fa-info-circle notice-icon"></i>
              <p>
                <strong>Những điều cần lưu ý:</strong>
              </p>
            </div>
            <ul>
              <li>
                📞 <strong>Shipper sẽ gọi trước:</strong> 15-30 phút trước khi
                đến
              </li>
              <li>
                🆔 <strong>Xuất trình CMND:</strong> Nếu giá trị đơn hàng cao
              </li>
              <li>
                📦 <strong>Kiểm tra hàng trước:</strong> Được mở hộp kiểm tra
              </li>
              <li>
                📄 <strong>Yêu cầu hóa đơn:</strong> Thông báo trước với shipper
              </li>
              <li>
                💰 <strong>Chuẩn bị tiền đúng:</strong> Shipper có thể không có
                tiền thối
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Trả Góp 0%</h2>

            <h3>6.1. Đối tác tài chính</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Đối tác</th>
                  <th>Điều kiện</th>
                  <th>Kỳ hạn</th>
                  <th>Lãi suất</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Home Credit</strong>
                  </td>
                  <td>CMND + Thu nhập</td>
                  <td>6-12-18 tháng</td>
                  <td>0% (có điều kiện)</td>
                </tr>
                <tr>
                  <td>
                    <strong>FE Credit</strong>
                  </td>
                  <td>CMND + Bằng lái xe</td>
                  <td>6-12 tháng</td>
                  <td>0% trong 6 tháng đầu</td>
                </tr>
                <tr>
                  <td>
                    <strong>MCREDIT</strong>
                  </td>
                  <td>CMND + Sao kê ngân hàng</td>
                  <td>12-24 tháng</td>
                  <td>0% từ 3 triệu trở lên</td>
                </tr>
                <tr>
                  <td>
                    <strong>MIRAE ASSET</strong>
                  </td>
                  <td>CMND + Thu nhập 8 triệu</td>
                  <td>6-12-18-24 tháng</td>
                  <td>0% toàn bộ kỳ hạn</td>
                </tr>
              </tbody>
            </table>

            <h3>6.2. Hồ sơ trả góp</h3>
            <div className="highlight-box">
              <h4>📋 Giấy tờ cần thiết</h4>
              <ul>
                <li>
                  <strong>Bắt buộc:</strong> CMND/CCCD bản gốc
                </li>
                <li>
                  <strong>Thu nhập:</strong> Sao kê lương 3 tháng gần nhất
                </li>
                <li>
                  <strong>Bổ sung:</strong> Bằng lái xe, thẻ ATM
                </li>
                <li>
                  <strong>Người bảo lãnh:</strong> Nếu thu nhập dưới 5 triệu
                </li>
                <li>
                  <strong>Hóa đơn tiền điện:</strong> Chứng minh địa chỉ
                </li>
              </ul>
            </div>

            <h3>6.3. Quy trình trả góp</h3>
            <ol>
              <li>
                <strong>Chọn sản phẩm:</strong> Thêm vào giỏ hàng
              </li>
              <li>
                <strong>Chọn trả góp:</strong> Tại trang thanh toán
              </li>
              <li>
                <strong>Chọn đối tác:</strong> Home Credit, FE Credit...
              </li>
              <li>
                <strong>Điền thông tin:</strong> Form đăng ký online
              </li>
              <li>
                <strong>Upload hồ sơ:</strong> Ảnh chụp giấy tờ
              </li>
              <li>
                <strong>Chờ duyệt:</strong> 30 phút - 2 giờ
              </li>
              <li>
                <strong>Ký hợp đồng:</strong> Tại cửa hàng hoặc online
              </li>
              <li>
                <strong>Nhận hàng:</strong> Sau khi ký hợp đồng
              </li>
            </ol>
          </div>

          <div className="legal-section">
            <h2>7. Bảo Mật Thanh Toán</h2>

            <h3>7.1. Công nghệ bảo mật</h3>
            <div className="highlight-box">
              <h4>🔒 Bảo mật đa lớp</h4>
              <ul>
                <li>
                  <strong>SSL 256-bit:</strong> Mã hóa thông tin truyền tải
                </li>
                <li>
                  <strong>PCI DSS Compliant:</strong> Tiêu chuẩn bảo mật thẻ
                </li>
                <li>
                  <strong>3D Secure:</strong> Xác thực 2 bước cho thẻ quốc tế
                </li>
                <li>
                  <strong>Tokenization:</strong> Không lưu trữ thông tin thẻ
                </li>
                <li>
                  <strong>Fraud Detection:</strong> Phát hiện giao dịch bất
                  thường
                </li>
              </ul>
            </div>

            <h3>7.2. Cam kết bảo mật</h3>
            <div className="important-notice">
              <i className="fas fa-shield-alt notice-icon"></i>
              <p>
                <strong>Chúng tôi cam kết:</strong>
              </p>
            </div>
            <ul>
              <li>
                🚫 <strong>Không lưu trữ:</strong> Thông tin thẻ tín dụng
              </li>
              <li>
                🔐 <strong>Mã hóa:</strong> Tất cả dữ liệu nhạy cảm
              </li>
              <li>
                👨‍💼 <strong>Nhân viên được đào tạo:</strong> Về bảo mật thông tin
              </li>
              <li>
                🔍 <strong>Kiểm toán thường xuyên:</strong> Hệ thống bảo mật
              </li>
              <li>
                📧 <strong>Thông báo ngay:</strong> Khi có giao dịch bất thường
              </li>
            </ul>

            <h3>7.3. Nhận biết website giả mạo</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Dấu hiệu</th>
                  <th>Website thật</th>
                  <th>Website giả</th>
                  <th>Cách nhận biết</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>URL</td>
                  <td>phonestore.vn</td>
                  <td>phonestore.com.vn</td>
                  <td>Kiểm tra chính xác tên miền</td>
                </tr>
                <tr>
                  <td>HTTPS</td>
                  <td>Có ổ khóa xanh</td>
                  <td>HTTP hoặc ổ khóa đỏ</td>
                  <td>Luôn có https://</td>
                </tr>
                <tr>
                  <td>Thiết kế</td>
                  <td>Chuyên nghiệp, nhất quán</td>
                  <td>Thô sơ, nhiều lỗi</td>
                  <td>Chất lượng hình ảnh</td>
                </tr>
                <tr>
                  <td>Thông tin liên hệ</td>
                  <td>Đầy đủ, chính xác</td>
                  <td>Thiếu hoặc sai</td>
                  <td>Gọi hotline để kiểm tra</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>8. Xử Lý Sự Cố Thanh Toán</h2>

            <h3>8.1. Các sự cố thường gặp</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Sự cố</th>
                  <th>Nguyên nhân</th>
                  <th>Cách xử lý</th>
                  <th>Thời gian khắc phục</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Chuyển khoản thành công nhưng đơn hàng chưa được xác nhận
                  </td>
                  <td>Chưa cập nhật hệ thống</td>
                  <td>Gửi bill cho CSKH</td>
                  <td>30 phút</td>
                </tr>
                <tr>
                  <td>Thanh toán thất bại</td>
                  <td>Hết hạn mức, lỗi mạng</td>
                  <td>Thử lại hoặc đổi phương thức</td>
                  <td>Tức thì</td>
                </tr>
                <tr>
                  <td>Bị trừ tiền 2 lần</td>
                  <td>Lỗi hệ thống</td>
                  <td>Liên hệ CSKH ngay</td>
                  <td>24 giờ</td>
                </tr>
                <tr>
                  <td>QR Code không quét được</td>
                  <td>Độ phân giải thấp</td>
                  <td>Phóng to hoặc chuyển khoản thủ công</td>
                  <td>Tức thì</td>
                </tr>
              </tbody>
            </table>

            <h3>8.2. Quy trình khiếu nại</h3>
            <div className="highlight-box">
              <h4>📞 Khi cần hỗ trợ</h4>
              <ol>
                <li>
                  <strong>Liên hệ ngay:</strong> Hotline 1900 1234
                </li>
                <li>
                  <strong>Cung cấp thông tin:</strong> Mã đơn hàng, bill chuyển
                  khoản
                </li>
                <li>
                  <strong>Mô tả sự cố:</strong> Chi tiết vấn đề gặp phải
                </li>
                <li>
                  <strong>Chờ xử lý:</strong> Nhận mã ticket xử lý
                </li>
                <li>
                  <strong>Theo dõi:</strong> Cập nhật qua SMS/email
                </li>
                <li>
                  <strong>Hoàn tất:</strong> Xác nhận đã giải quyết
                </li>
              </ol>
            </div>

            <h3>8.3. Hoàn tiền</h3>
            <div className="important-notice">
              <i className="fas fa-undo notice-icon"></i>
              <p>
                <strong>Chính sách hoàn tiền:</strong>
              </p>
            </div>
            <ul>
              <li>
                ⚡ <strong>Hoàn tiền tức thì:</strong> Lỗi hệ thống, thanh toán
                trùng
              </li>
              <li>
                🏦 <strong>Hoàn về tài khoản gốc:</strong> 1-5 ngày làm việc
              </li>
              <li>
                💯 <strong>Hoàn 100%:</strong> Lỗi từ PhoneStore
              </li>
              <li>
                📧 <strong>Thông báo email:</strong> Khi hoàn tiền thành công
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Ưu Đãi Thanh Toán</h2>

            <h3>9.1. Chương trình khuyến mãi</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Chương trình</th>
                  <th>Điều kiện</th>
                  <th>Ưu đãi</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cashback MoMo</td>
                  <td>Thanh toán qua MoMo</td>
                  <td>Hoàn 1% (tối đa 50K)</td>
                  <td>Hàng tháng</td>
                </tr>
                <tr>
                  <td>VietQR Rewards</td>
                  <td>Thanh toán QR Banking</td>
                  <td>Tích điểm đổi quà</td>
                  <td>Cả năm</td>
                </tr>
                <tr>
                  <td>Early Bird</td>
                  <td>Thanh toán trước 10h</td>
                  <td>Giảm 2% đơn hàng</td>
                  <td>Thứ 2-6</td>
                </tr>
                <tr>
                  <td>Combo Payment</td>
                  <td>Mua 2 sản phẩm trở lên</td>
                  <td>Miễn phí ship + voucher</td>
                  <td>Cuối tuần</td>
                </tr>
              </tbody>
            </table>

            <h3>9.2. Tích điểm thành viên</h3>
            <div className="highlight-box">
              <h4>🎯 Chương trình điểm thưởng</h4>
              <ul>
                <li>
                  <strong>Tích điểm:</strong> 1% giá trị đơn hàng
                </li>
                <li>
                  <strong>Quy đổi:</strong> 100 điểm = 1.000đ
                </li>
                <li>
                  <strong>Thưởng sinh nhật:</strong> 500 điểm
                </li>
                <li>
                  <strong>Review sản phẩm:</strong> 50 điểm
                </li>
                <li>
                  <strong>Giới thiệu bạn:</strong> 200 điểm
                </li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>10. Liên Hệ Hỗ Trợ Thanh Toán</h2>

            <div className="contact-info">
              <h3>Bộ phận thanh toán</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234 (24/7)</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>payment@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-globe"></i>
                  <span>phonestore.vn/huong-dan-thanh-toan</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-comments"></i>
                  <span>Live Chat 8:00 - 22:00</span>
                </div>
              </div>

              <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                💳 Hotline thanh toán nhanh
              </h4>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 7: Hỗ trợ thanh toán</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 8: Khiếu nại giao dịch</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>1900 1234 - Phím 9: Trả góp</span>
                </div>
              </div>

              <p style={{ marginTop: "1rem", color: "#6c757d" }}>
                Đội ngũ chuyên viên thanh toán sẵn sàng hỗ trợ bạn 24/7.
              </p>
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Cập nhật lần cuối: 01/10/2025 | Phiên bản: 3.2
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGuide;
