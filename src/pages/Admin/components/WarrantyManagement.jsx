/**
 * Warranty Management Wrapper
 * Manages different warranty views using state instead of routing
 */

import React, { useState } from "react";
import WarrantyList from "./WarrantyList";
import CreateWarranty from "./CreateWarranty";
import WarrantyDetail from "./WarrantyDetail";
import ClaimForm from "./ClaimForm";

const WarrantyManagement = () => {
  const [view, setView] = useState("list"); // 'list', 'create', 'detail', 'claim'
  const [selectedWarrantyId, setSelectedWarrantyId] = useState(null);
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  // Navigation handlers
  const goToList = () => {
    setView("list");
    setSelectedWarrantyId(null);
    setSelectedClaimId(null);
  };

  const goToCreate = () => {
    setView("create");
    setSelectedWarrantyId(null);
  };

  const goToDetail = (warrantyId) => {
    setView("detail");
    setSelectedWarrantyId(warrantyId);
    setSelectedClaimId(null);
  };

  const goToClaim = (warrantyId, claimId = null) => {
    setView("claim");
    setSelectedWarrantyId(warrantyId);
    setSelectedClaimId(claimId);
  };

  // Render based on current view
  switch (view) {
    case "create":
      return <CreateWarranty onBack={goToList} onSuccess={goToList} />;

    case "detail":
      return (
        <WarrantyDetail
          warrantyId={selectedWarrantyId}
          onBack={goToList}
          onCreateClaim={goToClaim}
          onDelete={goToList}
        />
      );

    case "claim":
      return (
        <ClaimForm
          warrantyId={selectedWarrantyId}
          claimId={selectedClaimId}
          onBack={() => goToDetail(selectedWarrantyId)}
          onSuccess={() => goToDetail(selectedWarrantyId)}
        />
      );

    case "list":
    default:
      return (
        <WarrantyList
          onCreateNew={goToCreate}
          onViewDetail={goToDetail}
          onCreateClaim={goToClaim}
        />
      );
  }
};

export default WarrantyManagement;
