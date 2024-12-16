import "./LandingPage.css";
import Header from "./Header";
import Content from "./Content";
import { useState, useEffect } from "react";
import axios from "axios";
function Home() {

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
    }, [products]);

  
  return (
    <div className="bg-image">
      <Header></Header>
        <Content products={products} />
    </div>
  );
}

export default Home;