import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderManagement.css';
import Header from "./Header";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/ServletAPI/api/order/fetchAll')
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the orders!", error);
            });
    }, []);

    const updateOrderStatus = (orderId, newStatus, email) => {
        axios.put(`http://localhost:8080/ServletAPI/api/order/updateStatus`, null, {
            params: {
                orderId: orderId,
                orderStatus: newStatus,
                email:email
            }
        })
        .then(response => {
            console.log("Order status updated:", response);
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, orderStatus: newStatus } : order
            ));
            window.location.reload();
        })
        .catch(error => {
            console.error("There was an error updating the order status!", error);
        });

    };


    const cancelOrder = (orderId) => {
        axios.delete(`http://localhost:8080/ServletAPI/api/order/cancel`, {
            params: {
                orderId: orderId,
            }
        })
        .then(response => {
            console.log("Order canceled:", response);
            setOrders(orders.filter(order => order.id !== order.id));
            window.location.reload();
        })
        .catch(error => {
            console.error("There was an error canceling the order!", error);
        });
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div><Header></Header>
        <div className="orderM-order-management">
            
            <h1 className='orderM-h1'>Order Management</h1>
            {orders.map(order => (
                <div key={order.orderNumber} className="orderM-order-card">
                    <div className="orderM-order-header">
                        <h2 className='orderM-h2'>Order #{order.orderNumber}</h2>
                        <p>Status: <strong>{order.orderStatus}</strong></p>
                    </div>
                    <div className="orderM-order-details">
                        <p><strong>Customer Name:</strong> {order.customerName}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>{order.deliveryOption==="delivery"?"Address: ":"Pick Up Store Location: "}</strong> {order.address}</p>
                        <p><strong>Phone:</strong> {order.phoneNumber}</p>
                        <p><strong>Amount Paid: </strong> ${order.transactionDetails.grandTotal}</p>
                        <p><strong>Warranty Purchased: </strong>{order.warrantyCharges>0?"TRUE":"FALSE"}</p>
                        <p><strong>Delivery Option:</strong> {order.deliveryOption==="delivery"?order.deliveryOption:"At Store Pick Up"}</p>
                        <p><strong>{order.deliveryOption==="delivery"?"Delivery Date:":"Pick Up Date: "}</strong> {order.deliveryDate}</p>
                        <p><strong>Purchase Date</strong> {order.purchaseDate}</p>
                    </div>
                    <h3 className='orderM-h3'>Items</h3>
                    <div className="orderM-cart-items">
                        {order.orderItems.map(item => (
                            <div key={item.name} className="orderM-cart-item">
                                <img src={`/product_images/${item.productId}${item.fileFormat}`} alt={item.name} />
                                <div className="cart-item-details">
                                    <p><strong>Name:</strong> {item.name}</p>
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Total Price:</strong> ${item.totalPrice}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="orderM-actions">
                        <div className="orderM-status-update">
                            <label htmlFor={`status-${order.orderNumber}`}>Update Status: </label>
                            <select 
                                id={`status-${order.orderNumber}`} 
                                value={order.orderStatus} 
                                onChange={(e) => updateOrderStatus(order.id, e.target.value,order.email)}
                            >
                                <option value="Placed">Placed</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Ready for pick up">Ready for pick up</option>
                            </select>
                        </div>
                        <button className="orderM-cancel-order-btn" style={{marginTop:"20px"}} onClick={() => cancelOrder(order.id)}>
                            Cancel Order
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default OrderManagement;
