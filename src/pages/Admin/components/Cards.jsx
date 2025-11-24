import React from "react";
import "../styles/Cards.css";

const cardsData = [
  {
    tieuDe: "Doanh số",
    giaTri: "25,970",
    phanTram: 70,
  },
  {
    tieuDe: "Doanh thu",
    giaTri: "14,270",
    phanTram: 80,
  },
  {
    tieuDe: "Chi phí",
    giaTri: "4,270",
    phanTram: 60,
  },
];

const Cards = () => {
  return (
    <div className="Cards">
      {cardsData.map((card, idx) => (
        <div className="Card" key={idx}>
          <div className="CardTitle">{card.tieuDe}</div>
          <div className="CardValue">{card.giaTri}</div>
          <div className="CardPercent">{card.phanTram}%</div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
