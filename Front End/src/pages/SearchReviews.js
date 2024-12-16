import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import navigate for routing
import Header from "./Header";
import { Button, TextField } from "@mui/material";

function SearchReviews() {
  const [query, setQuery] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();  // Use navigate for routing

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    if (query.trim() === "") {
      alert("Please enter a query to search reviews.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:6001/search_reviews?query=${query}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div>
      <Header></Header>
      <div style={{ textAlign: "center", justifyContent: "center", margin: "100px" }}>
        <TextField
          className="fields"
          type="text"
          name="ReviewInput"
          value={query}
          onChange={handleInputChange}
          label="Enter search query"
          style={{ marginBottom: "20px", width: "60%" }}
        />
        <br />
        <Button color="primary" variant="contained" onClick={handleSearchClick}>
          Search Reviews
        </Button>
      </div>

      {reviews.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <ReviewsGrid reviews={reviews} onProductClick={(product) => navigate(`/viewDetails?productId=${product.product_id}`)} />
        </div>
      )}
    </div>
  );
}

export default SearchReviews;

const ReviewsGrid = ({ reviews, onProductClick }) => {
  return (
    <div
      className="reviews-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "20px",
        padding: "20px",
      }}
    >
      {reviews.map((review, index) => (
        <div
          className="review-card"
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            cursor: "pointer", // Indicates that it's clickable
          }}
          onClick={() => onProductClick(review)} // Handle click event
        >
          <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{review.name}</h3>
          <p style={{ color: "#777", fontStyle: "italic" }}>{review.category}</p>
          <p style={{ color: "#333", fontWeight: "bold" }}>
            Price: ${review.price.toFixed(2)}
          </p>
          <p style={{ fontSize: "14px", color: "#555" }}>{review.description}</p>
          <div
            className="review-section"
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#fff",
              borderRadius: "5px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginBottom: "5px" }}>Review:</h4>
            <p style={{ fontSize: "14px", color: "#444" }}>{review.review_text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
