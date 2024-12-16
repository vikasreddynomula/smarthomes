import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProductManager from "./pages/Manager_Home";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderPage from "./pages/OrderPage";
import OrderManagement from "./pages/OrderManagement";
import MostLikedProducts from "./pages/MostLikedProducts";
import InventoryReport from "./pages/InventoryReport";
import SalesReport from "./pages/SalesReport";
import ViewDetails from "./pages/ViewDetails";
import CustomerService from "./pages/CustomerService";
import SearchReviews from "./pages/SearchReviews";
import ProductRecommendation from "./pages/ProductRecommendation";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ReviewForm from "./pages/ReviewForm";

function App() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products data here
    axios
      .get('http://localhost:8080/ServletAPI/api/products')
      .then((response) => {
        const data = response.data;
        const productsArray = Object.keys(data).map((key) => {
          return {
            ...data[key],
          };
        });
        setProducts(productsArray);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);
  return (
    <div style={{backgroundColor:"lightyellow"}}>
      <Router>
        <Routes>
          <Route path="/" exact element={<LandingPage />}></Route>
          <Route path="/SignUp" exact element={<SignUp />}></Route>
          <Route path="/Home" exact element={<Home />}></Route>
          <Route path="/Manager" exact element={<ProductManager />}></Route>
          <Route path="/Add" exact element={<AddProduct />}></Route>
          <Route path="/MyCart" exact element={<Cart />}></Route>
          <Route path="/checkout" exact element={<Checkout />}></Route>
          <Route path="/MyOrders" exact element={<OrderPage />}></Route>
          {<Route path="/EditOrder" exact element={<OrderManagement />}></Route>}
          {<Route path="/mostLiked" exact element={<MostLikedProducts />}></Route>}
          {<Route path="/addReview" exact element={<ReviewForm />}></Route>}
          <Route path="/viewdetails" element={<ViewDetails products={products} />} />
          {<Route path="/inventoryReport" exact element={<InventoryReport />}></Route>}
          {<Route path="/salesReport" exact element={<SalesReport />}></Route>}
          {<Route path="/customerService" exact element={<CustomerService />}></Route>}
          {<Route path="/searchReviews" exact element={<SearchReviews />}></Route>}
          {<Route path="/productRecommend" exact element={<ProductRecommendation />}></Route>}
          
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;
