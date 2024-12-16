package com.example;

public class ProductSales {
    private String productName;
    private double price;
    private long totalQuantity;
    private double totalSales;


    public ProductSales(){
    	
    }
    public ProductSales(String productName, double price, long totalQuantity, double totalSales) {
        this.productName = productName;
        this.price = price;
        this.totalQuantity = totalQuantity;
        this.totalSales = totalSales;
    }

    // Getters and Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }
}
