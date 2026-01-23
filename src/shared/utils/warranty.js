/**
 * Warranty Utility Functions
 * Helper functions for warranty management
 */

// Format tiền VND
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format ngày
export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// Format ngày giờ đầy đủ
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format loại lỗi
export const formatIssueType = (type) => {
  const types = {
    screen: "🖥️ Màn hình",
    battery: "🔋 Pin",
    camera: "📷 Camera",
    speaker: "🔊 Loa",
    button: "🎮 Nút bấm",
    charging: "⚡ Sạc",
    software: "💻 Phần mềm",
    water_damage: "💧 Vào nước",
    other: "❓ Khác",
  };
  return types[type] || type;
};

// Format trạng thái claim
export const formatClaimStatus = (status) => {
  const statuses = {
    pending: { label: "⏳ Đang chờ", color: "#ffc107" },
    in_progress: { label: "🔧 Đang xử lý", color: "#2196f3" },
    resolved: { label: "✅ Đã giải quyết", color: "#4caf50" },
    rejected: { label: "❌ Từ chối", color: "#f44336" },
  };
  return statuses[status] || { label: status, color: "#9e9e9e" };
};

// Format trạng thái warranty
export const formatWarrantyStatus = (status, daysRemaining) => {
  if (status === "active") {
    return {
      label: `🟢 Còn ${daysRemaining} ngày`,
      color: "#4caf50",
      icon: "check-circle",
    };
  } else if (status === "expired") {
    return {
      label: "🔴 Hết hạn",
      color: "#f44336",
      icon: "times-circle",
    };
  } else if (status === "void") {
    return {
      label: "⚫ Đã hủy",
      color: "#9e9e9e",
      icon: "ban",
    };
  }
  return {
    label: status,
    color: "#9e9e9e",
    icon: "question-circle",
  };
};

// Validate phone
export const validatePhone = (phone) => {
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};

// Validate IMEI
export const validateIMEI = (imei) => {
  if (!imei) return true; // IMEI is optional
  const imeiRegex = /^[0-9]{15}$/;
  return imeiRegex.test(imei);
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Tính số ngày còn lại
export const calculateDaysRemaining = (endDate) => {
  if (!endDate) return 0;
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Print warranty card
export const printWarrantyCard = (warranty) => {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Vui lòng cho phép popup để in phiếu bảo hành");
    return;
  }

  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Phiếu Bảo Hành - ${warranty.warrantyCode}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          padding: 40px; 
          background: #f5f5f5;
        }
        .card { 
          border: 3px solid #007bff; 
          padding: 40px; 
          max-width: 700px; 
          margin: 0 auto; 
          background: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #007bff;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .code { 
          font-size: 28px; 
          font-weight: bold; 
          margin: 20px 0; 
          text-align: center;
          color: #007bff;
          background: #e3f2fd;
          padding: 15px;
          border-radius: 5px;
        }
        .info { 
          margin: 15px 0; 
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .info strong { 
          min-width: 150px; 
          color: #333;
        }
        .info span {
          color: #666;
          flex: 1;
        }
        .warranty-dates {
          background: #fff3cd;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          border-left: 4px solid #ffc107;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        @media print { 
          .no-print { display: none; }
          body { background: white; padding: 0; }
          .card { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>📱 PHIẾU BẢO HÀNH</h1>
          <p>Cửa hàng điện thoại</p>
        </div>
        
        <div class="code">Mã: ${warranty.warrantyCode}</div>
        
        <div class="info">
          <strong>Khách hàng:</strong>
          <span>${warranty.customer?.name || warranty.customerName || "N/A"}</span>
        </div>
        
        <div class="info">
          <strong>Số điện thoại:</strong>
          <span>${warranty.customer?.phone || warranty.customerPhone || "N/A"}</span>
        </div>
        
        <div class="info">
          <strong>Email:</strong>
          <span>${warranty.customer?.email || warranty.customerEmail || "N/A"}</span>
        </div>
        
        <div class="info">
          <strong>Sản phẩm:</strong>
          <span>${warranty.productName || "N/A"}</span>
        </div>
        
        ${
          warranty.color
            ? `
        <div class="info">
          <strong>Màu sắc:</strong>
          <span>${warranty.color}</span>
        </div>
        `
            : ""
        }
        
        ${
          warranty.ram || warranty.storage
            ? `
        <div class="info">
          <strong>Cấu hình:</strong>
          <span>${warranty.ram || ""} ${warranty.storage || ""}</span>
        </div>
        `
            : ""
        }
        
        ${
          warranty.imei
            ? `
        <div class="info">
          <strong>IMEI:</strong>
          <span>${warranty.imei}</span>
        </div>
        `
            : ""
        }
        
        <div class="warranty-dates">
          <div class="info" style="border: none;">
            <strong>Ngày bắt đầu:</strong>
            <span>${formatDate(warranty.startDate)}</span>
          </div>
          <div class="info" style="border: none; margin: 0;">
            <strong>Ngày hết hạn:</strong>
            <span>${formatDate(warranty.endDate)}</span>
          </div>
        </div>
        
        ${
          warranty.notes
            ? `
        <div class="info">
          <strong>Ghi chú:</strong>
          <span>${warranty.notes}</span>
        </div>
        `
            : ""
        }
        
        <div class="footer">
          <p>Vui lòng giữ phiếu này để tra cứu và sử dụng dịch vụ bảo hành</p>
          <p>In lúc: ${formatDateTime(new Date())}</p>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px; margin-right: 10px;">
          🖨️ In phiếu
        </button>
        <button onclick="window.close()" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #6c757d; color: white; border: none; border-radius: 5px;">
          Đóng
        </button>
      </div>
    </body>
    </html>
  `);
};

// Generate random warranty code (fallback, usually from backend)
export const generateWarrantyCode = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0");
  return `WRT-${year}-${random}`;
};

// Check if warranty is expiring soon (within 30 days)
export const isExpiringSoon = (endDate, days = 30) => {
  const remaining = calculateDaysRemaining(endDate);
  return remaining > 0 && remaining <= days;
};

// Get warranty status badge class
export const getWarrantyBadgeClass = (status) => {
  const classes = {
    active: "badge-success",
    expired: "badge-danger",
    void: "badge-secondary",
  };
  return classes[status] || "badge-secondary";
};

// Get claim status badge class
export const getClaimBadgeClass = (status) => {
  const classes = {
    pending: "badge-warning",
    in_progress: "badge-info",
    resolved: "badge-success",
    rejected: "badge-danger",
  };
  return classes[status] || "badge-secondary";
};
