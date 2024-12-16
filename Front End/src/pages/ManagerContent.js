
import axios from "axios";
import React, {useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerContent.css";

const ManagerContent = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [refreshProducts, setRefreshProducts] = useState(false); 



  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };
  
async function handleDeleteProduct(id,fileFormat,count) {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("fileFormat",fileFormat);
      formData.append("accessoryCount",count)


  
      const response = await axios.delete("http://localhost:8080/ServletAPI/api/product/delete", {
        data: formData,  
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
  
      if (response.status === 200) {
        console.log("Product deleted successfully:", response.data);
        setRefreshProducts(prev => !prev);

      } else {
        console.error("Failed to delete product:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while deleting product:", error);
    }
    setSelectedProduct(null);
    navigate("/manager")
  }

  const handleAddProductClick = () => {

    navigate("/add"); 
  };

  const handleEditProduct = (product) => {
    
    navigate("/add", { state: { product } });
  };
  

  useEffect(() => {

    axios
      .get("http://localhost:8080/ServletAPI/api/products")
      .then((response) => {
        
        const data = response.data;
        const productsArray = Object.keys(data).map((key) => {
          return {
            ...data[key],
          };
        });
  
        setProducts(productsArray);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [refreshProducts]);



  return (
    <div className="product-container">
      {selectedProduct ? (
       <div className="product-details" style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
        padding: "20px",
        maxWidth: "1000px",
        margin: "30px auto 20px auto"
      }}>
        <div className="manager-product-image" style={{ flex: "1", maxWidth: "700px" }}>
          <img
            src={`/product_images/${selectedProduct.id}${selectedProduct.fileFormat}`}
            alt={selectedProduct.name}
            style={{ width: "130%", borderRadius: "8px"}}
          />
        </div>
        
        <div className="product-info" style={{ flex: "2", fontFamily: "Arial, sans-serif" }}>
          <h2>{selectedProduct.name}</h2>
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
          
          <p><strong>Description: </strong>{selectedProduct.description}</p>
          <p><strong>Category: </strong> {selectedProduct.category}</p>
          <p style={{ fontSize: "24px", color: "black", fontWeight: "bold" }}>
          <strong>Price: </strong>${selectedProduct.price.toFixed(2)}
          </p>
          <p><strong>Availability:</strong> In Stock</p>
          
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
  <div className="accessoriesImages" style={{ marginTop: "10px", }}>
    <ul>
      {(() => {
        const accessoriesList = [];
        for (let i = 1; i <= selectedProduct.accessories.length; i++) {
          accessoriesList.push(
            <li key={i}>
              <img
                src={`/product_images/${selectedProduct.id}_accessory_${i}${selectedProduct.fileFormat}`}  // Dynamic image path
                alt={selectedProduct.accessories[i]}
                style={{ width: "50px", height: "50px", marginLeft: "10px",borderColor:"black",border: "1px solid #000" }}  // Image styling
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
                <button
                   onClick={() => handleEditProduct(selectedProduct)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Update Product
                </button>

                <button
                 onClick={() => handleDeleteProduct(selectedProduct.id,selectedProduct.fileFormat,selectedProduct.accessories.length)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete Product
                </button>
              </div>
          <br></br>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                backgroundColor: "ash",
                color: "black",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize:"30px"
                
              }}
            >
              🔙
            </button>
          </div>
        </div>
      </div>
      
      
      
      
      
      ) : (
<div className="product-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "20px",
          padding: "20px",
        }}>
          {products.map((product, index) => (
            <div className="manager-product-card" key={index} onClick={() => handleProductClick(product)} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              minHeight:"450px",
            }}>
              <img  className="manager-product-card"
                src={`/product_images/${product.id}${product.fileFormat}`}
                alt={product.name}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
              <h3>{product.name}</h3>
              {product.price !== product.finalPrice ? (
    <>
      <p
        className="manager-strikethrough"
        style={{ marginLeft: "10px", marginRight: "20px"}}
      >
        ${product.price.toFixed(2)}
      </p>
      <p style={{ marginLeft: "10px", marginRight: "20px" }}>
        ${product.finalPrice.toFixed(2)}
      </p>
    </>
  ) : (
    <p className="nostrike" style={{ marginTop:"55px",marginLeft: "10px", marginRight: "20px"}}>
      ${product.price.toFixed(2)}
    </p>
  )}
              <button
                className="add-to-cart"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Update Product
              </button>
            </div>

          ))}
          <div className="add-product-card" onClick={handleAddProductClick} style={{
        border: "2px dashed #ddd",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
      }}>
        <div style={{ fontSize: "48px", color: "#4CAF50" }}>+</div>
        <p>Add Product</p>
      </div>
        </div>
        
      )}
    </div>
  );
};

export default ManagerContent;
