import React, { useState } from "react";
import Header from "./Header";
import "./Content.css";
import { Button, TextField} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProductRecommendation() {
   const navigate = useNavigate();
  const [queryText, setQueryText] = useState("");
  const [products, setProducts] = useState([]);

  // Function to handle changes in the text field
  const handleInputChange = (event) => {
    setQueryText(event.target.value);
  };

  // Function to handle the button click and make an API call
  const handleRecommendProduct = () => {
    // Make a GET request to the search API with the query text
    fetch(`http://localhost:6001/search?query=${encodeURIComponent(queryText)}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data); // Set the received product data to state
      })
      .catch((error) => {
        console.error("Error fetching product recommendations:", error);
      });
  };

  const handleProductClick = (product) => {
    navigate(`/viewDetails?productId=${product.id}`);  
  };

  return (
    <div>
      <Header />
      <div style={{ textAlign: "center", justifyContent: "center", margin: "100px" }}>
        <TextField
          className="fields"
          type="text"
          name="ReviewInput"
          value={queryText}
          onChange={handleInputChange}
          style={{ marginBottom: "20px" }}
        />
        <br />
        <Button color="primary" variant="contained" onClick={handleRecommendProduct}>
          Recommend Product
        </Button>

        <div
  className="product-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    padding: "20px",
    minHeight: "450px",
  }}
>
  {products.map((product, index) => (
    <div
      className="product-card"
      key={index}
      style={{
        height:"460px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <img
        src={`/product_images/${product.id}.jpg`}
        alt={product.name}
        style={{ minWidth: "60%", maxWidth: "70%", height: "auto", borderRadius: "8px" }}
      />
      <h3>{product.name}</h3>
      <div style={{ display: "flex" }}>
        {product.price !== product.finalPrice && product.finalPrice != null ? (
          <>
            <p
              className="manager-strikethrough"
              style={{ marginLeft: "30px", marginRight: "10px" }}
            >
              ${product.price.toFixed(2)}
            </p>
            <p style={{ marginLeft: "10px", marginRight: "10px", fontWeight: "bold" }}>
              ${product.finalPrice.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="nostrike" style={{ marginLeft: "80px", fontWeight: "bold" }}>
            ${product.price.toFixed(2)}
          </p>
        )}
      </div>
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "5px" }}>
        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
        <button
          style={{
            backgroundColor: "skyblue",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleProductClick(product)}
        >
          View details
        </button>
      </div>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}

export default ProductRecommendation;
