package com.example;


import java.io.Serializable;
//import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "order_items")
public class OrderItems implements Serializable {
    private static final long serialVersionUID = 1L;
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cart_id;
    
    public void setName(String name) {
		this.name = name;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public void setAccessories(String accessories) {
		this.accessories = accessories;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	private String name;
    private double price;
    private String category;
    private int quantity;
    private String accessories;
    private String description;
    private double totalPrice;
	private String fileFormat;
	private Long productId;
	public String getManufacturerName() {
		return manufacturerName;
	}

	public void setManufacturerName(String manufacturerName) {
		this.manufacturerName = manufacturerName;
	}

	private String manufacturerName;
	private Long user_id;
	public double getManufacturerRebate() {
		return manufacturerRebate;
	}

	public void setManufacturerRebate(double manufacturerRebate) {
		this.manufacturerRebate = manufacturerRebate;
	}

	public double getRetailerDiscount() {
		return retailerDiscount;
	}

	public void setRetailerDiscount(double retailerDiscount) {
		this.retailerDiscount = retailerDiscount;
	}

	private double manufacturerRebate;
	private double retailerDiscount;
	
	public OrderItems() {
		
	}

    public OrderItems(String name, double price, String category, int quantity, String accessories, String description,String fileFormat,Long user_id,Long productId) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.quantity = quantity;
        this.accessories = accessories;
        this.description = description;
        this.fileFormat=fileFormat;
        this.user_id=user_id;
        this.productId=productId;
    }
    public String getFileFormat() {
		return fileFormat;
	}

	public void setFileFormat(String fileFormat) {
		this.fileFormat = fileFormat;
	}

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getAccessories() {
        return accessories;
    }

    public String getDescription() {
        return description;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public Long getCart_id() {
		return cart_id;
	}

	public void setCart_id(Long cart_id) {
		this.cart_id = cart_id;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

    // You can also add setters and a method to recalculate totalPrice based on quantity if needed
}


