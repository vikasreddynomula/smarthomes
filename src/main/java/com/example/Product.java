package com.example;

import java.io.Serializable;
//import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Products")
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	private String name;
    private double price;
    private String description;
    private String category;
    private String accessories; 
    private String fileFormat;
    private String manufacturerName;
    private int quantity;
    
    public double getRetailerDiscount() {
		return retailerDiscount;
	}

	public void setRetailerDiscount(double retailerDiscount) {
		this.retailerDiscount = retailerDiscount;
	}

	public double getManufacturerRebate() {
		return manufacturerRebate;
	}

	public void setManufacturerRebate(double manufacturerRebate) {
		this.manufacturerRebate = manufacturerRebate;
	}

	private double retailerDiscount;
    private double manufacturerRebate;
    
    public Product() {
    	
    }

    // Constructor
    public Product(String name, double price, String description, String category, String accessories,double manufacturerRebate,double retailerDiscount,int quantity) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.accessories = accessories;
        this.manufacturerRebate=manufacturerRebate;
        this.retailerDiscount=retailerDiscount;
        this.quantity=quantity;

    }

    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAccessories() {
        return accessories;
    }

    public void setAccessories(String accessories) {
        this.accessories = accessories;
    }

	public String getFileFormat() {
		return fileFormat;
	}

	public void setFileFormat(String fileFormat) {
		this.fileFormat = fileFormat;
	}

	public String getManufacturerName() {
		return manufacturerName;
	}

	public void setManufacturerName(String manufacturerName) {
		this.manufacturerName = manufacturerName;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
}
