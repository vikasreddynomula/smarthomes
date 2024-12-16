package com.example;

import org.bson.Document;


public class ProductReview {
    private String productName;
    private String productCategory;
    private String productPrice;
    private Long productId;
    private String storeID;
    private String storeZip;
    private String storeCity;
    private String storeState;
    private String productOnSale;
    private String manufacturerName;
    private boolean manufacturerRebate;
    private String userId;
    private String userName;
    private int userAge;
    private String userGender;
    private String userOccupation;
    private int reviewRating;
    private String reviewDate;
    private String reviewText;

    // Getters and setters...

    // Method to convert Review object to MongoDB Document
    public Document toDocument() {
        return new Document("productName", productName)
                .append("productCategory", productCategory)
                .append("productPrice", productPrice)
                .append("productId",productId)
                .append("storeID", storeID)
                .append("storeZip", storeZip)
                .append("storeCity", storeCity)
                .append("storeState", storeState)
                .append("productOnSale", productOnSale)
                .append("manufacturerName", manufacturerName)
                .append("manufacturerRebate", manufacturerRebate)
                .append("userId", userId)
                .append("userName", userName)
                .append("userAge", userAge)
                .append("userGender", userGender)
                .append("userOccupation", userOccupation)
                .append("reviewRating", reviewRating)
                .append("reviewDate", reviewDate)
                .append("reviewText", reviewText);
    }
}
