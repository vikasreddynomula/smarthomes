import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "./Header";
import likedIcon from "./liked.png";

const MostLikedProducts = () => {
    const [mostLikedProducts, setMostLikedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productsSoldByZipcode, setProductsSoldByZipcode] = useState([]);
    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [selectedProductLikeCount, setSelectedProductLikeCount] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [likedProducts, setLikedProducts] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toggleOption, setToggleOption] = useState('Most Liked'); // To track the toggle option
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 
            setError(null); 
            try {
                let response;
                if (toggleOption === 'Most Liked') {
                    response = await axios.get('http://localhost:8080/ServletAPI/api/getmostliked');
                    setMostLikedProducts(response.data);
                } else if (toggleOption === 'Most Sold by Zipcode') {
                    response = await axios.get('http://localhost:8080/ServletAPI/api/getsoldbyzipcode');
                    setProductsSoldByZipcode(response.data);
                } else {
                    response = await axios.get('http://localhost:8080/ServletAPI/api/getmostsoldproducts');
                    setMostSoldProducts(response.data);
                }
            } catch (err) {
                setError('Failed to fetch data.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchData();
    }, [toggleOption]);

    useEffect(() => {
        async function fetchLikedProducts() {
            try {
                const response = await fetch(`http://localhost:8080/ServletAPI/api/productlike?userId=${userId}`);
                if (response.ok) {
                    const likedProductData = await response.json();
                    const likedProductsMap = mostLikedProducts.reduce((acc, productLikeCount) => {
                        const product = productLikeCount.product;
                        const likedProduct = likedProductData.find((lp) => Number(lp.productId) === Number(product.id));
                        acc[product.id] = likedProduct ? likedProduct.isLiked : false;
                        return acc;
                    }, {});
                    setLikedProducts(likedProductsMap);
                } else {
                    console.error("Failed to fetch liked products");
                }
            } catch (error) {
                console.error("Error fetching liked products:", error);
            }
        }

        if (userId && mostLikedProducts.length > 0) {
            fetchLikedProducts();
        }
    }, [userId]);

    async function handleAddtoCart(product) {
        const productToAdd = {
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            quantity: quantity,
            accessories: product.accessories,
            fileFormat: product.fileFormat,
            manufacturerRebate: product.manufacturerRebate,
            manufacturerName: product.manufacturerName,
            retailerDiscount: product.retailerDiscount,
        };
        const productId = product.id;
        await fetch(`http://localhost:8080/ServletAPI/api/cart/add?user=${userId}&product=${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(productToAdd),
        })
            .then((response) => response.json())
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding product to cart:", error);
            });
    }

    const handleViewDetails = (product, likeCount) => {
        setSelectedProduct(product);
        setSelectedProductLikeCount(likeCount);
    };

    const handleToggleChange = (option) => {
        setSelectedProduct(null); // Reset selected product on toggle change
        setToggleOption(option);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Header />
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <button onClick={() => handleToggleChange('Most Liked')} style={{ marginRight: '10px', borderRadius: "10px", backgroundColor: "orange", color: "white", height: "40px" }}>
                    Most Liked
                </button>
                <button onClick={() => handleToggleChange('Most Sold by Zipcode')} style={{ marginRight: '10px', borderRadius: "10px", backgroundColor: "orange", color: "white", height: "40px" }}>
                    Most Sold by Zipcode
                </button>
                <button onClick={() => handleToggleChange('Most Sold Products')} style={{ borderRadius: "10px", backgroundColor: "orange", color: "white", height: "40px" }}>
                    Most Sold Products
                </button>
            </div>

            <div className="most-liked-products-container">
                {toggleOption === 'Most Sold by Zipcode' ? (
                    <div style={{ padding: '20px' }}>
                        {productsSoldByZipcode.map((item, index) => (
                            <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', margin: '10px 0', backgroundColor: '#f9f9f9' }}>
                                <h3>Zip Code: {item.zipCode}</h3>
                                <p><strong>Total Products Sold:</strong> {item.totalProducts}</p>
                                <p><strong>Store ID:</strong> {item.StoreId}</p>
                            </div>
                        ))}
                    </div>
                ) : selectedProduct ? (
                    <div className="product-details" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", padding: "20px", maxWidth: "1000px", margin: "30px auto 20px auto" }}>
                        <div className="product-image" style={{ flex: "1", maxWidth: "800px" }}>
                            <img
                                src={`/product_images/${selectedProduct.id}${selectedProduct.fileFormat}`}
                                alt={selectedProduct.name}
                                style={{ maxWidth: "130%", minWidth: "120%", height: "auto", borderRadius: "8px" }}
                            />
                        </div>

                        <div className="product-info" style={{ flex: "2", fontFamily: "Arial, sans-serif" }}>
                            <h2>{selectedProduct.name}</h2>
                            <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
                            <p><strong>Description: </strong>{selectedProduct.description}</p>
                            <p><strong>Category: </strong>{selectedProduct.category}</p>
                            <div style={{ display: "flex" }}>
                                <p><strong>Price:</strong></p>
                                {selectedProduct.price !== (selectedProduct.price - selectedProduct.retailerDiscount) ? (
                                    <>
                                        <p className="manager-strikethrough" style={{ marginLeft: "10px", marginRight: "20px" }}>
                                            ${selectedProduct.price.toFixed(2)}
                                        </p>
                                        <p style={{ marginLeft: "10px", marginRight: "20px", fontWeight: 'bold' }}>
                                            ${(selectedProduct.price - selectedProduct.retailerDiscount).toFixed(2)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="nostrike" style={{ marginLeft: "10px", marginRight: "20px", fontWeight: 'bold' }}>
                                        ${selectedProduct.price.toFixed(2)}
                                    </p>
                                )}
                            </div>

                            <p><strong>Availability:</strong> In Stock</p>

                            {toggleOption !== 'Most Sold Products'&&<div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
                                <button
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        marginRight: "10px",
                                    }}
                                >
                                    <img
                                        src={likedIcon}
                                        alt="like"
                                        style={{
                                            width: "50px",
                                            height: "30px",
                                        }}
                                    />
                                </button>
                                <span>{`${selectedProductLikeCount} Like`}</span>
                            </div>}

                            <div style={{ marginTop: "10px" }}>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    style={{
                                        backgroundColor: "black",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 16px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
                        {(toggleOption === 'Most Sold Products' ? mostSoldProducts : mostLikedProducts).map((productLikeCount) => {
                            const product = productLikeCount.product;
                            const finalPrice = product.price - product.retailerDiscount;

                            return (
                                <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', textAlign: 'center', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                                        <img
                                            src={`/product_images/${product.id}${product.fileFormat}`}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div>
                                        <h3>{product.name}</h3>
                                        <div style={{ margin: '10px 0' }}>
                                            {product.price !== finalPrice ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    <span style={{ fontWeight: 'bold', color: '#333' }}>
                                                        ${finalPrice.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{ fontWeight: 'bold', color: '#333' }}>
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '15px' }}>
                                            <button
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                                onClick={() => handleAddtoCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    backgroundColor: '#87CEEB',
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                                onClick={() => handleViewDetails(product, productLikeCount.likeCount)}
                                            >
                                                View details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MostLikedProducts;
