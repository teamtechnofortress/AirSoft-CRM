'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';

const Page = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTotalOrders = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/gettotalorder`);
            
            if (response.data && Array.isArray(response.data.data)) {
                setOrders(response.data.data); 
            } else {
                console.error('Unexpected API Response:', response.data);
                setError('Unexpected API response');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalOrders();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
    
    if (error) return <p className="text-danger text-center mt-3">Error: {error}</p>;
    if (!orders.length) return <p className="text-center mt-3">No order data available</p>;

    return (
        <Container className="mt-3 px-4">
            <h1 className="mb-3">Order Summary</h1>
            <Row className="gy-2"> {/* Less gap between rows */}
                {orders.map((order, index) => (
                    <Col key={index} md={3} sm={6} xs={12} className="px-1"> {/* Less padding between columns */}
                        <Card className="p-2 text-center shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-1">{order.name}</Card.Title>
                                <Card.Text className="fw-bold">{order.total}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Page;
