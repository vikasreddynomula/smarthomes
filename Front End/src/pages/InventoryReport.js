import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from "./Header";
// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InventoryReport = () => {
    const [products, setProducts] = useState([]);
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [rebateProducts, setRebateProducts] = useState([]);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        // Fetch product data
        axios
            .get("http://localhost:8080/ServletAPI/api/products")
            .then((response) => {
                const data = response.data;
                const productsArray = Object.keys(data).map((key) => {
                    return {
                        ...data[key],
                    };
                });
                
                // Set products state
                setProducts(productsArray);

                // Filter products on sale (inStock > 0)
                const onSale = productsArray.filter(product => product.inStock > 0);
                setOnSaleProducts(onSale);

                // Filter products with manufacturer rebates (manufacturerRebate > 0)
                const withRebates = productsArray.filter(product => product.manufacturerRebate > 0);
                setRebateProducts(withRebates);

                // Prepare data for the bar chart
                const labels = productsArray.map(product => product.name);
                const productsData = productsArray.map(product => product.inStock);
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Available Quantity',
                            data: productsData,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        }
                    ],
                });
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <Header />
            <h2>Inventory</h2>

            <h3>All Products</h3>
            <table style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Available Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((item, index) => (
                        <tr key={index} >
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.finalPrice.toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.inStock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <h3>Inventory Bar Chart</h3>
            {chartData.labels ? ( // Check if chartData has labels before rendering the chart
                <Bar data={chartData} />
            ) : (
                <p>Loading chart data...</p> // Display a loading message while chartData is being prepared
            )}
            
            <h3 style={{marginTop:"150px"}}>Products on Sale</h3>
            <table style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {onSaleProducts.map((item, index) => (
                        <tr key={index} >
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.finalPrice.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={{marginTop:"150px"}}>Products with Manufacturer Rebates</h3>
            <table style={{ width: '80%', margin: '20px auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Manufacturer Rebate</th>
                    </tr>
                </thead>
                <tbody>
                    {rebateProducts.map((item, index) => (
                        <tr key={index} >
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.finalPrice.toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.manufacturerRebate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </div>
    );
};

export default InventoryReport;
