# 📱 HỆ THỐNG BÁN ĐIỆN THOẠI TRỰC TUYẾN

Dự án website bán điện thoại và phụ kiện điện tử được xây dựng bằng ReactJS với đầy đủ tính năng quản lý sản phẩm, đơn hàng và người dùng.

## 🎯 Tính năng chính

### Khách hàng

- 🏠 **Trang chủ**: Hiển thị sản phẩm nổi bật, mới nhất, khuyến mãi
- 🛍️ **Danh mục sản phẩm**: Lọc theo hãng, giá, cấu hình
- 🔍 **Tìm kiếm**: Tìm kiếm sản phẩm theo tên, thương hiệu
- 📦 **Chi tiết sản phẩm**: Thông số kỹ thuật, ảnh, đánh giá
- ⭐ **Đánh giá & Bình luận**: Khách hàng có thể đánh giá và bình luận sản phẩm
- 🛒 **Giỏ hàng**: Thêm, xóa, cập nhật số lượng
- 💳 **Thanh toán**: Đặt hàng và thanh toán online
- 📄 **Đơn hàng**: Theo dõi trạng thái đơn hàng
- 🏦 **Trả góp**: Tính toán và đăng ký trả góp
- 🛡️ **Bảo hành**: Thông tin chính sách bảo hành
- 📰 **Tin tức**: Tin tức công nghệ, review sản phẩm
- 💬 **Hỗ trợ**: Liên hệ hỗ trợ khách hàng

### Quản trị Admin

- 📊 **Dashboard**: Thống kê doanh thu, đơn hàng, sản phẩm
- 📦 **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm, quản lý kho
- 🏷️ **Quản lý thương hiệu & danh mục**: Quản lý brands và categories
- 📋 **Quản lý đơn hàng**: Xem và cập nhật trạng thái đơn hàng
- 💬 **Quản lý đánh giá**: Trả lời, xóa bình luận khách hàng
- 👥 **Quản lý người dùng**: Quản lý tài khoản khách hàng
- 🎨 **Quản lý Banner/Slider**: Cập nhật hình ảnh trang chủ

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js phiên bản 14.x trở lên
- npm hoặc yarn

### Cài đặt dự án

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd phone

# Cài đặt dependencies
npm install
```

### Cấu hình

1. Kiểm tra file cấu hình API trong `src/shared/constants/app.js`:

```javascript
export const BASE_API = "http://localhost:5000/api";
```

2. Đảm bảo Backend API đã được khởi động và chạy ở cổng 5000

## 📝 Các lệnh có sẵn

### `npm start`

Chạy ứng dụng ở chế độ phát triển.\
Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để xem website.

Trang web sẽ tự động reload khi bạn thay đổi code.\
Các lỗi lint cũng sẽ hiển thị trong console.

**Tài khoản demo:**

- Admin: `admin@phone.com` / `admin123`
- Khách hàng: Đăng ký tài khoản mới

### `npm test`

Chạy test runner ở chế độ interactive watch.\
Xem thêm thông tin về [chạy tests](https://facebook.github.io/create-react-app/docs/running-tests).


## 🏗️ Cấu trúc dự án

```
phone/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   ├── css/               # Global CSS
│   ├── images/            # Hình ảnh tĩnh
│   └── js/                # Bootstrap, jQuery
├── src/
│   ├── pages/             # Các trang của ứng dụng
│   │   ├── Home/          # Trang chủ
│   │   ├── Products/      # Danh sách sản phẩm
│   │   ├── ProductDetails/# Chi tiết sản phẩm
│   │   ├── Cart/          # Giỏ hàng
│   │   ├── Payment/       # Thanh toán
│   │   ├── OrderList/     # Danh sách đơn hàng
│   │   ├── Admin/         # Quản trị
│   │   │   ├── components/# ProductList, OrderList, ReviewList...
│   │   │   └── styles/    # CSS cho admin
│   │   └── ...
│   ├── services/          # API services
│   │   ├── Api.js         # Các API calls
│   │   └── Http.js        # Axios instance
│   ├── shared/            # Shared components & utils
│   │   ├── components/    # Header, Footer, Sidebar...
│   │   ├── constants/     # Hằng số
│   │   └── utils/         # Utility functions
│   ├── redux-setup/       # Redux store & reducers
│   ├── routers/           # Route configuration
│   ├── App.js             # Root component
│   └── index.js           # Entry point
└── package.json           # Dependencies
```

## 🎨 Công nghệ sử dụng

- **ReactJS** - Library UI
- **React Router** - Điều hướng
- **Redux** - Quản lý state
- **Axios** - HTTP client
- **Bootstrap** - CSS framework
- **Font Awesome** - Icons
- **Create React App** - Build tool

## 📡 Kết nối Backend

Dự án này cần kết nối với Backend API. Đảm bảo:

1. Backend đang chạy ở `http://localhost:5000`
2. Các endpoint API hoạt động bình thường
3. CORS đã được cấu hình đúng


## 🔧 Xử lý lỗi thường gặp

### Lỗi kết nối API

```
Error: Network Error
```

**Giải pháp**: Kiểm tra Backend có đang chạy không, kiểm tra `BASE_API` trong `constants/server.js`

### Lỗi CORS

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Giải pháp**: Cấu hình CORS trong Backend Express app

### Lỗi dependencies

```
npm ERR! peer dependency missing
```

## 👨‍💻 Phát triển

### Thêm tính năng mới

1. Tạo component mới trong `src/pages/` hoặc `src/shared/components/`
2. Tạo CSS tương ứng
3. Thêm route trong `src/routers/index.js`
4. Thêm API call trong `src/services/Api.js` nếu cần

### Coding conventions

- Component names: PascalCase (VD: `ProductList.jsx`)
- File CSS: Cùng tên với component
- Sử dụng functional components với hooks
- CSS scoped với tên class bắt đầu bằng tên component

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng tạo pull request hoặc báo cáo issues.

---

**Phát triển bởi**: Quang Nguyễn
**Năm**: 2026
**Mục đích**: Đồ án tốt nghiệp
