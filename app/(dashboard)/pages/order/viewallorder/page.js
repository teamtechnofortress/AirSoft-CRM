'use client'

import React, { useEffect,useState,Fragment,useRef, useCallback} from 'react';
import axios from 'axios';
import { formatDistanceToNow } from "date-fns";

import Link from 'next/link';
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal, Form} from 'react-bootstrap';
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
    const [cachedOrders, setCachedOrders] = useState({});
    const [filteredCache, setFilteredCache] = useState({});
    const [totalOrders, setTotalOrders] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [statusList, setStatusList] = useState([]);
    
    const ordersPerPage = 20;
    const hasFetched = useRef(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        if (!hasFetched.current) {
            fetchAllOrders(currentPage);
            hasFetched.current = true;
        }
    }, []);
    
    useEffect(() => {
        if (statusFilter && statusFilter !== "all") { // Only fetch when status is set and not "all"
            fetchStatusOrders();
        } else {
            fetchAllOrders(currentPage); // Ensure default fetchAllOrders() runs when status is empty or "all"
        }
    }, [statusFilter]);

   

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                fetchFilteredOrders();
            } else {
                fetchAllOrders(currentPage);
            }
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, currentPage]);

    const fetchStatuses = useCallback(async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/gettotalorder`);
          if (Array.isArray(response.data.data)) {
            // Add "All" status at the beginning
            setStatusList([{ slug: "all", name: "All" }, ...response.data.data]);
          }
        } catch (err) {
          console.error("Failed to fetch statuses", err.message);
        }
      }, []);

      useEffect(() => {
        fetchStatuses();
      }, []);
    
    const fetchAllOrders = async (page) => {
        if (!searchTerm && cachedOrders[page]) {
            setOrders(cachedOrders[page]);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/getallorder`, {
                params: { page, customer_id: customerid }
            });
            if (response.data?.data) {
                setOrders(response.data.data);
                setCachedOrders(prevCache => ({ ...prevCache, [page]: response.data.data }));
                console.log(response.data.Total);
                if (page === 1) setTotalOrders(response.data.Total);
            }

        } catch (error) {
            toast.error("Failed to fetch orders!");
        } finally {
            setLoading(false);
        }
    };

     const fetchFilteredOrders = async () => {
        if (filteredCache[searchTerm]) {
            setOrders(filteredCache[searchTerm]);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/filterorders`, { params: { search: searchTerm } });
            if (response.data?.data) {
                setOrders(response.data.data);
                setFilteredCache(prevCache => ({ ...prevCache, [searchTerm]: response.data.data }));
            }
        } catch (error) {
            toast.error("Failed to fetch orders!");
        } finally {
            setLoading(false);
        }
    };

    const fetchStatusOrders = async () => {
        if (cachedOrders[statusFilter]) {
            setOrders(cachedOrders[statusFilter]);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/statusorder`, {
                params: { status: statusFilter }
            });
            if (response.data?.data) {
                setOrders(response.data.data);
                setCachedOrders(prevCache => ({ ...prevCache, [statusFilter]: response.data.data }));
                if (page === 1) setTotalOrders(response.data.Total);
                console.log(response.data.Total);
            }
        } catch (error) {
            // toast.error("Failed to fetch orders by status!");
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalOrders / ordersPerPage)) {
            setCurrentPage(prev => prev + 1);
            
        }
       
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
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
                        <Form.Group className="mb-3">
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search order" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                            </Form.Group>
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
                      <Tab.Container id="tab-container-1" activeKey={statusFilter} onSelect={(status) => setStatusFilter(status)}>
                        <Card>
                            <Card.Header className="border-bottom-0 p-0">
                            <Nav className="nav-lb-tab">
                                {statusList.map(status => (
                                <Nav.Item key={status.slug}>
                                    <Nav.Link eventKey={status.slug} className="mb-sm-3 mb-md-0">
                                    {status.name} 
                                    {/* {status.total !== undefined ? `(${status.total})` : ""} */}
                                    </Nav.Link>
                                </Nav.Item>
                                ))}
                            </Nav>
                            </Card.Header>

                            <Card.Body className="p-0">
                            <Tab.Content>
                                {statusList.map(status => (
                                <Tab.Pane key={status.slug} eventKey={status.slug} className="pb-4 p-4">
                                    <AllOrder
                                    handleorderStatusChange={handleorderStatusChange}
                                    statusList={statusList}
                                    orders={orders}
                                    fetchStatusOrders={fetchStatusOrders}
                                    status={status.slug}
                                    customerid={customerid}
                                    />
                                </Tab.Pane>
                                ))}
                            </Tab.Content>
                            </Card.Body>
                        </Card>
                        </Tab.Container>

                        </Col>
                    </Row>
                    
                    <Row className="mt-4">
                                        <Col className="d-flex justify-content-center">
                                            <nav>
                                                <ul className="pagination">
                                                    {/* Previous Button */}
                                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                        <button className="page-link" onClick={handlePreviousPage}>Previous</button>
                                                    </li>
                    
                                                    {/* Page Numbers */}
                                                    {/* {Array.from({ length: Math.ceil(totalProducts / productsPerPage) }, (_, index) => (
                                                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    ))} */}
                    
                                                    {/* Next Button */}
                                                    <li className={`page-item ${currentPage >= Math.ceil(totalOrders / ordersPerPage) ? "disabled" : ""}`}>
                                                        <button className="page-link" onClick={handleNextPage}>Next</button>
                                                    </li>
                                                </ul>
                                            </nav>
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

