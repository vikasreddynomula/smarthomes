import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Header from "./Header"; // Assuming you have a Header component
import 'chart.js/auto'; // Import to register the required chart components

const SalesReport = () => {
    const [reportType, setReportType] = useState('productsSold');
    const [productsSold, setProductsSold] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Sales ($)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ],
    });

    useEffect(() => {
        // Fetch data based on reportType
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/ServletAPI/api/salesReport?type=${reportType}`);
                
                if (reportType === 'productsSold') {
                    setProductsSold(response.data);
                    
                    // Check if response data is valid
                    if (response.data && Array.isArray(response.data)) {
                        // Prepare data for the bar chart
                        const labels = response.data.map(product => product.productName);
                        const salesData = response.data.map(product => product.totalSales);
                        
                        setChartData({
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Total Sales ($)',
                                    data: salesData,
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                }
                            ],
                        });
                    }
                } else if (reportType === 'dailySales') {
                    setDailySales(response.data);
                    
                    // Prepare data for the bar chart for daily sales
                    if (response.data && Array.isArray(response.data)) {
                        const labels = response.data.map(sale => sale.purchaseDate);
                        const salesData = response.data.map(sale => sale.dailyTotal);
                        
                        setChartData({
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Total Daily Sales ($)',
                                    data: salesData,
                                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                }
                            ],
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [reportType]);

    return (
        <div style={{ textAlign: 'center' }}>
            <Header />
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <button onClick={() => setReportType('productsSold')} style={{ marginRight: '10px', borderRadius: '10px', backgroundColor: 'orange', color: 'white', height: '40px' }}>
                    Products Sold
                </button>
                <button onClick={() => setReportType('dailySales')} style={{ borderRadius: '10px', backgroundColor: 'orange', color: 'white', height: '40px' }}>
                    Daily Sales
                </button>
            </div>

            {reportType === 'productsSold' ? (
                <div>
                    <h2 >Products Sold</h2>
                    <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity Sold</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsSold.map((product, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.productName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.totalQuantity}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${product.totalSales.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 >Sales Bar Chart</h3>
                    {chartData.labels.length > 0 ? (
                        <Bar data={chartData} />
                    ) : (
                        <p>No data available for chart</p>
                    )}
                </div>
            ) : (
                <div>
                    <h2 >Daily Sales</h2>
                    <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailySales.map((sale, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sale.purchaseDate}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>${sale.dailyTotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br></br>
                    <h3>Daily Sales Bar Chart</h3>
                    {chartData.labels.length > 0 ? (
                        <Bar data={chartData} />
                    ) : (
                        <p>No data available for chart</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SalesReport;
