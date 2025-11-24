import React from "react";
import Updates from "./Updates";
import CustomerReview from "./CustomerReview";
import "../styles/RightSide.css";

const RightSide = ({ updatesRef, showToast }) => {
  return (
    <div className="RightSide">
      <div>
        <h3>Thông báo</h3>
        <Updates ref={updatesRef} showToast={showToast} />
      </div>
      <div>
        <h3>Đánh giá khách hàng</h3>
        <CustomerReview />
      </div>
    </div>
  );
};

export default RightSide;
