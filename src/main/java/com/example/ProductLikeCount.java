package com.example;

public class ProductLikeCount {
	
    private Product product;
    private Long likeCount;

    public ProductLikeCount(Product product, Long likeCount) {
        this.product = product;
        this.likeCount = likeCount;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }
}
