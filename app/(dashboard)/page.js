"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Page = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState({ date_min: "", date_max: "" });

  const fetchTotalOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/gettotalorder`);
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        setError("Unexpected API response");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalOrders();
  }, []); 

  const fetchTotalSale = async () => {
    if (!dateRange.date_min || !dateRange.date_max) {
      setError("Please select a date range.");
      return;
    }

    setFilterLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/gettotalsale`, {
        params: dateRange,
      });

      if (response.data?.data?.length > 0) {
        const sales = response.data.data[0];

        const salesParams = [
          { key: "total_sales", title: "Total Sales" },
          { key: "net_sales", title: "Net Sales" },
          { key: "average_sales", title: "Average Sales" },
          { key: "total_orders", title: "Total Orders" },
          { key: "total_items", title: "Total Items" },
          { key: "total_tax", title: "Total Tax" },
          { key: "total_shipping", title: "Total Shipping" },
          { key: "total_discount", title: "Total Discount" },
        ];

        setSalesData(salesParams);

        // Generate chart data
        const updatedChartData = {};
        salesParams.forEach(({ key }) => {
          updatedChartData[key] = generateChartData(dateRange.date_min, dateRange.date_max, sales[key]);
        });

        setChartData(updatedChartData);
      } else {
        setSalesData([]);
        setError("No sales data available.");
      }
    } catch (error) {
      setError("Error fetching data.");
    } finally {
      setFilterLoading(false);
    }
  };

  function generateChartData(startDate, endDate, totalValue) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) return [];

    const dailyValue = totalValue / days;
    const data = [];

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const formattedDate = currentDate.toISOString().split("T")[0];

      data.push({
        date: formattedDate,
        value: Math.round(dailyValue),
      });
    }

    return data;
  }
  if (loading) {
          return (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                  <Spinner animation="border" variant="primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </Spinner>
              </div>
          );
      }

  return (
    <Container className="mt-3 px-4">
      <div>
        <div>
          <h3 className="mb-3">Order Summary</h3>
        </div>
      </div>

      <Row className="gy-2">
        {orders.map((order, index) => (
          <Col key={index} md={3} sm={6} xs={12} className="px-1">
            <Card className="p-2 text-center shadow-sm">
              <Card.Body>
                <Card.Title className="mb-1">{order.name}</Card.Title>
                <Card.Text className="fw-bold">{order.total}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="mb-4 mt-3">Sales Summary</h3>

      <Row className="mb-3">
        <Col md={5}>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={dateRange.date_min}
              onChange={(e) => setDateRange({ ...dateRange, date_min: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={dateRange.date_max}
              onChange={(e) => setDateRange({ ...dateRange, date_max: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="primary" onClick={fetchTotalSale} disabled={filterLoading}>
            {filterLoading ? "Loading..." : "Filter"}
          </Button>
        </Col>
      </Row>

      {filterLoading && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <p className="text-danger text-center">Error: {error}</p>}
      {!filterLoading && salesData.length === 0 && <p className="text-center">No sales data available</p>}

      {!filterLoading && Object.keys(chartData).length > 0 && (
        <>
          {salesData.map(({ key, title }) => (
            <Card className="p-3 shadow-sm mb-4" key={key}>
              <Card.Body>
                <h5 className="text-center">{title}</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData[key]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default Page;
