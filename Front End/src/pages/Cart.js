import './Cart.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const userId=localStorage.getItem("userId");

    useEffect(() => {

        fetch(`http://localhost:8080/ServletAPI/api/cart/get?user=${userId}`)
            .then(response => response.json())
            .then(data => setCartItems(data))
            .catch(error => console.error('Error fetching cart items:', error));
    }, []);

    const calculateTotalPrice = () => {
        return cartItems!=null ?cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2):0.00;
    };
    const calculateTotalDiscount=()=>{
      return cartItems!=null ?cartItems.reduce((discount, item) => discount + (item.retailerDiscount*item.quantity), 0).toFixed(2):0.00;
    }
    const calculateItems = () => {
        return cartItems!=null ?cartItems.reduce((quantity, item) => quantity + item.quantity, 0).toFixed(0):0.00;
    };
    const handleDeleteCart = (Id) => {
        axios.delete(`http://localhost:8080/ServletAPI/api/cart/remove?cart=${Id}`);
        window.alert("Removed from Cart");
        window.location.reload();

    };
    const handleCheckOut=()=>{
        navigate("/checkout",{ state: { cartItems } });  
    }
  return (
    <div><Header
    ></Header>
    <div className="cart-container" style={{marginTop:"20px"}}>
      <div className="cart-title">
        <h1>Shopping Cart</h1>

      </div>
      
      <div className="cart-items">
        {cartItems!=null ? cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img 
              className="cart-product-image" 
              src={`/product_images/${item.productId}${item.fileFormat}`} 
              alt={item.name}
            style={{width:"25%"}}/>
            
            <div className="cart-product-details">
              <h3 style={{  borderBottom: "2px solid #ddd"}}>{item.name}</h3>
              <p style={{width:"70%"}}><strong>About this item: </strong>{item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Accessories:</strong> {item.accessories!=null ? item.accessories : "No accessories"}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            
            <div className="product-actions">
            <span>${item.totalPrice.toFixed(2)}</span>
            <br></br>
              <button className="cart-delete-btn"style={{marginTop:"30px"}} onClick={() => handleDeleteCart(item.cart_id)} >Delete</button>
            </div>


          </div>
        )):<div></div>}
      </div>

      <h2 className="product-cart-summary" style={{textAlign:"right",marginRight:"185px",fontSize:"20px"}}>Subtotal ({calculateItems()} items): ${calculateTotalPrice()}</h2>
        
        <h2 className="product-cart-summary" style={{textAlign:"right",marginRight:"285px",fontSize:"20px"}}>Discount: ${calculateTotalDiscount()}</h2>
        <h2 className="product-cart-summary" style={{textAlign:"right",marginRight:"240px",fontSize:"20px",color:"red"}}>Delivery Charges applicable if choosen at checkout: ${cartItems.length>0&&10}</h2>
      {cartItems.length>0 && <div className="product-cart-summary">

        <h2>Grand Total: ${calculateTotalPrice()-calculateTotalDiscount()}</h2>
        {cartItems.length>0&&<button className="checkout-btn" style={{marginLeft:"50px"}} onClick={() => handleCheckOut()}>Proceed to Checkout</button>}
      </div>}
    </div>
    </div>
  );
};

export default Cart;
