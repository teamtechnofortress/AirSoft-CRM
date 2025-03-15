'use client'

import React, { useEffect,useState,Fragment,useRef} from 'react';
import axios from 'axios';
import { formatDistanceToNow } from "date-fns";

import Link from 'next/link';
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { HighlightCode } from 'widgets';
import {
	AccordionBasicCode,
	AccordionFlushCode
} from 'data/code/AccordionCode';
import AllOrder from '/sub-components/order/orderfilter/AllOrder.js'
import { useSearchParams } from "next/navigation";
import OrderLineItem from '/sub-components/order/OrderLineItem.js'
import OrderModelAddress from '/sub-components/order/OrderModelAddress.js'
import OrderModelNote from '/sub-components/order/OrderModelNote.js'


// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, 
    TasksPerformance 
} from "sub-components";
import InStockProducts from "/sub-components/dashboard/InStockProducts.js";
import OutOfStockProducts from "/sub-components/dashboard/OutOfStockProducts.js";



// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

const ViewAllOrder = () => {
    const searchParams = useSearchParams();
    const customerid = searchParams.get("id");
    // console.log(id);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const hasFetched = useRef(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchAllOrders = async () => {
        let page = 1;

        try {
            while (true) {
                console.log(`Fetching Orders - Page: ${page}`); // Debugging log

                const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/getallorder`, {
                    params: { page, customer_id: customerid } // Include customer ID if needed
                });

                if (response.data && response.data.data.length > 0) {
                    setOrders(prevOrders => [...prevOrders, ...response.data.data]); // ✅ Merge new orders with existing ones
                    setLoading(false); // ✅ Ensure loading is set to false after fetching

                    if (response.data.data.length === 100) {
                        page++; // ✅ Fetch next page
                        // await delay(500); // Optional delay to prevent API rate limiting
                    } else {
                        break; // ✅ Stop when less than 100 orders are returned (last page)
                    }
                } else {
                    console.error("Unexpected API Response:", response.data);
                    break;
                }
            }

        } catch (error) {
            console.error("Error fetching orders:", error.message);
        } finally {
            setLoading(false); // ✅ Ensure loading is set to false after fetching
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true; // ✅ Ensure API only runs once
            fetchAllOrders();
        }
    }, []);
    const handleorderStatusChange = async (newStatus,id) => {
        try {
            // console.log('New Status:', newStatus);
            // console.log('New id:', id);
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/orderstatuschnage`,{status: newStatus, id: id});
            // console.log('Response:', response.data.status);
            if (response.data.status === "success") {
                // Handle successful response (e.g., show a message or reset the form)
                await fetchAllOrders();
                toast.success("Order status chnaged successfully!");
                // console.log('successfully', response.data);
            } else {
                toast.error("Order status not chnage Added!");
                // console.log('Error:', response.data.message);
            }
        } catch (error) {
          console.error("Error submitting form:", error)
        }finally{
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
    
    return (
        <>
            <ToastComponent />
            <Fragment>
                <div className="bg-primary pt-10 pb-21"></div>
                <Container fluid className="mt-n22 px-6">
                    <Row>
                        <Col lg={12} md={12} xs={12}>
                            {/* Page header */}
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="mb-2 mb-lg-0">
                                        <h3 className="mb-0  text-white">Orders</h3>
                                    </div>
                                    <div>
                                        <Link href="#" className="btn btn-white">Orders</Link>
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
                                                    All
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="pending" className="mb-sm-3 mb-md-0">
                                                    Pending
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="processing" className="mb-sm-3 mb-md-0">
                                                    Processing
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="on-hold" className="mb-sm-3 mb-md-0">
                                                    On-hold
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="completed" className="mb-sm-3 mb-md-0">
                                                    Completed
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="cancelled" className="mb-sm-3 mb-md-0">
                                                    Cancelled
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="refunded" className="mb-sm-3 mb-md-0">
                                                    Refunded
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="draft" className="mb-sm-3 mb-md-0">
                                                  Draft
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="failed" className="mb-sm-3 mb-md-0">
                                                    Failed
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Tab.Content>
                                            <Tab.Pane eventKey="all" className="pb-4 p-4">
                                                <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'all'} customerid={customerid} />
                                            </Tab.Pane>
                        
                                            <Tab.Pane eventKey="pending" className="pb-4 p-4 react-code">
                                              <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'pending'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="processing" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'processing'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="on-hold" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'on-hold'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="completed" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'completed'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="cancelled" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'cancelled'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="refunded" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'refunded'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="draft" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'checkout-draft'} customerid={customerid}  />
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="failed" className="pb-4 p-4 react-code">
                                             <AllOrder orders={orders} handleorderStatusChange={handleorderStatusChange} fetchAllOrders={fetchAllOrders} status={'failed'} customerid={customerid}  />
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
        
    )
}
export default ViewAllOrder;

