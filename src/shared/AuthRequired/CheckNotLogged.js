import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const CheckNotLogged = (OriginComponent) => {
  const ExtendsComponent = () => {
    const login = useSelector(({ auth }) => auth.login);
    if (login.loggedIn && login.currentCustomer?.isAdmin) {
      return <Navigate to="/admin" />;
    }
    return login.loggedIn ? <Navigate to="/Login" /> : <OriginComponent />;
  };
  return ExtendsComponent;
};

export default CheckNotLogged;
