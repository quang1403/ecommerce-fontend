import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAdmin = (OriginComponent) => {
  const ExtendsComponent = () => {
    const login = useSelector(({ auth }) => auth.login);
    if (!login.loggedIn) {
      return <Navigate to="/Login" />;
    }
    if (!login.currentCustomer?.isAdmin) {
      return <Navigate to="/" />;
    }
    return <OriginComponent />;
  };
  return ExtendsComponent;
};

export default RequireAdmin;
