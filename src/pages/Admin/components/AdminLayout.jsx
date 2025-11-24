import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import RightSide from "./RightSide";
import ProductList from "./ProductList";
import CustomerList from "./CustomerList";
import OrderManagement from "./OrderManagement";
import ReviewList from "./ReviewList";
import Statistics from "./Statistics";
import AdminNews from "./AdminNews";
import InstallmentOrders from "./InstallmentOrders";
import Toast from "./Toast";
import "../styles/AdminLayout.css";

const AdminLayout = () => {
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(null);
  const updatesRef = useRef();
  // 0: Bảng điều khiển, 1: Đơn hàng, 2: Khách hàng, 3: Sản phẩm, 4: Đánh giá sản phẩm, 5: Thống kê, 6: Quản lý tin tức, 7: Đơn hàng trả góp

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshUpdates = () => {
    if (updatesRef.current) {
      updatesRef.current.refreshUpdates();
    }
  };
  let mainContent;
  if (tab === 0) mainContent = <Dashboard refreshUpdates={refreshUpdates} />;
  else if (tab === 1)
    mainContent = (
      <OrderManagement showToast={showToast} refreshUpdates={refreshUpdates} />
    );
  else if (tab === 2) mainContent = <CustomerList />;
  else if (tab === 3) mainContent = <ProductList />;
  else if (tab === 4) mainContent = <ReviewList />;
  else if (tab === 5) mainContent = <Statistics />;
  else if (tab === 6) mainContent = <AdminNews />;
  else if (tab === 7) mainContent = <InstallmentOrders />;
  else
    mainContent = (
      <div style={{ padding: "2rem" }}>Chức năng đang phát triển...</div>
    );

  return (
    <div className="AdminApp">
      <div className="AdminGlass">
        <Sidebar tab={tab} setTab={setTab} showToast={showToast} />
        {mainContent}
        <RightSide updatesRef={updatesRef} showToast={showToast} />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
