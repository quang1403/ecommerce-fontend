import React from "react";
import Cards from "./Cards";
import Table from "./Table";
import "../styles/MainDash.css";

const MainDash = () => {
  return (
    <div className="MainDash">
      <h1>Bảng điều khiển</h1>
      <Cards />
      <Table />
    </div>
  );
};

export default MainDash;
