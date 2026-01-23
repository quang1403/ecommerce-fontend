/**
 * Admin Warranty Management - Main Page
 * Danh sách và quản lý tất cả các bảo hành
 */

import React, { useState, useEffect } from "react";
import {
  getWarranties,
  deleteWarranty,
  getWarrantyStats,
} from "../../../services/warrantyService";
import {
  formatDate,
  formatWarrantyStatus,
  calculateDaysRemaining,
} from "../../../shared/utils/warranty";
import "../styles/WarrantyList.css";

const WarrantyList = ({ onCreateNew, onViewDetail, onCreateClaim }) => {
  // State
  const [warranties, setWarranties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());

  // Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // Load data
  useEffect(() => {
    fetchData();
  }, [page, statusFilter, sortBy, order, search]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search,
        status: statusFilter,
        sortBy,
        order,
      };

      const response = await getWarranties(params);

      setWarranties(response.data || []);
      setTotalPages(response.totalPages || 1);
      setError("");
    } catch (err) {
      console.error("Error fetching warranties:", err);
      setError(err.message || "Không thể tải danh sách bảo hành");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getWarrantyStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Xác nhận xóa bảo hành ${code}?`)) {
      return;
    }

    try {
      await deleteWarranty(id);
      alert("Đã xóa bảo hành thành công!");
      fetchData();
      fetchStats();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
    setPage(1);
  };

  const toggleCustomer = (customerKey) => {
    setExpandedCustomers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(customerKey)) {
        newSet.delete(customerKey);
      } else {
        newSet.add(customerKey);
      }
      return newSet;
    });
  };

  // Group warranties by customer
  const groupedWarranties = React.useMemo(() => {
    const groups = {};

    warranties.forEach((warranty) => {
      const customerPhone =
        warranty.customer?.phone || warranty.customerPhone || "unknown";
      const customerName =
        warranty.customer?.name || warranty.customerName || "Khách hàng";
      const customerKey = `${customerPhone}-${customerName}`;

      if (!groups[customerKey]) {
        groups[customerKey] = {
          customerPhone,
          customerName,
          warranties: [],
          totalWarranties: 0,
          activeCount: 0,
          totalClaims: 0,
        };
      }

      groups[customerKey].warranties.push(warranty);
      groups[customerKey].totalWarranties++;

      const daysRemaining = calculateDaysRemaining(warranty.endDate);
      if (warranty.status === "active" && daysRemaining > 0) {
        groups[customerKey].activeCount++;
      }

      groups[customerKey].totalClaims += warranty.claims?.length || 0;
    });

    return Object.entries(groups).map(([key, data]) => ({
      key,
      ...data,
    }));
  }, [warranties]);

  // Render loading
  if (loading && warranties.length === 0) {
    return (
      <div className="warranty-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="warranty-management">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <i className="fas fa-shield-alt"></i> Quản lý Bảo hành
          </h1>
          <p>Quản lý tất cả các bảo hành sản phẩm</p>
        </div>
        <button className="btn btn-add-slider btn-primary" onClick={onCreateNew}>
          <i className="fas fa-plus"></i> Tạo bảo hành mới
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="stat-info">
              <h3>
                {typeof stats.total === "number"
                  ? stats.total
                  : stats.total?.total || 0}
              </h3>
              <p>Tổng bảo hành</p>
            </div>
          </div>

          <div className="stat-card stat-active">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>
                {typeof stats.active === "number"
                  ? stats.active
                  : stats.active?.total || 0}
              </h3>
              <p>Đang hiệu lực</p>
            </div>
          </div>

          <div className="stat-card stat-expiring">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h3>
                {typeof stats.expiringSoon === "number"
                  ? stats.expiringSoon
                  : stats.expiringSoon?.total || 0}
              </h3>
              <p>Sắp hết hạn</p>
            </div>
          </div>

          <div className="stat-card stat-expired">
            <div className="stat-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-info">
              <h3>
                {typeof stats.expired === "number"
                  ? stats.expired
                  : stats.expired?.total || 0}
              </h3>
              <p>Đã hết hạn</p>
            </div>
          </div>

          {stats.claims && (
            <div className="stat-card stat-claims">
              <div className="stat-icon">
                <i className="fas fa-tools"></i>
              </div>
              <div className="stat-info">
                <h3>
                  {typeof stats.claims === "object"
                    ? (stats.claims.pending || 0) +
                      (stats.claims.in_progress || 0)
                    : stats.claims || 0}
                </h3>
                <p>Claims đang xử lý</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm mã BH, sản phẩm, IMEI, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-search">
            Tìm kiếm
          </button>
        </form>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">🟢 Còn hiệu lực</option>
            <option value="expired">🔴 Hết hạn</option>
            <option value="void">⚫ Đã hủy</option>
          </select>

          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split("-");
              setSortBy(field);
              setOrder(direction);
              setPage(1);
            }}
            className="filter-select"
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="endDate-asc">Sắp hết hạn</option>
            <option value="endDate-desc">Còn lâu nhất</option>
            <option value="productName-asc">Tên A-Z</option>
            <option value="productName-desc">Tên Z-A</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="warranty-table warranty-table-grouped">
          <thead>
            <tr>
              <th style={{ width: "5%" }}></th>
              <th style={{ width: "25%" }}>Khách hàng</th>
              <th style={{ width: "10%" }}>Bảo hành</th>
              <th style={{ width: "15%" }}>Hiệu lực</th>
              <th style={{ width: "10%" }}>Claims</th>
              <th style={{ width: "15%" }}>Ngày mua gần nhất</th>
              <th style={{ width: "20%" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {groupedWarranties.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  <i className="fas fa-inbox"></i>
                  <p>Không có dữ liệu</p>
                </td>
              </tr>
            ) : (
              groupedWarranties.map((group) => {
                const isExpanded = expandedCustomers.has(group.key);
                const latestWarranty = group.warranties[0]; // Assuming sorted by date

                return (
                  <React.Fragment key={group.key}>
                    {/* Main Customer Row */}
                    <tr
                      className="customer-row"
                      onClick={() => toggleCustomer(group.key)}
                    >
                      <td className="expand-cell">
                        <i
                          className={`fas fa-chevron-${isExpanded ? "down" : "right"}`}
                        ></i>
                      </td>
                      <td>
                        <div className="customer-info">
                          <strong>
                            {String(group.customerName || "Khách hàng")}
                          </strong>
                          <small className="text-muted">
                            {String(group.customerPhone || "-")}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {Number(group.totalWarranties) || 0}
                        </span>
                      </td>
                      <td>
                        <span className="warranty-status-summary">
                          {group.activeCount > 0 && (
                            <span className="active-badge">
                              🟢 {Number(group.activeCount) || 0}
                            </span>
                          )}
                          {group.activeCount < group.totalWarranties && (
                            <span className="inactive-badge">
                              ⚫{" "}
                              {Number(
                                group.totalWarranties - group.activeCount,
                              ) || 0}
                            </span>
                          )}
                        </span>
                      </td>
                      <td>
                        {group.totalClaims > 0 ? (
                          <span className="claims-badge">
                            🛠️ {Number(group.totalClaims) || 0}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <small>
                          {(() => {
                            const date =
                              latestWarranty.purchaseDate ||
                              latestWarranty.createdAt;
                            if (!date) return "-";
                            return formatDate(date);
                          })()}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn-small btn-expand"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCustomer(group.key);
                          }}
                        >
                          <i className="fas fa-list"></i>{" "}
                          {isExpanded ? "Thu gọn" : "Xem"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Warranty Rows */}
                    {isExpanded &&
                      group.warranties.map((warranty) => {
                        const daysRemaining = calculateDaysRemaining(
                          warranty.endDate,
                        );
                        const statusInfo = formatWarrantyStatus(
                          warranty.status,
                          daysRemaining,
                        );

                        return (
                          <tr
                            key={warranty._id}
                            className="warranty-detail-row"
                          >
                            <td></td>
                            <td className="warranty-product-cell">
                              <div className="warranty-product-info">
                                <i className="fas fa-box-open text-muted"></i>
                                <div>
                                  <strong>
                                    {warranty.productName || "N/A"}
                                  </strong>
                                  <div className="warranty-meta">
                                    <code className="warranty-code-small">
                                      {typeof warranty.warrantyCode === "string"
                                        ? warranty.warrantyCode
                                        : warranty.warrantyCode?.code || "N/A"}
                                    </code>
                                    {warranty.imei && (
                                      <code className="imei-small">
                                        {typeof warranty.imei === "string"
                                          ? warranty.imei
                                          : warranty.imei?.value || "N/A"}
                                      </code>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                Còn {daysRemaining > 0 ? daysRemaining : 0} ngày
                              </small>
                            </td>
                            <td>
                              <span
                                className="status-badge-compact"
                                style={{ color: statusInfo.color }}
                              >
                                {statusInfo.icon === "check-circle" && "🟢"}
                                {statusInfo.icon === "exclamation-triangle" &&
                                  "🟡"}
                                {statusInfo.icon === "times-circle" && "🔴"}
                                {statusInfo.icon === "ban" && "⚫"}
                              </span>
                            </td>
                            <td>
                              {warranty.claims?.length > 0 ? (
                                <span className="claims-count">
                                  ({warranty.claims.length})
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <small>
                                {warranty.purchaseDate
                                  ? formatDate(warranty.purchaseDate)
                                  : "-"}
                              </small>
                            </td>
                            <td>
                              <div className="action-buttons-compact">
                                <button
                                  className="btn-icon-small btn-view"
                                  onClick={() => onViewDetail(warranty._id)}
                                  title="Chi tiết"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="btn-icon-small btn-claim"
                                  onClick={() => onCreateClaim(warranty._id)}
                                  title="Tạo claim"
                                >
                                  <i className="fas fa-tools"></i>
                                </button>
                                <button
                                  className="btn-icon-small btn-delete"
                                  onClick={() =>
                                    handleDelete(
                                      warranty._id,
                                      warranty.warrantyCode,
                                    )
                                  }
                                  title="Xóa"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-page"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <i className="fas fa-chevron-left"></i> Trước
          </button>

          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Show first, last, current, and adjacent pages
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - page) <= 1
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-page ${page === pageNum ? "active" : ""}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === page - 2 || pageNum === page + 2) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}
          </div>

          <button
            className="btn btn-page"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Sau <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default WarrantyList;
