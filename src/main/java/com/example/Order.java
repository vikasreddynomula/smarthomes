package com.example;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.io.Serializable;

@Entity
@Table(name="orders")
public class Order implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long id;
	
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER,orphanRemoval = true)
    @JoinColumn(name = "order_id") 
    private List<OrderItems> orderItems;
    
    private String address;
    private String deliveryOption; 
    private String phoneNumber;
    private String pickupAddress;   
    private String orderNumber;
    private String deliveryDate;
    private String cancelAvailableTill;
    private String orderStatus;
    private Long userId;
    private String email;
    private Long StoreId;
    private Double shippingCostForDelivery;
    public Double getWarrantyCharges() {
		return warrantyCharges;
	}


	public void setWarrantyCharges(Double warrantyCharges) {
		this.warrantyCharges = warrantyCharges;
	}


	private Double warrantyCharges;
    private String purchaseDate;
    private String customerName;
    public Double getTotalSales() {
		return totalSales;
	}


	public void setTotalSales(Double totalSales) {
		this.totalSales = totalSales;
	}


	public Double getTotalQuantity() {
		return totalQuantity;
	}


	public void setTotalQuantity(Double totalQuantity) {
		this.totalQuantity = totalQuantity;
	}


	private Double totalSales;
    private Double totalQuantity;
    

    @OneToOne(cascade = CascadeType.ALL,orphanRemoval = true,fetch = FetchType.EAGER)
    @JoinColumn(name = "transaction_details_id", referencedColumnName = "id")
    private TransactionDetails transactionDetails;
    
    
    public Order() {
    	
    }
    

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<OrderItems> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<OrderItems> orderItems) {
		this.orderItems = orderItems;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDeliveryOption() {
		return deliveryOption;
	}

	public void setDeliveryOption(String deliveryOption) {
		this.deliveryOption = deliveryOption;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getPickupAddress() {
		return pickupAddress;
	}

	public void setPickupAddress(String pickupAddress) {
		this.pickupAddress = pickupAddress;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(String deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public String getCancelAvailableTill() {
		return cancelAvailableTill;
	}

	public void setCancelAvailableTill(String cancelAvailableTill) {
		this.cancelAvailableTill = cancelAvailableTill;
	}

	public String getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(String orderStatus) {
		this.orderStatus = orderStatus;
	}




	public Long getUserId() {
		return userId;
	}


	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public Long getStoreId() {
		return StoreId;
	}


	public void setStoreId(Long storeId) {
		StoreId = storeId;
	}


	public Double getShippingCostForDelivery() {
		return shippingCostForDelivery;
	}


	public void setShippingCostForDelivery(Double shippingCostForDelivery) {
		this.shippingCostForDelivery = shippingCostForDelivery;
	}


	public String getPurchaseDate() {
		return purchaseDate;
	}


	public void setPurchaseDate(String purchaseDate) {
		this.purchaseDate = purchaseDate;
	}


	public String getCustomerName() {
		return customerName;
	}


	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}


	public TransactionDetails getTransactionDetails() {
		return transactionDetails;
	}


	public void setTransactionDetails(TransactionDetails transactionDetails) {
		this.transactionDetails = transactionDetails;
	}


	public Order(List<OrderItems> orderItems, String address, String deliveryOption, String phoneNumber,
			String pickupAddress, String orderNumber, String deliveryDate, String cancelAvailableTill,
			String orderStatus, Long userId, TransactionDetails transactionDetails,String email) {
		super();
		this.orderItems = orderItems;
		this.address = address;
		this.deliveryOption = deliveryOption;
		this.phoneNumber = phoneNumber;
		this.pickupAddress = pickupAddress;
		this.orderNumber = orderNumber;
		this.deliveryDate = deliveryDate;
		this.cancelAvailableTill = cancelAvailableTill;
		this.orderStatus = orderStatus;
		this.userId= userId;
		this.transactionDetails = transactionDetails;
		this.email = email;
	}


	@Override
	public String toString() {
		return "Order [orderItems=" + orderItems + ", address=" + address + ", deliveryOption=" + deliveryOption
				+ ", phoneNumber=" + phoneNumber + ", pickupAddress=" + pickupAddress + ", orderNumber=" + orderNumber
				+ ", deliveryDate=" + deliveryDate + ", cancelAvailableTill=" + cancelAvailableTill + ", orderStatus="
				+ orderStatus + ", userId=" + userId + ", transactionDetails=" + transactionDetails + "]";
	}
    
}
