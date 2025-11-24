import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-shield-alt"></i> Chính Sách Bảo Mật
          </h1>
          <p className="subtitle">
            PhoneStore cam kết bảo vệ thông tin cá nhân của khách hàng theo các
            tiêu chuẩn bảo mật cao nhất
          </p>
        </div>

        {/* Navigation */}
        <div className="legal-navigation">
          <h4>Trang pháp lý khác</h4>
          <div className="legal-nav-links">
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
            <h2>1. Giới Thiệu</h2>
            <p>
              PhoneStore ("chúng tôi", "của chúng tôi") tôn trọng quyền riêng tư
              của bạn và cam kết bảo vệ thông tin cá nhân mà bạn chia sẻ với
              chúng tôi. Chính sách bảo mật này mô tả cách chúng tôi thu thập,
              sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng
              website và dịch vụ của chúng tôi.
            </p>
            <div className="important-notice">
              <i className="fas fa-exclamation-triangle notice-icon"></i>
              <p>
                Bằng cách sử dụng website của chúng tôi, bạn đồng ý với các điều
                khoản trong chính sách bảo mật này.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>2. Thông Tin Chúng Tôi Thu Thập</h2>

            <h3>2.1. Thông tin cá nhân</h3>
            <p>Chúng tôi có thể thu thập các thông tin sau từ bạn:</p>
            <ul>
              <li>
                <strong>Thông tin định danh:</strong> Họ tên, email, số điện
                thoại, địa chỉ
              </li>
              <li>
                <strong>Thông tin tài khoản:</strong> Tên đăng nhập, mật khẩu
                (đã mã hóa)
              </li>
              <li>
                <strong>Thông tin giao dịch:</strong> Lịch sử mua hàng, thông
                tin thanh toán
              </li>
              <li>
                <strong>Thông tin liên lạc:</strong> Lịch sử chat, email, cuộc
                gọi hỗ trợ
              </li>
            </ul>

            <h3>2.2. Thông tin kỹ thuật</h3>
            <ul>
              <li>
                <strong>Thông tin thiết bị:</strong> Địa chỉ IP, loại browser,
                hệ điều hành
              </li>
              <li>
                <strong>Dữ liệu sử dụng:</strong> Trang web được truy cập, thời
                gian truy cập
              </li>
              <li>
                <strong>Cookie và tracking:</strong> Dữ liệu từ cookie và công
                nghệ tương tự
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Mục Đích Sử Dụng Thông Tin</h2>
            <p>Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:</p>

            <div className="highlight-box">
              <h4>Cung cấp dịch vụ</h4>
              <ul>
                <li>Xử lý đơn hàng và giao hàng</li>
                <li>Cung cấp hỗ trợ khách hàng</li>
                <li>Quản lý tài khoản người dùng</li>
                <li>Xác thực danh tính và bảo mật</li>
              </ul>
            </div>

            <div className="highlight-box">
              <h4>Cải thiện dịch vụ</h4>
              <ul>
                <li>Phân tích hành vi người dùng</li>
                <li>Cải thiện website và trải nghiệm người dùng</li>
                <li>Phát triển sản phẩm và dịch vụ mới</li>
                <li>Nghiên cứu thị trường</li>
              </ul>
            </div>

            <div className="highlight-box">
              <h4>Marketing và quảng cáo</h4>
              <ul>
                <li>Gửi thông tin khuyến mãi (với sự đồng ý)</li>
                <li>Quảng cáo có mục tiêu</li>
                <li>Newsletter và cập nhật sản phẩm</li>
                <li>Chương trình khách hàng thân thiết</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>4. Chia Sẻ Thông Tin</h2>
            <p>
              Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn. Tuy
              nhiên, chúng tôi có thể chia sẻ thông tin trong các trường hợp
              sau:
            </p>

            <table className="legal-table">
              <thead>
                <tr>
                  <th>Đối tượng</th>
                  <th>Mục đích</th>
                  <th>Loại thông tin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Đơn vị vận chuyển</td>
                  <td>Giao hàng</td>
                  <td>Tên, địa chỉ, số điện thoại</td>
                </tr>
                <tr>
                  <td>Ngân hàng/Ví điện tử</td>
                  <td>Xử lý thanh toán</td>
                  <td>Thông tin thanh toán</td>
                </tr>
                <tr>
                  <td>Cơ quan pháp luật</td>
                  <td>Tuân thủ luật pháp</td>
                  <td>Theo yêu cầu pháp lý</td>
                </tr>
                <tr>
                  <td>Đối tác kỹ thuật</td>
                  <td>Hỗ trợ IT, analytics</td>
                  <td>Dữ liệu ẩn danh</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>5. Bảo Mật Thông Tin</h2>
            <p>
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo
              vệ thông tin của bạn:
            </p>

            <h3>5.1. Bảo mật kỹ thuật</h3>
            <ul>
              <li>
                <strong>Mã hóa SSL/TLS:</strong> Tất cả dữ liệu được mã hóa khi
                truyền
              </li>
              <li>
                <strong>Mã hóa database:</strong> Thông tin nhạy cảm được mã hóa
                khi lưu trữ
              </li>
              <li>
                <strong>Firewall và IDS:</strong> Hệ thống phát hiện và ngăn
                chặn xâm nhập
              </li>
              <li>
                <strong>Cập nhật bảo mật:</strong> Thường xuyên cập nhật các bản
                vá bảo mật
              </li>
            </ul>

            <h3>5.2. Bảo mật tổ chức</h3>
            <ul>
              <li>
                <strong>Kiểm soát truy cập:</strong> Chỉ nhân viên được ủy quyền
                mới có thể truy cập
              </li>
              <li>
                <strong>Đào tạo nhân viên:</strong> Thường xuyên đào tạo về bảo
                mật thông tin
              </li>
              <li>
                <strong>Kiểm toán bảo mật:</strong> Định kỳ kiểm tra và đánh giá
                hệ thống
              </li>
              <li>
                <strong>Ứng phó sự cố:</strong> Quy trình xử lý khi có sự cố bảo
                mật
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Quyền Của Bạn</h2>
            <p>
              Theo luật pháp Việt Nam và các tiêu chuẩn quốc tế, bạn có các
              quyền sau:
            </p>

            <div className="highlight-box">
              <h4>
                <i className="fas fa-eye"></i> Quyền truy cập
              </h4>
              <p>
                Bạn có quyền biết thông tin nào được thu thập và cách sử dụng
              </p>
            </div>

            <div className="highlight-box">
              <h4>
                <i className="fas fa-edit"></i> Quyền chỉnh sửa
              </h4>
              <p>Bạn có thể yêu cầu sửa đổi thông tin không chính xác</p>
            </div>

            <div className="highlight-box">
              <h4>
                <i className="fas fa-trash"></i> Quyền xóa
              </h4>
              <p>
                Bạn có thể yêu cầu xóa thông tin cá nhân trong một số trường hợp
              </p>
            </div>

            <div className="highlight-box">
              <h4>
                <i className="fas fa-download"></i> Quyền di chuyển dữ liệu
              </h4>
              <p>
                Bạn có thể yêu cầu xuất dữ liệu cá nhân ở định dạng có thể đọc
                được
              </p>
            </div>

            <div className="highlight-box">
              <h4>
                <i className="fas fa-ban"></i> Quyền từ chối
              </h4>
              <p>
                Bạn có thể từ chối nhận email marketing hoặc xử lý dữ liệu cho
                mục đích nhất định
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>7. Cookie và Công Nghệ Theo Dõi</h2>
            <p>Chúng tôi sử dụng cookie và các công nghệ tương tự để:</p>
            <ul>
              <li>Duy trì phiên đăng nhập của bạn</li>
              <li>Ghi nhớ tùy chọn và cài đặt</li>
              <li>Phân tích lưu lượng truy cập website</li>
              <li>Cung cấp quảng cáo có liên quan</li>
              <li>Cải thiện hiệu suất website</li>
            </ul>
            <p>
              Bạn có thể quản lý cookie thông qua cài đặt browser. Tuy nhiên,
              việc vô hiệu hóa cookie có thể ảnh hưởng đến trải nghiệm sử dụng
              website.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Lưu Trữ Dữ Liệu</h2>

            <h3>8.1. Thời gian lưu trữ</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Loại dữ liệu</th>
                  <th>Thời gian lưu trữ</th>
                  <th>Lý do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thông tin tài khoản</td>
                  <td>Cho đến khi tài khoản bị xóa</td>
                  <td>Cung cấp dịch vụ</td>
                </tr>
                <tr>
                  <td>Lịch sử giao dịch</td>
                  <td>5 năm</td>
                  <td>Tuân thủ luật kế toán</td>
                </tr>
                <tr>
                  <td>Log truy cập</td>
                  <td>2 năm</td>
                  <td>Bảo mật và phân tích</td>
                </tr>
                <tr>
                  <td>Dữ liệu marketing</td>
                  <td>3 năm hoặc đến khi từ chối</td>
                  <td>Marketing hợp pháp</td>
                </tr>
              </tbody>
            </table>

            <h3>8.2. Vị trí lưu trữ</h3>
            <p>
              Dữ liệu của bạn được lưu trữ tại các data center ở Việt Nam và có
              thể được sao lưu tại các vị trí quốc tế khác của các nhà cung cấp
              dịch vụ cloud đáng tin cậy.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Trẻ Em và Bảo Mật</h2>
            <p>
              Dịch vụ của chúng tôi không dành cho trẻ em dưới 16 tuổi. Chúng
              tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 16 tuổi.
              Nếu chúng tôi phát hiện đã thu thập thông tin từ trẻ em dưới 16
              tuổi, chúng tôi sẽ xóa thông tin đó ngay lập tức.
            </p>
            <p>
              Nếu bạn là phụ huynh hoặc người giám hộ và phát hiện con em mình
              đã cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ với
              chúng tôi.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Cập Nhật Chính Sách</h2>
            <p>
              Chúng tôi có thể cập nhật chính sách bảo mật này từ thời gian khác
              để phản ánh các thay đổi trong:
            </p>
            <ul>
              <li>Thực tiễn xử lý dữ liệu của chúng tôi</li>
              <li>Luật pháp và quy định hiện hành</li>
              <li>Công nghệ và tiêu chuẩn bảo mật mới</li>
              <li>Phản hồi từ khách hàng và cộng đồng</li>
            </ul>
            <p>
              Khi có thay đổi quan trọng, chúng tôi sẽ thông báo cho bạn qua
              email hoặc thông báo trên website. Việc tiếp tục sử dụng dịch vụ
              sau khi thay đổi có nghĩa là bạn chấp nhận chính sách mới.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Liên Hệ và Khiếu Nại</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi, lo ngại hoặc muốn thực hiện các quyền
              của mình liên quan đến chính sách bảo mật này, vui lòng liên hệ
              với chúng tôi:
            </p>

            <div className="contact-info">
              <h3>Thông tin liên hệ</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>privacy@phonestore.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>1900 1234</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
              <p style={{ marginTop: "1rem", color: "#6c757d" }}>
                Chúng tôi cam kết trả lời mọi yêu cầu trong vòng 5 ngày làm
                việc.
              </p>
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Cập nhật lần cuối: 01/10/2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
