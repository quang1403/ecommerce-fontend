import React from "react";
import "../styles/Table.css";

const donHangMau = [
  {
    sanPham: "Điện thoại iPhone 15",
    maDH: "DH001",
    ngay: "21/09/2025",
    trangThai: "Đã duyệt",
  },
  {
    sanPham: "Samsung Galaxy S23",
    maDH: "DH002",
    ngay: "20/09/2025",
    trangThai: "Chờ xử lý",
  },
  {
    sanPham: "Oppo Reno 10",
    maDH: "DH003",
    ngay: "19/09/2025",
    trangThai: "Đã giao",
  },
];

const Table = () => {
  return (
    <div className="Table">
      <h3>Đơn hàng gần đây</h3>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Mã đơn hàng</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {donHangMau.map((dh, idx) => (
            <tr key={idx}>
              <td>{dh.sanPham}</td>
              <td>{dh.maDH}</td>
              <td>{dh.ngay}</td>
              <td>
                <span className={`status ${dh.trangThai.replace(/\s/g, "-")}`}>
                  {dh.trangThai}
                </span>
              </td>
              <td>
                <button>Chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
