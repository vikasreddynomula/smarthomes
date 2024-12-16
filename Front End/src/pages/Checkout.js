import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderItems = location.state?.cartItems || null;
  const userEmail = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("uname");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [selectedPickupAddress, setSelectedPickupAddress] = useState("");
  const [storeId,setStoreId]= useState("");
  const [pickupAddresses, setPickupAddresses] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch pickup addresses from API and map the store id with concatenated fields
  useEffect(() => {
    const fetchPickupAddresses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/ServletAPI/api/stores"
        );
        const stores = response.data;
        const formattedAddresses = stores.map((store) => ({
          id: store.id,
          concatenatedAddress: `${store.id} - ${store.street}, ${store.city}, ${store.state}, ${store.zipCode}`
        }));
        setPickupAddresses(formattedAddresses);
      } catch (error) {
        console.error("Error fetching pickup addresses:", error);
      }
    };
    

    fetchPickupAddresses();
  }, []);

  useEffect(() => {
    const isCardValid = cardNumber.length === 16;
    const isCvvValid = cvv.length === 3;
    const isExpiryValid = expiryDate !== "";
    const isPhoneValid = phoneNumber.match(/^[0-9]{10}$/);
    const isAddressValid =
      deliveryOption === "delivery"
        ? streetAddress !== "" && city !== "" && state !== "" && zipCode !== ""
        : selectedPickupAddress !== "";

    setIsFormValid(
      isCardValid && isCvvValid && isExpiryValid && isPhoneValid && isAddressValid
    );
  }, [
    cardNumber,
    cvv,
    expiryDate,
    streetAddress,
    city,
    state,
    zipCode,
    phoneNumber,
    deliveryOption,
    selectedPickupAddress,
  ]);

  const calculateTotalPrice = () => {
    return orderItems != null
      ? orderItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)
      : 0.0;
  };
  const calculateWarrantyCharges = () => {
    return orderItems != null
      ? orderItems.reduce((total, item) => {
          return total + (item.isWarrantyAdded ? 40 : 0);
        }, 0).toFixed(2)
      : '0.00';
  };
  
  const calculateTotalQuantity = () => {
    return orderItems != null
      ? orderItems.reduce((total, item) => total + item.quantity, 0).toFixed(2)
      : 0.0;
  };
  const calculateTotalDiscount = () => {
    return orderItems != null
      ? orderItems.reduce(
          (discount, item) => discount + item.retailerDiscount * item.quantity,
          0
        ).toFixed(2)
      : 0.0;
  };

  const calculateGrandTotal = () => {
    return Number(calculateTotalPrice()) - Number(calculateTotalDiscount()) + (deliveryOption==="delivery"?Number(10):Number(0))+Number(calculateWarrantyCharges());
  };

  const calculateTotalRebateEligible = () => {
    return orderItems != null
      ? orderItems.reduce(
          (discount, item) => discount + item.manufacturerRebate * item.quantity,
          0
        ).toFixed(2)
      : 0.0;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const transactionDetails = {
      cardNumber: cardNumber,
      cvv: cvv,
      expiryDate: expiryDate,
      grandTotal: calculateGrandTotal(),
      totalRetailerDiscount: calculateTotalDiscount(),
      totalRebateEligible: calculateTotalRebateEligible(),
      shippingCostForDelivery: deliveryOption==="delivery"? "10":"0",
    };

    const checkoutData = {
      orderItems,
      address:
        deliveryOption === "delivery"
          ? `${streetAddress}, ${city}, ${state}, ${zipCode}`
          : selectedPickupAddress,
      phoneNumber,
      deliveryOption,
      transactionDetails,
      userId: userId,
      email: userEmail,
      StoreId: storeId===""?null:storeId,
      shippingCostForDelivery: "10",
      warrantyCharges:calculateWarrantyCharges(),
      customerName: userName,
      totalSales: calculateGrandTotal(),
      totalQuantity: calculateTotalQuantity(),
    };

    console.log(checkoutData);
    try {
      await axios.post(
        `http://localhost:8080/ServletAPI/api/order/place`,
        checkoutData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      window.alert(
        "Your order will be delivered within 2 weeks. You have the option to cancel your order 5 days before the delivery date. Thanks for shopping with us!"
      );
      navigate("/Home");
    } catch (error) {
      console.error("Error placing the order:", error);
      window.alert("Failed to place the order. Please try again.");
    }
  }

  return (
    <div>
      <Header></Header>
      <div className="checkout-container" style={{ marginTop: "20px" }}>
        <h3 style={{ textAlign: "center", color: "black" }}>
          Address and Payment Information
        </h3>
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Card Details Section */}
          <div className="card-details">
            <h3>Card Details</h3>
            <div className="input-group">
              <label>Card Number</label>
              <input
                type="text"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                placeholder="1234 5678 9012 3456"
                style={{ width: "85%" }}
              />
            </div>
            <div className="card-info-row">
              <div className="input-group">
                <label>CVV</label>
                <input
                  type="password"
                  maxLength="3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  placeholder="CVV"
                  style={{ width: "70%" }}
                />
              </div>
              <div className="input-group">
                <label>Expiry Date</label>
                <input
                  type="month"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="user-details">
            <h3>Contact Information</h3>
            {deliveryOption === "delivery" && (
              <>
                <div className="input-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    placeholder="Enter your street address"
                    style={{ width: "85%" }}
                  />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Enter your city"
                    style={{ width: "85%" }}
                  />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="Enter your state"
                    style={{ width: "85%" }}
                  />
                </div>
                <div className="input-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    placeholder="Enter your ZIP Code"
                    style={{ width: "85%" }}
                  />
                </div>
              </>
            )}
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                style={{ width: "85%" }}
              />
            </div>
          </div>

          {/* Delivery Option Section */}
          <div className="delivery-option">
            <h3>Delivery Option</h3>
            <div className="delivery-method">
              <label className="radio-container">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="delivery"
                  checked={deliveryOption === "delivery"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <span className="radio-label">Home Delivery</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="store_pickup"
                  checked={deliveryOption === "store_pickup"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <span className="radio-label">Store Pick-up</span>
              </label>
            </div>

            {/* Pickup Address Dropdown */}
            {deliveryOption === "store_pickup" && (
  <div className="pickup-addresses">
    <h4>Select a Pickup Address:</h4>
    <select
      value={selectedPickupAddress}
      onChange={(e) => {
        const selectedIndex = e.target.selectedIndex;
        const selectedOption = e.target.options[selectedIndex];
        const storeId = selectedOption.getAttribute("data-storeid");
        const address = selectedOption.value;
        setSelectedPickupAddress(address);
        setStoreId(storeId);
      }}
      required
    >
      <option value="">--Select an Address--</option>
      {pickupAddresses.map((store) => (
        <option key={store.id} value={store.concatenatedAddress.split(" - ")[1]} data-storeid={store.id}>
          {store.concatenatedAddress.split(" - ")[1]} {/* Display only the address part */}
        </option>
      ))}
    </select>
  </div>
)}
</div>

          {/* Submit Button */}
          <div className="submit-button">
            <button type="submit" disabled={!isFormValid}>
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
