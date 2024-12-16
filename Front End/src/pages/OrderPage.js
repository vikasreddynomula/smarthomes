import React, { useEffect, useState} from 'react';
import axios from 'axios';
import './OrderPage.css';
import Header from "./Header";
import { useNavigate} from "react-router-dom";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/ServletAPI/api/order/cancel?orderId=${orderId}`);
            if (response.status === 200) {
                window.alert("Order canceled successfully");
                setOrders(orders.filter(order => order.id !== orderId));
            } else {
                window.alert("Failed to cancel the order. Please try again.");
            }
        } catch (error) {
            console.error('Error cancelling the order:', error);
            window.alert("An error occurred while trying to cancel the order.");
        }
    };

    const handleWriteReview = (order, orderItemIndex) => {
        navigate('/addreview', { state: { order, orderItemIndex } });
    };



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/ServletAPI/api/order/get`, {
                    params: { user: userId }
                });
                setOrders(response.data);
            } catch (error) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [email]);

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="order-page">
            <Header></Header>
            <h1 className="page-title">Order Details</h1>
            {orders.length === 0 ? (
                <p className="no-orders">You have no orders.</p>
            ) : (
                orders.map((order, index) => (
                    <div key={index} className="order-card">
                        <div className="order-header">
                            <h2 style={{width:"700px"}}>Order Number #{order.orderNumber}</h2>
                        </div>
                        <div className="order-details-container">
                            <div className="order-page-cart-items">
                                <h3>Items:</h3>
                                {order.orderItems.map((item, itemIndex) => (
                                    <div key={itemIndex}>
                                        <p><strong>{item.name}</strong></p>
                                        <div className="order-cart-item">
                                            <img src={`/product_images/${item.productId}${item.fileFormat}`} alt={item.name} className="order-product-image" />
                                            <p className="order-item-description">{item.description}</p>
                                            <div className="cart-details">
                                                <p><strong>Price:</strong> ${item.price}</p>
                                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                                <p><strong>SubTotal:</strong> ${item.totalPrice}</p>
                                                <p><strong>Discount:</strong> ${(item.retailerDiscount*item.quantity).toFixed(2)}</p>
                                                <p><strong>Total:</strong> ${((item.price-item.retailerDiscount)*item.quantity).toFixed(2)}</p>
                                                <button
                                                    className="review-order-button"
                                                    style={{ marginTop: "30px", backgroundColor: "gold", color: "black", borderRadius: "5px", height: "30px", cursor: "pointer" }}
                                                    onClick={() => handleWriteReview(order, itemIndex)} // Pass the order and itemIndex
                                                >
                                                    Write a product review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-info">
                                <p><strong>Order Status:</strong> {order.orderStatus}</p>
                                {order.deliveryOption==="delivery" && <p><strong>Delivery Fees: </strong>${order.shippingCostForDelivery}</p>}
                                <p><strong>Warranty Charges: </strong>${order.warrantyCharges}</p>
                                <p><strong>Amount Paid: </strong>${order.totalSales}</p>
                                <p><strong>Card Number:</strong> **** **** **** {order.transactionDetails.cardNumber.slice(-4)}</p>
                                <p><strong>Delivery Option:</strong> {order.deliveryOption === "delivery" ? "Delivery" : "At Store Pick Up"}</p>
                                <p><strong>{order.deliveryOption === "delivery" ? "Address:" : "Pick Up Store Location:"}</strong> {order.address}</p>
                                <p><strong>Purchase Date: </strong>{order.purchaseDate}</p>
                                <p><strong>{order.deliveryOption === "delivery" ? "Delivery Date:" : "Pick Up Date:"}</strong> {order.deliveryDate}</p>
                                <p><strong>Cancellation Available Till:</strong> {order.cancelAvailableTill}</p>
                                <p style={{color:"green"}}><strong>Total Rebate Eligible: </strong>${order.transactionDetails.totalRebateEligible}</p>
                                <p style={{color:"red"}}>Note: please email your reciept to <strong>claimyourrebate@gmail.com </strong>to get your cashback </p>
                            </div>

                        </div>

                        <div className="order-actions">
                            <button
                                className="cancel-order-button"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={new Date() > new Date(order.cancelAvailableTill)}
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderPage;
