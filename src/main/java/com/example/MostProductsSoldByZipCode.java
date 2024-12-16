package com.example;

public class MostProductsSoldByZipCode {
	
	
	private String zipCode;
	
	private Long totalProducts;
	
	private Long StoreId;
	
	public MostProductsSoldByZipCode(String zipCode, Long totalProducts, Long StoreId) {
        this.zipCode = zipCode;
        this.totalProducts = totalProducts;
        this.StoreId = StoreId;
    }
	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public Long getTotalProducts() {
		return totalProducts;
	}

	public void setTotalProducts(Long totalProducts) {
		this.totalProducts = totalProducts;
	}

	public Long getStoreId() {
		return StoreId;
	}

	public void setStoreId(Long storeId) {
		StoreId = storeId;
	}


}
