import { Link } from "react-router-dom";
import "./BrandShowcase.css";

const BrandShowcase = ({ brands }) => {
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="brand-showcase">
      <div className="brands-grid">
        {brands.map((brand) => (
          <Link
            to={`/category/${brand._id}`}
            key={brand._id}
            className="brand-item"
          >
            <div className="brand-logo">
              <img
                src={getBrandLogo(brand.name)}
                alt={brand.name}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="brand-fallback" style={{ display: "none" }}>
                {brand.name.charAt(0)}
              </div>
            </div>
            <h4 className="brand-name">{brand.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Helper function to get brand logo
const getBrandLogo = (brandName) => {
  const logos = {
    iPhone: "https://cdn.iconscout.com/icon/free/png-256/apple-1-283617.png",
    Samsung: "https://cdn.iconscout.com/icon/free/png-256/samsung-3-283466.png",
    Xiaomi: "https://cdn.iconscout.com/icon/free/png-256/xiaomi-2-569323.png",
    OPPO: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/OPPO_Logo.svg/1200px-OPPO_Logo.svg.png",
    Vivo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vivo_Logo.svg/1200px-Vivo_Logo.svg.png",
    Realme:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Realme_logo.svg/1200px-Realme_logo.svg.png",
    OnePlus:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/OnePlus_logo.svg/1200px-OnePlus_logo.svg.png",
  };
  return (
    logos[brandName] ||
    `https://via.placeholder.com/100x50/4a90e2/ffffff?text=${brandName}`
  );
};

export default BrandShowcase;
