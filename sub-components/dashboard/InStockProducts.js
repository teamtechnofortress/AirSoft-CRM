'use client'

import React, { useEffect,useState } from 'react';
import axios from 'axios';
// import node module libraries
import Link from 'next/link';
import { ProgressBar, Col, Row, Card, Table, Image,Button,Spinner } from 'react-bootstrap';

// import required data files
// import ActiveProjectsData from "data/dashboard/ActiveProjectsData";

const InStockProducts = ({products}) => {
    // const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(true);

    // const fetchAllProducts = async () => {
    //     try {
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`);
    //         // console.log('API Response:', response.data);
    
    //         if (response.data && response.data.data) {
    //             setProducts(response.data.data); // Set products to the state
    //         } else {
    //             console.error('Unexpected API Response:', response.data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error.message);  // Log the error message
    //     } finally {
    //         setLoading(false); // Set loading to false after data fetch
    //     }
    // };

    // useEffect(() => {
    //     fetchAllProducts(); // Fetch products when the component is mounted
    // }, []);

    // if (loading) return (
    //     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    //         <Spinner animation="border" variant="primary" role="status">
    //             <span className="visually-hidden">Loading...</span>
    //         </Spinner>
    //     </div>
    // );
    
   
    return (
        <Row className="mt-4">
            {products.filter(product => product.stock_status === 'instock').map((product) => (
                <Col key={product.id} md={3} sm={6} xs={12} className="mb-4">
                    <Card style={{ width: "100%" }}>
                        <Card.Img 
                            variant="top" 
                            src={product.images.length > 0 ? product.images[0].src : "https://via.placeholder.com/150"} 
                            alt={product.images.length > 0 ? product.images[0].alt : "Product Image"} 
                            style={{ height: "180px", objectFit: "cover" }}
                        />
                        <Card.Body>
                            <Card.Title className="text-dark me-2">{product.name}</Card.Title>

                            <div className="d-flex align-items-center justify-content-between">
                                <Card.Text className="mb-0">{product.price} USD</Card.Text>
                                <Card.Text>{product.stock_status || "Out of stock"}</Card.Text>
                            </div>      
                            
                            <div className="d-flex align-items-center justify-content-between">
                                <Card.Text className='mb-3 mt-3'>SKU: {product.sku}</Card.Text>
                                <Card.Text className='mb-3 mt-3'>Total sales: {product.total_sales}</Card.Text>
                            </div>
                            <div className="d-flex align-items-center justify-content-end">
                                <Card.Text className="mb-0 me-3">{product.type}</Card.Text>
                                <Card.Text className=''>{product.status}</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

export default InStockProducts