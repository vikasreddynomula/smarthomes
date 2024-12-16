package com.example;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "transaction_details")
public class TransactionDetails implements Serializable {
	
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cardNumber;
    private String cvv;
    private String expiryDate;
	private double grandTotal;
    private double totalRetailerDiscount;
    private double totalRebateEligible;
    private Double shippingCostForDelivery;
    
	public Double getShippingCostForDelivery() {
		return shippingCostForDelivery;
	}
	public void setShippingCostForDelivery(Double shippingCostForDelivery) {
		this.shippingCostForDelivery = shippingCostForDelivery;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCardNumber() {
		return cardNumber;
	}
	public void setCardNumber(String cardNumber) {
		this.cardNumber = cardNumber;
	}
	public String getCvv() {
		return cvv;
	}
	public void setCvv(String cvv) {
		this.cvv = cvv;
	}
	public String getExpiryDate() {
		return expiryDate;
	}
	public void setExpiryDate(String expiryDate) {
		this.expiryDate = expiryDate;
	}
	public double getGrandTotal() {
		return grandTotal;
	}
	public void setGrandTotal(double grandTotal) {
		this.grandTotal = grandTotal;
	}
	public double getTotalRetailerDiscount() {
		return totalRetailerDiscount;
	}
	public void setTotalRetailerDiscount(double totalRetailerDiscount) {
		this.totalRetailerDiscount = totalRetailerDiscount;
	}
	public double getTotalRebateEligible() {
		return totalRebateEligible;
	}
	public void setTotalRebateEligible(double totalRebateEligible) {
		this.totalRebateEligible = totalRebateEligible;
	}
}
