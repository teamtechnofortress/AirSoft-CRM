"use client";

import React, { useEffect, useState,Fragment,useCallback  } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Form, Button,Tab,Nav } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Link from "next/link";

const Page = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [allnotes, setAllnotes] = useState([]);
  const [dateRange, setDateRange] = useState({ date_min: "", date_max: "" });
  const [permissionList, setPermissionList] = useState([]);
  const [userid, setUserid] = useState([]);
    
  const tokedecodeapi = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/tokendecodeapi`);
            if (response.data?.data) {
                // console.log(response.data.data);
                const permissions = response.data.data.permissions.map(p => p._id);
                const id = response.data.data.userid;
                // console.log(id);
                // setUserid(response.data.data._id);
                // console.log("permissionList fetched successfully:", permissionList);
                setPermissionList(permissions);
                return id;
            } else {
                console.error("Error fetching notes:", response.data.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            return [];
        }
  };

  const fetchTotalOrders = useCallback(async () => {
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
  }, []); // ✅ Now it won’t cause infinite renders
  
  // const fetchTotalOrders = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/gettotalorder`);
  //     if (response.data && Array.isArray(response.data.data)) {
  //       setOrders(response.data.data);
  //     } else {
  //       setError("Unexpected API response");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const fetchallnotes = async () => {
  //   try {
  //     const id = await tokedecodeapi();
  //     // console.log(id);
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/customer/getnote/${id}`);
  //     // console.log(response);
  //     // console.log(response.data);
  //     // console.log(response.data.data);
  //     if (response.data && Array.isArray(response.data.data)) {
  //       setAllnotes(response.data.data);
  //     } else {
  //       setError("Unexpected API response");
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchallnotes = useCallback(async () => {
    setLoading(true);
    setError(null);
  
    try {
      const id = await tokedecodeapi();
      if (!id) return;
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/customer/getnote/${id}`);
      if (response.data && Array.isArray(response.data.data)) {
        setAllnotes(response.data.data);
      } else {
        setError("Unexpected API response");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Now it's memoized and won't trigger infinite renders

  useEffect(() => {
    fetchTotalOrders();
    fetchallnotes();
  }, [fetchTotalOrders, fetchallnotes]); // ✅ Now stable
  

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
    <>
    {/* <Container className="mt-3 px-4">
      <div>
        <div>
          <h3 className="mb-3">Order Summary</h3>
        </div>
      </div>

      <Row className="gy-2">
        {orders.map((order, index) => (
          <Col key={index} md={3} sm={6} xs={12} className="px-1">
            <Card className="p-2 text-center shadow-sm border  border-primary">
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
    </Container> */}
    <Fragment>
        <div className="bg-primary pt-10 pb-21"></div>
        <Container fluid className="mt-n22 px-6">
          <Row>
            <Col lg={12} md={12} xs={12}>
                {/* Page header */}
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="mb-2 mb-lg-0">
                            <h3 className="mb-0  text-white">Analytics</h3>
                        </div>
                        <div>
                            <Link href="#" className="btn btn-white">Analytics</Link>
                        </div>
                    </div>
                </div>
            </Col>
            {/* {ProjectsStatsData.map((item, index) => {
                return (
                    <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                        <StatRightTopIcon info={item} />
                    </Col>
                )
            })} */}
          </Row>
          <Row>
              <Col xl={12} lg={12} md={12} sm={12}>
                  {/* <div id="accordion-example" className="mb-4">
                      <h3>Example</h3>
                      <p>
                          Click the accordions below to expand/collapse the accordion
                          content.
                      </p>
                  </div> */}
                  <Tab.Container id="tab-container-1" defaultActiveKey="all">
                      <Card>
                          <Card.Header className="border-bottom-0 p-0 ">
                              <Nav className="nav-lb-tab">
                                  <Nav.Item>
                                      <Nav.Link eventKey="all" className="mb-sm-3 mb-md-0">
                                          Order Summary
                                      </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item>
                                      <Nav.Link eventKey="instock" className="mb-sm-3 mb-md-0">
                                          Sale Summary
                                      </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item>
                                      <Nav.Link eventKey="notes" className="mb-sm-3 mb-md-0">
                                          Notes
                                      </Nav.Link>
                                  </Nav.Item>
                                  <Nav.Item>
                                      <Nav.Link eventKey="task" className="mb-sm-3 mb-md-0">
                                          Tasks
                                      </Nav.Link>
                                  </Nav.Item>
                              </Nav>
                          </Card.Header>
                          <Card.Body className="p-0">
                              <Tab.Content>
                                  <Tab.Pane eventKey="all" className="pb-4 p-4">
                                    <Row className="gy-2">
                                      {orders.map((order, index) => (
                                        <Col key={order.id || index} md={3} sm={6} xs={12} className="px-1">
                                          <Card className="p-2 text-center shadow-sm border  border-primary">
                                            <Card.Body>
                                              <Card.Title className="mb-1">{order.name}</Card.Title>
                                              <Card.Text className="fw-bold">{order.total}</Card.Text>
                                            </Card.Body>
                                          </Card>
                                        </Col>
                                      ))}
                                    </Row>
                                      
                                      {/* Active Projects  */}
                                      {/* <ActiveProjects /> */}
                                    
                                  </Tab.Pane>
                                  <Tab.Pane eventKey="instock" className="pb-4 p-4 react-code">
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
                                  </Tab.Pane>
                                  <Tab.Pane eventKey="notes" className="pb-4 p-4 react-code">
                                    <div>
                                        {
                                          allnotes.map((note, index) => (
                                            <div key={index || note._id}>
                                            <p 
                                              className="border bg-primary text-white p-2"
                                              style={{ 
                                                borderRadius: '20px', 
                                                display: 'inline-block',  
                                                maxWidth: '70%',         
                                                padding: '8px 12px',     
                                                wordWrap: 'break-word',  
                                                whiteSpace: 'pre-line',  
                                                margin: '5px 30% 5px auto'
                                              }}
                                            >
                                              <div className="mb-1">
                                                <span>Customer: {note.customername}</span>
                                              </div>
                                              <span>
                                                  Note: {note.note}
                                              </span>
                                            </p>
                                            </div>
                                          ))
                                          }
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane eventKey="task" className="pb-4 p-4 react-code">
                                  </Tab.Pane>
                              </Tab.Content>
                          </Card.Body>
                      </Card>
                  </Tab.Container>
              </Col>
          </Row>
          {/* <Row className="my-6">
              <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">

                  // Tasks Performance
                  <TasksPerformance />

              </Col>
              // card 
              <Col xl={8} lg={12} md={12} xs={12}>

                  // Teams
                  <Teams />

              </Col>
          </Row> */}
        </Container>
    </Fragment>
    </>

  );
};

export default Page;
