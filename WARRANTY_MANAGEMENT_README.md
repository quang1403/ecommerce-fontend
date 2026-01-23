# 🛡️ Hệ thống Quản lý Bảo hành - Admin

## 📁 Cấu trúc Files đã tạo

### 1. **Utility Functions**

- `src/shared/utils/warranty.js`
  - Các helper functions: format currency, date, status, print warranty card
  - Validation functions cho phone, IMEI, email
  - Tính toán ngày còn lại

### 2. **Services**

- `src/services/warrantyService.js`
  - **Public APIs**: Tra cứu bảo hành theo mã/IMEI
  - **Admin APIs**: CRUD warranties, claims, stats
  - Tích hợp với Http.js (axios interceptor tự động thêm token)

### 3. **Admin Pages**

```
src/pages/Admin/WarrantyManagement/
├── WarrantyManagement.js    # Danh sách warranties
├── WarrantyManagement.css
├── CreateWarranty.js         # Form tạo warranty mới
├── CreateWarranty.css
├── WarrantyDetail.js         # Chi tiết warranty + claims
├── WarrantyDetail.css
├── ClaimForm.js              # Form tạo/cập nhật claim
├── ClaimForm.css
└── index.js                  # Export module
```

### 4. **Router Configuration**

- `src/routers/index.js`
  - `/admin/warranty` - Danh sách
  - `/admin/warranty/create` - Tạo mới
  - `/admin/warranty/:id` - Chi tiết
  - `/admin/warranty/:id/claim` - Tạo claim
  - `/admin/warranty/:id/claim/:claimId` - Cập nhật claim

### 5. **Navigation**

- `src/pages/Admin/components/Sidebar.jsx`
  - Thêm menu "Quản lý bảo hành" link tới `/admin/warranty`

---

## ✨ Tính năng đã implement

### 📊 Trang Danh sách Warranties

- ✅ Hiển thị thống kê tổng quan (tổng, active, expired, expiring soon, claims)
- ✅ Tìm kiếm theo mã BH, tên sản phẩm, IMEI, SĐT
- ✅ Lọc theo trạng thái (active/expired/void)
- ✅ Sắp xếp theo nhiều tiêu chí
- ✅ Pagination
- ✅ Actions: Xem chi tiết, Tạo claim, Xóa

### ➕ Form Tạo Warranty

- ✅ **Tra cứu khách hàng** theo SĐT (auto-fill thông tin nếu đã có)
- ✅ Chọn loại dịch vụ (sản phẩm mới/sửa chữa)
- ✅ Nhập thông tin sản phẩm đầy đủ (tên, màu, RAM, storage, IMEI)
- ✅ Chọn thời gian bảo hành (3/6/12/24/36 tháng hoặc tùy chỉnh)
- ✅ Validation đầy vào (phone, email, IMEI)
- ✅ **In phiếu bảo hành** sau khi tạo thành công

### 📄 Trang Chi tiết Warranty

- ✅ Status banner với màu sắc (active/expired/void)
- ✅ Hiển thị đầy đủ thông tin:
  - Sản phẩm (tên, màu, cấu hình, IMEI)
  - Khách hàng (tên, SĐT, email)
  - Thời gian bảo hành
  - Metadata (ngày tạo, cập nhật)
- ✅ **Lịch sử Claims** với trạng thái màu
- ✅ Actions: In phiếu, Tạo claim, Xóa

### 🔧 Form Quản lý Claims

- ✅ Tạo claim mới:
  - Chọn loại lỗi (màn hình, pin, camera, loa, nút bấm, sạc, phần mềm, vào nước...)
  - Mô tả chi tiết
  - Trung tâm bảo hành
  - Chi phí (nếu có)
- ✅ Cập nhật claim:
  - Thay đổi trạng thái (pending → in_progress → resolved/rejected)
  - Ghi chú giải quyết
  - Cập nhật chi phí

---

## 🎨 UI/UX Features

### Design

- ✅ Modern card-based layout
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Color-coded status badges
- ✅ Icons cho mỗi loại lỗi
- ✅ Hover effects và transitions

### User Experience

- ✅ Loading states với spinners
- ✅ Error handling với alerts
- ✅ Form validation với error messages
- ✅ Confirmation dialogs cho actions nguy hiểm
- ✅ Toast notifications (có thể tích hợp)
- ✅ **Print-friendly warranty cards**

---

## 🔄 Integration với Backend

### API Endpoints được sử dụng:

```
PUBLIC:
  GET  /api/warranty/check/:code
  GET  /api/warranty/check-imei/:imei

ADMIN:
  GET    /api/users/search?phone=xxx

  POST   /api/warranty
  GET    /api/warranty?page&limit&status&search
  GET    /api/warranty/stats
  GET    /api/warranty/:id
  PUT    /api/warranty/:id
  DELETE /api/warranty/:id

  POST   /api/warranty/:id/claims
  PUT    /api/warranty/:id/claims/:claimId
  DELETE /api/warranty/:id/claims/:claimId
```

### Authentication

- ✅ Sử dụng axios interceptor tự động thêm Bearer token
- ✅ Tích hợp với hệ thống auth hiện có (localStorage + Redux persist)

---

## 📱 Print Warranty Card

Tính năng in phiếu bảo hành bao gồm:

- ✅ Header đẹp với logo/tên cửa hàng
- ✅ Mã bảo hành lớn, dễ nhìn
- ✅ Thông tin khách hàng đầy đủ
- ✅ Thông tin sản phẩm và cấu hình
- ✅ Thời gian bảo hành (từ - đến)
- ✅ Print-friendly CSS (ẩn buttons khi in)
- ✅ Open trong tab mới

---

## 🚀 Cách sử dụng

### 1. Vào Admin Panel

```
http://localhost:3000/admin
```

### 2. Click menu "Quản lý bảo hành"

Sẽ hiển thị danh sách tất cả warranties

### 3. Tạo warranty mới

- Click "Tạo bảo hành mới"
- Nhập SĐT khách → Click "Tra cứu"
- Chọn loại dịch vụ
- Điền thông tin sản phẩm
- Chọn thời gian bảo hành
- Click "Tạo bảo hành"
- In phiếu (nếu muốn)

### 4. Quản lý Claims

- Vào chi tiết warranty
- Click "Tạo claim"
- Chọn loại lỗi và mô tả
- Cập nhật trạng thái xử lý

---

## 🔧 Maintenance

### Cập nhật API base URL

File: `src/shared/constants/app.js`

### Thêm loại lỗi mới

File: `src/shared/utils/warranty.js` → `formatIssueType()`

### Thay đổi thời gian bảo hành mặc định

File: `src/pages/Admin/WarrantyManagement/CreateWarranty.js` → `getDefaultWarrantyMonths()`

---

## 📝 Notes

- File `WarrantyManagement.jsx.old` là version cũ (đã backup)
- Tất cả API calls đều có error handling
- Form validation đầy đủ trước khi submit
- Responsive trên tất cả devices
- In phiếu bảo hành hoạt động trên mọi trình duyệt hiện đại

---

## 🎯 Next Steps (Optional)

- [ ] Thêm upload ảnh cho claims
- [ ] Export danh sách warranties ra Excel
- [ ] Email notification khi warranty sắp hết hạn
- [ ] Dashboard widget cho expiring warranties
- [ ] QR code trên phiếu bảo hành
- [ ] Mobile app để scan QR và tra cứu

---

✅ **System ready to use!**
