import React, { useState,useEffect } from "react";
import "./Content.css";
import heartIcon from "./heart.png";
import likedIcon from "./liked.png";

const Content = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productReviews, setProductReviews] = useState([]);
  const userId = localStorage.getItem("userId");
  const [isWarrantyChecked, setIsWarrantyChecked] = useState(false);

  const [likedProducts, setLikedProducts] = useState({});

  useEffect(() => {
    async function fetchLikedProducts() {
      try {
        const response = await fetch(`http://localhost:8080/ServletAPI/api/productlike?userId=${userId}`);
        if (response.ok) {
          const likedProductData = await response.json();
          console.log(likedProductData);
          const likedProductsMap = products.reduce((acc, product) => {
            const likedProduct = likedProductData.find((lp) => Number(lp.productId) === Number(product.id));
            acc[product.id] = likedProduct ? likedProduct.isLiked : false;

        
            return acc;
          }, {});
          console.log(likedProductsMap);
          setLikedProducts(likedProductsMap);
        } else {
          console.error("Failed to fetch liked products");
        }
      } catch (error) {
        console.error("Error fetching liked products:", error);
      }
    }

    fetchLikedProducts();
  }, [userId, products]);

  async function handleProductClick(product){
    setSelectedProduct(product);
    setIsWarrantyChecked(false);

    try {
      const response = await fetch(`http://localhost:8080/ServletAPI/api/addProductReview?productId=${product.id}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setProductReviews(reviewsData);
      } else {
        console.error("Failed to fetch product reviews");
      }
    } catch (error) {
      console.error("Error fetching product reviews:", error);
    }
  };

  async function handleAddtoCart(product) {
    const productToAdd = {
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      quantity: quantity,
      accessories: product.accessories.join(", "),
      fileFormat: product.fileFormat,
      manufacturerRebate: product.manufacturerRebate,
      manufacturerName: product.manufacturerName,
      retailerDiscount: product.retailerDiscount,
      isWarrantyAdded:isWarrantyChecked
    };
    const productId = product.id;
    await fetch(`http://localhost:8080/ServletAPI/api/cart/add?user=${userId}&product=${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productToAdd),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }

  async function handleLikeProduct(product) {
    const isLiked = !likedProducts[product.id]; // Toggle like status
    const productId = product.id;

    await fetch(`http://localhost:8080/ServletAPI/api/productlike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, isLiked }),
    })
      .then((response) => response.json())
      .then(() => {
        // Update local state to reflect the change
        setLikedProducts((prevState) => ({
          ...prevState,
          [product.id]: isLiked,
        }));
      })
      .catch((error) => {
        console.error("Error liking the product:", error);
      });
  }

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Group products by category
  const categorizedProducts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="product-container">
      {selectedProduct ? (
        <div>
        <div
          className="product-details"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            padding: "20px",
            maxWidth: "1000px",
            margin: "30px auto 20px auto",
          }}
        >
          <div className="product-image" style={{ flex: "1", maxWidth: "800px" }}>
            <img
              src={`/product_images/${selectedProduct.id}${selectedProduct.fileFormat}`}
              alt={selectedProduct.name}
              style={{ maxWidth: "130%", minWidth: "120%", height: "auto", borderRadius: "8px" }}
            />
          </div>

          <div className="product-info" style={{ flex: "2", fontFamily: "Arial, sans-serif" }}>
            <h2>{selectedProduct.name}</h2>
            <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
            <p><strong>Description: </strong>{selectedProduct.description}</p>
            <p><strong>Category: </strong>{selectedProduct.category}</p>
            <div style={{ display: "flex" }}>
              <p><strong>Price:</strong></p>
              {selectedProduct.price !== selectedProduct.finalPrice && selectedProduct.finalPrice!=null ? (
                <>
                  <p className="manager-strikethrough" style={{ marginLeft: "10px", marginRight: "20px"}}>
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                  <p style={{ marginLeft: "10px", marginRight: "20px",fontWeight:"bold" }}>
                    ${selectedProduct.finalPrice.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="nostrike" style={{ marginLeft: "10px", marginRight: "20px",fontWeight:"bold" }}>
                  ${selectedProduct.price.toFixed(2)}
                </p>
              )}
            </div>

            <p><strong>Availability:</strong> {selectedProduct.inStock} in stock</p>

            {selectedProduct.accessories && (
              <div className="accessories" style={{ marginTop: "10px" }}>
                <h4>Accessories:</h4>
                <ul>
                  {selectedProduct.accessories.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedProduct.accessories.length > 0 && (
              <div className="accessoriesImages" style={{ marginTop: "10px" }}>
                <ul>
                  {(() => {
                    const accessoriesList = [];
                    for (let i = 1; i <= selectedProduct.accessories.length; i++) {
                      accessoriesList.push(
                        <li key={i}>
                          <img
                            src={`/product_images/${selectedProduct.id}_accessory_${i}${selectedProduct.fileFormat}`}
                            alt={selectedProduct.accessories[i]}
                            style={{ width: "50px", height: "50px", marginLeft: "10px", borderColor: "black", border: "1px solid #000" }}
                          />
                        </li>
                      );
                    }
                    return accessoriesList;
                  })()}
                </ul>
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={handleDecrement}
                  style={{
                    backgroundColor: "#ddd",
                    color: "#333",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "18px",
                    width: "40px",
                    textAlign: "center",
                  }}
                >
                  -
                </button>

                <span style={{ fontSize: "18px" }}>{quantity}</span>

                <button
                  onClick={handleIncrement}
                  style={{
                    backgroundColor: "#ddd",
                    color: "#333",
                    border: "none",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "18px",
                    width: "40px",
                    textAlign: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={isWarrantyChecked}
                  onChange={(e) => setIsWarrantyChecked(e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                Add 1-year warranty - $40
              </label>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => handleAddtoCart(selectedProduct)}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            </div>

            <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
              <button
                onClick={() => handleLikeProduct(selectedProduct)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginRight: "10px",
                }}
              >
                <img
                  src={likedProducts[selectedProduct.id]?likedIcon:heartIcon}
                  alt="like"
                  style={{
                    width: likedProducts[selectedProduct.id] ? "50px" : "30px",
                    height: "30px",
                    //filter: likedProducts[selectedProduct.id] ? "saturate(7478%)  brightness(100%) contrast(105%)" : "none",
                  }}
                />
              </button>
              <span>{likedProducts[selectedProduct.id] ? "Liked" : "Like"}</span>
            </div>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
                  <div className="product-reviews-section" style={{ padding: "20px", maxWidth: "1000px", margin: "20px auto", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                  <h3>Product Reviews</h3>
                  {productReviews.length === 0 ? (
                    <p>No reviews for this product yet.</p>
                  ) : (
                    productReviews.map((review, index) => (
                      <div key={index} className="review-card" style={{ padding: "10px", borderBottom: "1px solid #ddd", marginTop: "10px" }}>
                        <p><strong>User:</strong> {review.userName}</p>
                        <p><strong>Rating:</strong> {review.reviewRating} / 5</p>
                        <p><strong>Review Date:</strong> {review.reviewDate}</p>
                        <p><strong>Review:</strong> {review.reviewText}</p>
                      </div>
                    ))
                  )}
                </div>
                </div>
      ) : (
        <div>
          {Object.keys(categorizedProducts).map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: "40px" }}>
              <h2 style={{ textAlign: "center", textTransform: "capitalize" }}>{category}</h2>
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
                {categorizedProducts[category].map((product, index) => (
                  <div
                    className="product-card"
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={`/product_images/${product.id}${product.fileFormat}`}
                      alt={product.name}
                      style={{ minWidth: "60%", maxWidth:"70%", height: "auto", borderRadius: "8px" }}
                    />
                    <h3>{product.name}</h3>
                    <div style={{display:"flex"}}>
                    {product.price !== product.finalPrice && product.finalPrice!=null ? (
    <>
      <p
        className="manager-strikethrough"
        style={{ marginLeft: "30px", marginRight: "10px"}}
      >
        ${product.price.toFixed(2)}
      </p>
      <p style={{ marginLeft: "10px", marginRight: "10px",fontWeight:"bold" }}>
        ${product.finalPrice.toFixed(2)}
      </p>
    </>
  ) : (
    <p className="nostrike" style={{marginLeft:"80px",fontWeight:"bold"}}>
      ${product.price.toFixed(2)}
    </p>
  )}
              </div>
                    <button
                      className="add-to-cart"
                      onClick={() => handleAddtoCart(product)}
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
                      onClick={() => handleProductClick(product)}
                      style={{
                        backgroundColor: "skyblue",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      View details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Content;
