package com.example;

public class DailySales {
	
    private String purchaseDate;
    private double dailyTotal;

    public DailySales() {
    	
    }
    public DailySales(String purchaseDate, double dailyTotal) {
        this.purchaseDate = purchaseDate;
        this.dailyTotal = dailyTotal;
    }

    // Getters and Setters
    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public double getDailyTotal() {
        return dailyTotal;
    }

    public void setDailyTotal(double dailyTotal) {
        this.dailyTotal = dailyTotal;
    }
}
