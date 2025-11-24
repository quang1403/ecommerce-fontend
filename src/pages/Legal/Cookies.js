import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const Cookies = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-cookie-bite"></i> Chính Sách Cookie
          </h1>
          <p className="subtitle">
            Tìm hiểu cách PhoneStore sử dụng cookie và công nghệ theo dõi để cải
            thiện trải nghiệm của bạn
          </p>
        </div>

        {/* Navigation */}
        <div className="legal-navigation">
          <h4>Trang pháp lý khác</h4>
          <div className="legal-nav-links">
            <Link to="/privacy">Chính sách bảo mật</Link>
            <Link to="/terms">Điều khoản dịch vụ</Link>
            <Link to="/warranty">Chính sách bảo hành</Link>
            <Link to="/return-policy">Đổi trả - Hoàn tiền</Link>
            <Link to="/shipping">Chính sách giao hàng</Link>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Cookie Là Gì?</h2>
            <p>
              Cookie là những tệp tin nhỏ được lưu trữ trên thiết bị của bạn
              (máy tính, tablet, điện thoại) khi bạn truy cập website. Cookie
              giúp website "ghi nhớ" thông tin về lần truy cập của bạn, làm cho
              việc truy cập lần sau trở nên dễ dàng và hữu ích hơn.
            </p>

            <div className="highlight-box">
              <h4>
                <i className="fas fa-info-circle"></i> Tại sao chúng tôi sử dụng
                cookie?
              </h4>
              <p>
                Cookie giúp chúng tôi hiểu cách bạn sử dụng website, ghi nhớ tùy
                chọn của bạn, và cung cấp trải nghiệm cá nhân hóa tốt hơn. Chúng
                cũng giúp đảm bảo website hoạt động hiệu quả và an toàn.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>2. Các Loại Cookie Chúng Tôi Sử Dụng</h2>

            <h3>2.1. Cookie cần thiết (Essential Cookies)</h3>
            <div className="highlight-box">
              <h4>🔒 Bắt buộc để website hoạt động</h4>
              <p>
                Những cookie này cần thiết cho hoạt động cơ bản của website và
                không thể tắt.
              </p>
            </div>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Tên Cookie</th>
                  <th>Mục đích</th>
                  <th>Thời gian lưu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>session_id</td>
                  <td>Duy trì phiên đăng nhập</td>
                  <td>Khi đóng browser</td>
                </tr>
                <tr>
                  <td>csrf_token</td>
                  <td>Bảo mật chống tấn công CSRF</td>
                  <td>1 giờ</td>
                </tr>
                <tr>
                  <td>cart_items</td>
                  <td>Lưu sản phẩm trong giỏ hàng</td>
                  <td>7 ngày</td>
                </tr>
                <tr>
                  <td>user_preferences</td>
                  <td>Ghi nhớ ngôn ngữ, tiền tệ</td>
                  <td>1 năm</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2. Cookie hiệu suất (Performance Cookies)</h3>
            <div className="highlight-box">
              <h4>📊 Giúp chúng tôi cải thiện website</h4>
              <p>
                Cookie này thu thập thông tin về cách bạn sử dụng website để
                chúng tôi có thể cải thiện.
              </p>
            </div>
            <ul>
              <li>
                <strong>Google Analytics:</strong> Phân tích lưu lượng truy cập
                và hành vi người dùng
              </li>
              <li>
                <strong>Page load time:</strong> Đo thời gian tải trang để tối
                ưu hiệu suất
              </li>
              <li>
                <strong>Error tracking:</strong> Phát hiện và sửa lỗi kỹ thuật
              </li>
              <li>
                <strong>Feature usage:</strong> Hiểu tính năng nào được sử dụng
                nhiều nhất
              </li>
            </ul>

            <h3>2.3. Cookie chức năng (Functional Cookies)</h3>
            <div className="highlight-box">
              <h4>⚙️ Nâng cao trải nghiệm người dùng</h4>
              <p>
                Cookie này ghi nhớ lựa chọn của bạn để cung cấp trải nghiệm cá
                nhân hóa.
              </p>
            </div>
            <ul>
              <li>
                <strong>Sản phẩm đã xem:</strong> Hiển thị lịch sử sản phẩm bạn
                đã xem
              </li>
              <li>
                <strong>Danh sách yêu thích:</strong> Lưu sản phẩm bạn quan tâm
              </li>
              <li>
                <strong>Tùy chọn hiển thị:</strong> Grid/list view, số sản phẩm
                mỗi trang
              </li>
              <li>
                <strong>Bộ lọc search:</strong> Ghi nhớ tiêu chí tìm kiếm của
                bạn
              </li>
            </ul>

            <h3>2.4. Cookie tiếp thị (Marketing Cookies)</h3>
            <div className="highlight-box">
              <h4>🎯 Quảng cáo phù hợp và hữu ích</h4>
              <p>
                Cookie này giúp chúng tôi hiển thị quảng cáo phù hợp với sở
                thích của bạn.
              </p>
            </div>
            <ul>
              <li>
                <strong>Facebook Pixel:</strong> Tái tiếp thị trên Facebook và
                Instagram
              </li>
              <li>
                <strong>Google Ads:</strong> Hiển thị quảng cáo có liên quan
                trên Google
              </li>
              <li>
                <strong>Retargeting:</strong> Nhắc nhở sản phẩm bạn đã xem
              </li>
              <li>
                <strong>Email marketing:</strong> Cá nhân hóa nội dung email
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Cookie Của Bên Thứ Ba</h2>
            <p>
              Ngoài cookie của chúng tôi, website cũng sử dụng cookie từ các
              dịch vụ bên thứ ba để cung cấp tính năng bổ sung:
            </p>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Nhà cung cấp</th>
                  <th>Mục đích</th>
                  <th>Chính sách riêng tư</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Google Analytics</td>
                  <td>Google LLC</td>
                  <td>Phân tích web</td>
                  <td>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener"
                    >
                      Xem chi tiết
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Facebook Pixel</td>
                  <td>Meta Platforms</td>
                  <td>Quảng cáo</td>
                  <td>
                    <a
                      href="https://www.facebook.com/privacy/explanation"
                      target="_blank"
                      rel="noopener"
                    >
                      Xem chi tiết
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Google Ads</td>
                  <td>Google LLC</td>
                  <td>Quảng cáo</td>
                  <td>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener"
                    >
                      Xem chi tiết
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Zalo OA</td>
                  <td>VNG Corporation</td>
                  <td>Chat hỗ trợ</td>
                  <td>
                    <a
                      href="https://zalo.me/privacy"
                      target="_blank"
                      rel="noopener"
                    >
                      Xem chi tiết
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>YouTube</td>
                  <td>Google LLC</td>
                  <td>Video nhúng</td>
                  <td>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener"
                    >
                      Xem chi tiết
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>4. Cách Quản Lý Cookie</h2>

            <h3>4.1. Thông qua trình duyệt</h3>
            <p>Bạn có thể quản lý cookie thông qua cài đặt trình duyệt:</p>

            <div className="highlight-box">
              <h4>🌐 Chrome</h4>
              <ol>
                <li>Mở Chrome → Cài đặt → Quyền riêng tư và bảo mật</li>
                <li>Chọn "Cookie và dữ liệu trang web khác"</li>
                <li>Chọn tùy chọn phù hợp với bạn</li>
              </ol>
            </div>

            <div className="highlight-box">
              <h4>🦊 Firefox</h4>
              <ol>
                <li>Mở Firefox → Tùy chọn → Quyền riêng tư & Bảo mật</li>
                <li>Trong phần "Cookie và dữ liệu trang web"</li>
                <li>Chọn mức độ bảo vệ phù hợp</li>
              </ol>
            </div>

            <div className="highlight-box">
              <h4>🧭 Safari</h4>
              <ol>
                <li>Mở Safari → Tùy chọn → Quyền riêng tư</li>
                <li>Trong phần "Cookie và dữ liệu website"</li>
                <li>Chọn mức độ chặn phù hợp</li>
              </ol>
            </div>

            <div className="highlight-box">
              <h4>📱 Mobile Safari (iOS)</h4>
              <ol>
                <li>Cài đặt → Safari → Quyền riêng tư & Bảo mật</li>
                <li>Bật/tắt "Chặn tất cả cookie"</li>
                <li>Cài đặt "Ngăn Cross-Site Tracking"</li>
              </ol>
            </div>

            <h3>4.2. Trung tâm quản lý cookie PhoneStore</h3>
            <div className="important-notice">
              <i className="fas fa-cog notice-icon"></i>
              <p>
                Bạn có thể quản lý tùy chọn cookie trực tiếp trên website thông
                qua banner cookie hoặc truy cập trang Cài đặt cookie trong tài
                khoản cá nhân.
              </p>
            </div>

            <h3>4.3. Opt-out cho quảng cáo</h3>
            <p>Để từ chối quảng cáo cá nhân hóa:</p>
            <ul>
              <li>
                <strong>Google Ads:</strong>{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener"
                >
                  Google Ads Settings
                </a>
              </li>
              <li>
                <strong>Facebook Ads:</strong>{" "}
                <a
                  href="https://www.facebook.com/ads/preferences"
                  target="_blank"
                  rel="noopener"
                >
                  Facebook Ad Preferences
                </a>
              </li>
              <li>
                <strong>NAI Opt-out:</strong>{" "}
                <a
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noopener"
                >
                  Network Advertising Initiative
                </a>
              </li>
              <li>
                <strong>DAA Opt-out:</strong>{" "}
                <a
                  href="https://optout.aboutads.info"
                  target="_blank"
                  rel="noopener"
                >
                  Digital Advertising Alliance
                </a>
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Tác Động Khi Tắt Cookie</h2>

            <div className="important-notice">
              <i className="fas fa-exclamation-triangle notice-icon"></i>
              <p>
                Việc tắt cookie có thể ảnh hưởng đến trải nghiệm sử dụng
                website. Dưới đây là những gì có thể xảy ra:
              </p>
            </div>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Loại Cookie bị tắt</th>
                  <th>Tác động</th>
                  <th>Mức độ ảnh hưởng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cookie cần thiết</td>
                  <td>Website có thể không hoạt động đúng</td>
                  <td>
                    <span style={{ color: "#dc3545" }}>Cao</span>
                  </td>
                </tr>
                <tr>
                  <td>Cookie chức năng</td>
                  <td>Mất các tính năng cá nhân hóa</td>
                  <td>
                    <span style={{ color: "#ffc107" }}>Trung bình</span>
                  </td>
                </tr>
                <tr>
                  <td>Cookie hiệu suất</td>
                  <td>Chúng tôi không thể cải thiện website</td>
                  <td>
                    <span style={{ color: "#28a745" }}>Thấp</span>
                  </td>
                </tr>
                <tr>
                  <td>Cookie tiếp thị</td>
                  <td>Quảng cáo ít phù hợp hơn</td>
                  <td>
                    <span style={{ color: "#28a745" }}>Thấp</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>5.1. Tính năng có thể bị ảnh hưởng</h3>
            <ul>
              <li>🛒 Giỏ hàng có thể bị xóa khi đóng trình duyệt</li>
              <li>🔐 Phải đăng nhập lại mỗi lần truy cập</li>
              <li>⚙️ Cài đặt ngôn ngữ/tiền tệ không được lưu</li>
              <li>📋 Danh sách sản phẩm yêu thích bị mất</li>
              <li>🔍 Lịch sử tìm kiếm không được ghi nhớ</li>
              <li>💬 Chat hỗ trợ có thể không hoạt động tối ưu</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Bảo Mật Cookie</h2>

            <h3>6.1. Các biện pháp bảo mật</h3>
            <div className="highlight-box">
              <h4>🔒 Chúng tôi bảo vệ cookie của bạn bằng cách:</h4>
              <ul>
                <li>
                  <strong>HTTPS:</strong> Tất cả cookie được truyền qua kết nối
                  mã hóa
                </li>
                <li>
                  <strong>Secure flag:</strong> Cookie chỉ được gửi qua HTTPS
                </li>
                <li>
                  <strong>HttpOnly flag:</strong> Cookie không thể truy cập bằng
                  JavaScript
                </li>
                <li>
                  <strong>SameSite:</strong> Ngăn chặn tấn công CSRF
                </li>
                <li>
                  <strong>Expiration:</strong> Cookie tự động hết hạn sau thời
                  gian nhất định
                </li>
              </ul>
            </div>

            <h3>6.2. Thông tin nhạy cảm</h3>
            <p>
              Chúng tôi <strong>KHÔNG BAO GIỜ</strong> lưu trữ những thông tin
              sau trong cookie:
            </p>
            <ul>
              <li>❌ Mật khẩu hoặc thông tin đăng nhập</li>
              <li>❌ Số thẻ tín dụng hoặc thông tin thanh toán</li>
              <li>❌ Số CMND/CCCD hoặc giấy tờ tùy thân</li>
              <li>❌ Thông tin y tế hoặc sức khỏe</li>
              <li>❌ Dữ liệu tài chính cá nhân</li>
            </ul>

            <h3>6.3. Phát hiện và báo cáo sự cố</h3>
            <div className="important-notice">
              <i className="fas fa-shield-alt notice-icon"></i>
              <p>
                Nếu bạn phát hiện hoạt động bất thường liên quan đến cookie hoặc
                lo ngại về bảo mật, vui lòng liên hệ ngay với chúng tôi qua
                email: security@phonestore.vn
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>7. Cookie Trên Thiết Bị Di Động</h2>

            <h3>7.1. Mobile web browser</h3>
            <p>
              Cookie hoạt động tương tự trên thiết bị di động như trên máy tính.
              Bạn có thể quản lý cookie thông qua cài đặt trình duyệt di động.
            </p>

            <h3>7.2. Ứng dụng di động</h3>
            <p>
              Nếu chúng tôi phát triển ứng dụng di động, chúng tôi có thể sử
              dụng các công nghệ tương tự cookie như:
            </p>
            <ul>
              <li>
                <strong>Local Storage:</strong> Lưu trữ dữ liệu cục bộ trên
                thiết bị
              </li>
              <li>
                <strong>Session Storage:</strong> Lưu trữ tạm thời trong phiên
                sử dụng
              </li>
              <li>
                <strong>App Cache:</strong> Cache dữ liệu để cải thiện hiệu suất
              </li>
              <li>
                <strong>Push Tokens:</strong> Để gửi thông báo đẩy
              </li>
            </ul>

            <h3>7.3. Advertising ID</h3>
            <div className="highlight-box">
              <h4>📱 Định danh quảng cáo di động</h4>
              <p>
                Trên thiết bị di động, chúng tôi có thể sử dụng Advertising ID
                (iOS) hoặc Google Advertising ID (Android) để cung cấp quảng cáo
                phù hợp. Bạn có thể tắt tính năng này trong cài đặt thiết bị.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>8. Quyền Của Bạn</h2>

            <h3>8.1. Quyền truy cập và kiểm soát</h3>
            <p>Bạn có quyền:</p>
            <ul>
              <li>
                ✅ <strong>Biết:</strong> Cookie nào được sử dụng và mục đích
              </li>
              <li>
                ✅ <strong>Chọn:</strong> Loại cookie nào được phép
              </li>
              <li>
                ✅ <strong>Thay đổi:</strong> Tùy chọn cookie bất kỳ lúc nào
              </li>
              <li>
                ✅ <strong>Xóa:</strong> Cookie đã được lưu trữ
              </li>
              <li>
                ✅ <strong>Từ chối:</strong> Cookie không cần thiết
              </li>
            </ul>

            <h3>8.2. Cách thực hiện quyền</h3>
            <div className="highlight-box">
              <h4>🛠️ Để thực hiện các quyền của bạn:</h4>
              <ol>
                <li>Sử dụng cài đặt cookie trên website</li>
                <li>Quản lý thông qua cài đặt trình duyệt</li>
                <li>Liên hệ với chúng tôi qua email</li>
                <li>Sử dụng công cụ opt-out của bên thứ ba</li>
              </ol>
            </div>

            <h3>8.3. Hỗ trợ và tư vấn</h3>
            <p>
              Nếu bạn cần hỗ trợ về cài đặt cookie hoặc có câu hỏi về chính sách
              này, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Cập Nhật Chính Sách</h2>
            <p>Chính sách cookie này có thể được cập nhật để phản ánh:</p>
            <ul>
              <li>🔄 Thay đổi trong công nghệ cookie</li>
              <li>📝 Cập nhật luật pháp về quyền riêng tư</li>
              <li>🆕 Tính năng mới của website</li>
              <li>💡 Phản hồi từ người dùng</li>
            </ul>

            <div className="important-notice">
              <i className="fas fa-bell notice-icon"></i>
              <p>
                Khi có thay đổi quan trọng, chúng tôi sẽ thông báo thông qua
                banner trên website hoặc email. Ngày cập nhật cuối cùng được
                hiển thị ở cuối trang này.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>10. Liên Hệ</h2>
            <p>
              Nếu bạn có câu hỏi về chính sách cookie này hoặc muốn thực hiện
              quyền của mình:
            </p>

            <div className="contact-info">
              <h3>Bộ phận bảo vệ dữ liệu</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>privacy@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234 (phím 3)</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <span>8:00 - 22:00 hàng ngày</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
              <p style={{ marginTop: "1rem", color: "#6c757d" }}>
                Chúng tôi cam kết trả lời trong vòng 24 giờ cho các yêu cầu về
                cookie và quyền riêng tư.
              </p>
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Cập nhật lần cuối: 01/10/2025 | Phiên bản: 1.2
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
