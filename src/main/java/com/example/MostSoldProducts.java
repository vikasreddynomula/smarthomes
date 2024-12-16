package com.example;

public class MostSoldProducts {
	
	private Product product;
	
	private Long totalQuantity;
	
	public MostSoldProducts(Product product, Long totalQuantity) {
        this.product = product;
        this.totalQuantity = totalQuantity;
    }

	
	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Long getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(Long totalQuantity) {
		this.totalQuantity = totalQuantity;
	}


	
	

}
