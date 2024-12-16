import Header from "./Header";
import ManagerContent from "./ManagerContent";
import { useState, useEffect } from "react";
import axios from "axios";

function ProductManager() {
    const [products, setProducts] = useState([]);

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
      }, []);

  
  return (
    <div className="bg-image">
      <Header
      ></Header>
        <ManagerContent products={products} />
    </div>
  );
}

export default ProductManager;
