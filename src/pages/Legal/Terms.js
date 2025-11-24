import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <h1>
            <i className="fas fa-file-contract"></i> Điều Khoản Dịch Vụ
          </h1>
          <p className="subtitle">
            Các điều khoản và điều kiện sử dụng dịch vụ mua sắm trực tuyến tại
            PhoneStore
          </p>
        </div>

        {/* Navigation */}
        <div className="legal-navigation">
          <h4>Trang pháp lý khác</h4>
          <div className="legal-nav-links">
            <Link to="/privacy">Chính sách bảo mật</Link>
            <Link to="/cookies">Chính sách Cookie</Link>
            <Link to="/warranty">Chính sách bảo hành</Link>
            <Link to="/return-policy">Đổi trả - Hoàn tiền</Link>
            <Link to="/shipping">Chính sách giao hàng</Link>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Giới Thiệu và Chấp Nhận</h2>
            <p>
              Chào mừng bạn đến với PhoneStore! Các điều khoản dịch vụ này
              ("Điều khoản") điều chỉnh việc sử dụng website, ứng dụng di động
              và các dịch vụ liên quan của PhoneStore (gọi chung là "Dịch vụ").
            </p>
            <div className="important-notice">
              <i className="fas fa-exclamation-triangle notice-icon"></i>
              <p>
                Bằng cách truy cập và sử dụng Dịch vụ của chúng tôi, bạn đồng ý
                tuân thủ và bị ràng buộc bởi các Điều khoản này.
              </p>
            </div>
            <p>
              Nếu bạn không đồng ý với bất kỳ phần nào của các Điều khoản này,
              vui lòng không sử dụng Dịch vụ của chúng tôi.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Định Nghĩa</h2>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Thuật ngữ</th>
                  <th>Định nghĩa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>"PhoneStore", "chúng tôi", "của chúng tôi"</strong>
                  </td>
                  <td>Công ty TNHH PhoneStore và các chi nhánh liên kết</td>
                </tr>
                <tr>
                  <td>
                    <strong>"Khách hàng", "bạn", "của bạn"</strong>
                  </td>
                  <td>Cá nhân hoặc tổ chức sử dụng Dịch vụ của chúng tôi</td>
                </tr>
                <tr>
                  <td>
                    <strong>"Dịch vụ"</strong>
                  </td>
                  <td>
                    Website, ứng dụng và các dịch vụ thương mại điện tử của
                    PhoneStore
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>"Sản phẩm"</strong>
                  </td>
                  <td>
                    Điện thoại, phụ kiện và các sản phẩm công nghệ được bán trên
                    nền tảng
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>"Đơn hàng"</strong>
                  </td>
                  <td>Yêu cầu mua hàng được đặt thông qua Dịch vụ</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="legal-section">
            <h2>3. Điều Kiện Sử Dụng</h2>

            <h3>3.1. Độ tuổi và năng lực pháp lý</h3>
            <ul>
              <li>
                Bạn phải đủ 18 tuổi hoặc đủ tuổi thành niên theo pháp luật tại
                nước bạn cư trú
              </li>
              <li>
                Nếu dưới 18 tuổi, bạn phải có sự giám sát và đồng ý của phụ
                huynh/người giám hộ
              </li>
              <li>Bạn phải có năng lực pháp lý để ký kết hợp đồng</li>
              <li>
                Bạn không được nằm trong danh sách cấm của bất kỳ cơ quan chính
                phủ nào
              </li>
            </ul>

            <h3>3.2. Tài khoản người dùng</h3>
            <div className="highlight-box">
              <h4>Trách nhiệm của bạn:</h4>
              <ul>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                <li>
                  Bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt
                  động
                </li>
                <li>
                  Thông báo ngay cho chúng tôi nếu phát hiện tài khoản bị sử
                  dụng trái phép
                </li>
                <li>Chỉ tạo và sử dụng một tài khoản cho mục đích cá nhân</li>
              </ul>
            </div>

            <h3>3.3. Hành vi cấm</h3>
            <p>Bạn không được:</p>
            <ul>
              <li>Sử dụng Dịch vụ cho mục đích bất hợp pháp hoặc trái phép</li>
              <li>Cung cấp thông tin sai lệch hoặc gian lận</li>
              <li>
                Xâm phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba
              </li>
              <li>Tải lên virus, malware hoặc mã độc hại</li>
              <li>Sử dụng robot, spider hoặc công cụ tự động khác</li>
              <li>Can thiệp hoặc gây gián đoạn hoạt động của Dịch vụ</li>
              <li>Thu thập thông tin người dùng khác mà không có sự đồng ý</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Sản Phẩm và Dịch Vụ</h2>

            <h3>4.1. Thông tin sản phẩm</h3>
            <p>
              Chúng tôi nỗ lực cung cấp thông tin sản phẩm chính xác, tuy nhiên:
            </p>
            <ul>
              <li>
                Màu sắc thực tế có thể khác với hình ảnh do màn hình hiển thị
              </li>
              <li>Thông số kỹ thuật có thể thay đổi theo từng phiên bản</li>
              <li>Tình trạng hàng tồn kho được cập nhật theo thời gian thực</li>
              <li>Chúng tôi có quyền ngừng kinh doanh bất kỳ sản phẩm nào</li>
            </ul>

            <h3>4.2. Tính sẵn có của sản phẩm</h3>
            <div className="highlight-box">
              <h4>Lưu ý quan trọng:</h4>
              <p>
                Tất cả sản phẩm tùy thuộc vào tình trạng có hàng. Trong trường
                hợp sản phẩm hết hàng sau khi đặt hàng, chúng tôi sẽ liên hệ để
                thông báo và hoàn tiền nếu cần thiết.
              </p>
            </div>

            <h3>4.3. Giá cả</h3>
            <ul>
              <li>Tất cả giá đều bao gồm VAT (trừ khi có ghi chú khác)</li>
              <li>Giá có thể thay đổi mà không cần thông báo trước</li>
              <li>
                Chúng tôi không chịu trách nhiệm về lỗi hiển thị giá do kỹ thuật
              </li>
              <li>Giá được áp dụng tại thời điểm xác nhận đơn hàng</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Quy Trình Đặt Hàng</h2>

            <h3>5.1. Đặt hàng</h3>
            <ol>
              <li>
                <strong>Chọn sản phẩm:</strong> Thêm sản phẩm vào giỏ hàng
              </li>
              <li>
                <strong>Xem lại giỏ hàng:</strong> Kiểm tra sản phẩm và số lượng
              </li>
              <li>
                <strong>Thanh toán:</strong> Cung cấp thông tin giao hàng và
                thanh toán
              </li>
              <li>
                <strong>Xác nhận:</strong> Nhận email xác nhận đơn hàng
              </li>
              <li>
                <strong>Xử lý:</strong> Chúng tôi xử lý và giao hàng
              </li>
            </ol>

            <h3>5.2. Xác nhận đơn hàng</h3>
            <p>Đơn hàng chỉ được coi là được xác nhận sau khi:</p>
            <ul>
              <li>Bạn nhận được email xác nhận từ chúng tôi</li>
              <li>Thanh toán được xử lý thành công (nếu thanh toán trước)</li>
              <li>Sản phẩm có sẵn trong kho</li>
              <li>Vượt qua kiểm tra bảo mật và chống gian lận</li>
            </ul>

            <h3>5.3. Từ chối đơn hàng</h3>
            <div className="highlight-box">
              <h4>
                Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong các trường
                hợp:
              </h4>
              <ul>
                <li>Sản phẩm không còn sẵn có</li>
                <li>Thông tin thanh toán không hợp lệ</li>
                <li>Phát hiện hoạt động gian lận</li>
                <li>Lỗi giá hoặc thông tin sản phẩm</li>
                <li>Vi phạm các điều khoản này</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>6. Thanh Toán</h2>

            <h3>6.1. Phương thức thanh toán</h3>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Phương thức</th>
                  <th>Mô tả</th>
                  <th>Thời gian xử lý</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chuyển khoản ngân hàng</td>
                  <td>Chuyển khoản qua VietQR</td>
                  <td>Tức thì - 2h</td>
                </tr>
                <tr>
                  <td>Ví điện tử</td>
                  <td>MoMo, ZaloPay, VNPay</td>
                  <td>Tức thì</td>
                </tr>
                <tr>
                  <td>Thanh toán khi nhận hàng (COD)</td>
                  <td>Trả tiền mặt khi giao hàng</td>
                  <td>Khi giao hàng</td>
                </tr>
                <tr>
                  <td>Trả góp</td>
                  <td>Qua đối tác tài chính</td>
                  <td>1-3 ngày</td>
                </tr>
              </tbody>
            </table>

            <h3>6.2. Bảo mật thanh toán</h3>
            <ul>
              <li>Tất cả giao dịch được mã hóa SSL 256-bit</li>
              <li>Chúng tôi không lưu trữ thông tin thẻ tín dụng</li>
              <li>Tuân thủ tiêu chuẩn PCI DSS</li>
              <li>Xác thực 3D Secure cho thẻ quốc tế</li>
            </ul>

            <h3>6.3. Hóa đơn và chứng từ</h3>
            <p>
              Chúng tôi cung cấp hóa đơn VAT theo quy định pháp luật. Khách hàng
              cần cung cấp thông tin xuất hóa đơn chính xác khi đặt hàng.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Giao Hàng</h2>

            <h3>7.1. Khu vực giao hàng</h3>
            <ul>
              <li>
                <strong>Nội thành TP.HCM & Hà Nội:</strong> Giao trong ngày
              </li>
              <li>
                <strong>Các tỉnh thành khác:</strong> 1-3 ngày làm việc
              </li>
              <li>
                <strong>Vùng sâu vùng xa:</strong> 3-7 ngày làm việc
              </li>
              <li>
                <strong>Không giao hàng:</strong> Một số khu vực đặc biệt
              </li>
            </ul>

            <h3>7.2. Phí giao hàng</h3>
            <div className="highlight-box">
              <h4>Chính sách phí giao hàng:</h4>
              <ul>
                <li>Miễn phí giao hàng cho đơn từ 500.000đ</li>
                <li>Phí cố định 30.000đ cho đơn dưới 500.000đ</li>
                <li>Phí đặc biệt cho vùng xa và hàng nặng</li>
                <li>Miễn phí lắp đặt cho sản phẩm lớn</li>
              </ul>
            </div>

            <h3>7.3. Nhận hàng</h3>
            <p>Khi nhận hàng, bạn cần:</p>
            <ul>
              <li>Kiểm tra tình trạng bao bì và sản phẩm</li>
              <li>Ký xác nhận nhận hàng</li>
              <li>Thanh toán (nếu chọn COD)</li>
              <li>Báo ngay nếu có vấn đề về sản phẩm</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Bảo Hành và Hậu Mãi</h2>

            <h3>8.1. Chính sách bảo hành</h3>
            <ul>
              <li>Bảo hành chính hãng theo quy định nhà sản xuất</li>
              <li>Hỗ trợ bảo hành tận nơi cho một số sản phẩm</li>
              <li>Đổi mới trong 7 ngày đầu nếu có lỗi từ nhà sản xuất</li>
              <li>Hỗ trợ kỹ thuật suốt thời gian sử dụng</li>
            </ul>

            <h3>8.2. Dịch vụ hậu mãi</h3>
            <div className="highlight-box">
              <h4>Chúng tôi cung cấp:</h4>
              <ul>
                <li>Tư vấn sử dụng sản phẩm</li>
                <li>Hướng dẫn cài đặt và bảo mật</li>
                <li>Sửa chữa và thay thế linh kiện</li>
                <li>Trade-in (thu cũ đổi mới)</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>9. Trách Nhiệm và Giới Hạn</h2>

            <h3>9.1. Giới hạn trách nhiệm</h3>
            <p>
              Trong phạm vi pháp luật cho phép, trách nhiệm của chúng tôi được
              giới hạn trong:
            </p>
            <ul>
              <li>Giá trị sản phẩm đã mua</li>
              <li>Thiệt hại trực tiếp do lỗi của chúng tôi</li>
              <li>Không bao gồm thiệt hại gián tiếp, mất mát cơ hội</li>
              <li>Không bao gồm thiệt hại do sử dụng sai mục đích</li>
            </ul>

            <h3>9.2. Bảo hiểm và miễn trừ</h3>
            <div className="important-notice">
              <i className="fas fa-shield-alt notice-icon"></i>
              <p>
                Khách hàng đồng ý bảo vệ và miễn trừ PhoneStore khỏi mọi khiếu
                nại, tổn thất phát sinh từ việc vi phạm các điều khoản này hoặc
                sử dụng sai mục đích sản phẩm.
              </p>
            </div>

            <h3>9.3. Bất khả kháng</h3>
            <p>
              Chúng tôi không chịu trách nhiệm cho việc chậm trễ hoặc không thực
              hiện được nghĩa vụ do các sự kiện bất khả kháng như thiên tai,
              chiến tranh, dịch bệnh, hay quy định của cơ quan nhà nước.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Sở Hữu Trí Tuệ</h2>

            <h3>10.1. Quyền sở hữu của PhoneStore</h3>
            <ul>
              <li>Tên thương hiệu, logo, thiết kế website</li>
              <li>Nội dung, hình ảnh, video do chúng tôi tạo ra</li>
              <li>Phần mềm, mã nguồn của website và ứng dụng</li>
              <li>Dữ liệu khách hàng và phân tích kinh doanh</li>
            </ul>

            <h3>10.2. Quyền sử dụng của khách hàng</h3>
            <p>
              Chúng tôi cấp cho bạn quyền sử dụng hạn chế, không độc quyền,
              không thể chuyển nhượng để:
            </p>
            <ul>
              <li>Truy cập và sử dụng Dịch vụ cho mục đích cá nhân</li>
              <li>Tải xuống và in thông tin cho sử dụng cá nhân</li>
              <li>Chia sẻ thông tin sản phẩm cho mục đích giới thiệu</li>
            </ul>

            <h3>10.3. Nội dung do người dùng tạo</h3>
            <div className="highlight-box">
              <h4>Khi bạn đăng đánh giá, bình luận hoặc nội dung khác:</h4>
              <ul>
                <li>Bạn vẫn sở hữu bản quyền nội dung của mình</li>
                <li>
                  Bạn cấp cho chúng tôi quyền sử dụng, hiển thị, phân phối
                </li>
                <li>Nội dung phải tuân thủ quy tắc cộng đồng</li>
                <li>Chúng tôi có quyền xóa nội dung vi phạm</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>11. Chấm Dứt Dịch Vụ</h2>

            <h3>11.1. Chấm dứt bởi khách hàng</h3>
            <p>Bạn có thể chấm dứt sử dụng dịch vụ bằng cách:</p>
            <ul>
              <li>Ngừng truy cập và sử dụng website</li>
              <li>Xóa tài khoản thông qua cài đặt</li>
              <li>Liên hệ với bộ phận hỗ trợ</li>
            </ul>

            <h3>11.2. Chấm dứt bởi PhoneStore</h3>
            <p>
              Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu:
            </p>
            <ul>
              <li>Vi phạm các điều khoản này</li>
              <li>Hoạt động gian lận hoặc bất hợp pháp</li>
              <li>Gây hại đến hệ thống hoặc người dùng khác</li>
              <li>Không sử dụng trong thời gian dài</li>
            </ul>

            <h3>11.3. Hậu quả của việc chấm dứt</h3>
            <div className="highlight-box">
              <h4>Khi tài khoản bị chấm dứt:</h4>
              <ul>
                <li>Quyền truy cập sẽ bị thu hồi ngay lập tức</li>
                <li>Đơn hàng đang xử lý vẫn được hoàn thành</li>
                <li>Bảo hành sản phẩm vẫn có hiệu lực</li>
                <li>Dữ liệu có thể được xóa sau 30 ngày</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <h2>12. Luật Áp Dụng và Giải Quyết Tranh Chấp</h2>

            <h3>12.1. Luật áp dụng</h3>
            <p>
              Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Bất kỳ
              tranh chấp nào phát sinh sẽ được giải quyết theo quy định của pháp
              luật Việt Nam.
            </p>

            <h3>12.2. Giải quyết tranh chấp</h3>
            <ol>
              <li>
                <strong>Thương lượng trực tiếp:</strong> Liên hệ bộ phận chăm
                sóc khách hàng
              </li>
              <li>
                <strong>Hòa giải:</strong> Thông qua trung tâm hòa giải có thẩm
                quyền
              </li>
              <li>
                <strong>Tòa án:</strong> Tòa án có thẩm quyền tại TP. Hồ Chí
                Minh
              </li>
            </ol>

            <h3>12.3. Thời hiệu khiếu nại</h3>
            <div className="important-notice">
              <i className="fas fa-clock notice-icon"></i>
              <p>
                Mọi khiếu nại liên quan đến sản phẩm hoặc dịch vụ phải được
                thông báo trong vòng 30 ngày kể từ khi phát sinh vấn đề.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>13. Cập Nhật Điều Khoản</h2>
            <p>Chúng tôi có thể cập nhật các Điều khoản này để phản ánh:</p>
            <ul>
              <li>Thay đổi trong dịch vụ hoặc sản phẩm</li>
              <li>Cập nhật luật pháp và quy định</li>
              <li>Cải thiện trải nghiệm khách hàng</li>
              <li>Phản hồi từ người dùng và thị trường</li>
            </ul>
            <p>
              Phiên bản mới sẽ có hiệu lực ngay khi được đăng tải. Việc tiếp tục
              sử dụng dịch vụ sau khi cập nhật có nghĩa là bạn chấp nhận điều
              khoản mới.
            </p>
          </div>

          <div className="legal-section">
            <h2>14. Thông Tin Liên Hệ</h2>
            <p>
              Nếu có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ:
            </p>

            <div className="contact-info">
              <h3>Thông tin công ty</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-building"></i>
                  <span>Công ty TNHH PhoneStore</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-id-card"></i>
                  <span>MST: 0123456789</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>legal@phonestore.vn</span>
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
            </div>
          </div>

          <div className="last-updated">
            <i className="fas fa-calendar-alt"></i>
            Phiên bản: 2.1 | Cập nhật lần cuối: 01/10/2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
