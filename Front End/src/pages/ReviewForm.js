import React, { useState } from 'react';
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom'; // To access navigation state
import { FaStar } from 'react-icons/fa';
import './ReviewForm.css';

const ReviewForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, orderItemIndex } = location.state || {}; 
  const selectedItem = order?.orderItems[orderItemIndex]; // Get the specific item using the index
  const address= order.address.split(",");
  const todayDate = new Date().toISOString().split('T')[0];

  const [review, setReview] = useState({
    productName: selectedItem?.name || '',
    productCategory: selectedItem?.category || '',
    productPrice: selectedItem?.price ? `$${selectedItem.price}` : '',
    productId: selectedItem?.productId ? selectedItem.productId:null,
    storeID: order.deliveryOption==="store_pickup"?order.StoreId:null, 
    storeZip: order.deliveryOption==="store_pickup"?address[3]:null,
    storeCity: order.deliveryOption==="store_pickup"?address[1]:null,
    storeState: order.deliveryOption==="store_pickup"?address[2]:null,
    productOnSale: 'Yes',
    manufacturerName: selectedItem?.manufacturerName || '',
    manufacturerRebate: Number(selectedItem?.manufacturerRebate)>0,
    userId: localStorage.getItem('userId') || '',
    userName: localStorage.getItem('uname')||'',
    userAge: '',
    userGender: '',
    userOccupation: '',
    reviewRating: 0,
    reviewDate: todayDate,
    reviewText: '',
  });

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setReview({ ...review, reviewRating: rating });
  };

  async function handleSubmit(e){
    e.preventDefault();
    console.log('Submitted Review:', review);
   
    try {
        await axios.post(
          `http://localhost:8080/ServletAPI/api/addProductReview`,
          review,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        window.alert(
          "Your Review has been Recieved"
        );
        navigate("/Home");
      } catch (error) {
        console.error("Error placing the order:", error);
        window.alert("Failed to place the order. Please try again.");
      }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2>Product Review Form</h2>
      
      {/* Non-editable fields */}
      <div className="non-editable-fields">
        <label>
          Product Name:
          <input type="text" value={review.productName} readOnly />
        </label>
        <label>
          Product Category:
          <input type="text" value={review.productCategory} readOnly />
        </label>
        <label>
          Product Price:
          <input type="text" value={review.productPrice} readOnly />
        </label>
        <label>
          Store ID:
          <input type="text" value={review.storeID} readOnly />
        </label>
        <label>
          Store Zip:
          <input type="text" value={review.storeZip} readOnly />
        </label>
        <label>
          Store City:
          <input type="text" value={review.storeCity} readOnly />
        </label>
        <label>
          Store State:
          <input type="text" value={review.storeState} readOnly />
        </label>
        <label>
          Product On Sale:
          <input type="text" value={review.productOnSale} readOnly />
        </label>
        <label>
          Manufacturer Name:
          <input type="text" value={review.manufacturerName} readOnly />
        </label>
        <label>
          Manufacturer Rebate:
          <input type="text" value={review.manufacturerRebate} readOnly />
        </label>
        <label>
          User ID:
          <input type="text" value={review.userId} readOnly />
        </label>
      </div>

      {/* Editable fields */}
      <div className="editable-fields">
        <label>
          User Age:
          <input type="number" name="userAge" value={review.userAge} onChange={handleChange} />
        </label>
        <label>
          User Gender:
          <input type="text" name="userGender" value={review.userGender} onChange={handleChange} />
        </label>
        <label>
          User Occupation:
          <input type="text" name="userOccupation" value={review.userOccupation} onChange={handleChange} />
        </label>
        <label>
          Review Rating:
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={index}
                  size={24}
                  color={ratingValue <= review.reviewRating ? "#ffc107" : "#e4e5e9"}
                  onClick={() => handleRatingChange(ratingValue)}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </div>
        </label>
        <label>
          Review Date:
          <input type="date" name="reviewDate" value={todayDate} />
        </label>
        <label>
          Review Text:
          <textarea name="reviewText" value={review.reviewText} onChange={handleChange} />
        </label>
      </div>
      
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
