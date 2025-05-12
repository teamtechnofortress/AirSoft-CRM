'use client'

import React, { useEffect,useState,Fragment,useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import Link from 'next/link';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Spinner, Form } from 'react-bootstrap';
import { HighlightCode } from 'widgets';
import {
	AccordionBasicCode,
	AccordionFlushCode
} from 'data/code/AccordionCode';


// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, 
    TasksPerformance 
} from "sub-components";
import AllProducts from "/sub-components/dashboard/AllProducts.js";
import InStockProducts from "/sub-components/dashboard/InStockProducts.js";
import OutOfStockProducts from "/sub-components/dashboard/OutOfStockProducts.js";
import BackOrrderStockProducts from "/sub-components/dashboard/BackOrrderStockProducts.js";



// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const Home = () => {
    const [products, setProducts] = useState([]); // ✅ Stores products for the current page
    const [cachedProducts, setCachedProducts] = useState({}); // ✅ Stores all fetched pages
    const [filteredCache, setFilteredCache] = useState({});
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [stockStatus, setStockStatus] = useState("all");
    const [searchField, setSearchField] = useState('search');

    const productsPerPage = 20; // ✅ Show 10 products per page
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchProducts(currentPage, "all");
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        fetchStockStatusProducts();
    }, [stockStatus]);

    

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                fetchFilteredProducts(searchField, searchTerm);
            } else {
                fetchProducts(currentPage);
            }
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchField, currentPage]);

    // ✅ Fetch Products (Only If Not in Cache)
    const fetchProducts = async (page, stock_status) => {
        const cacheKey = `${stock_status}-${page}`;
        if (cachedProducts[cacheKey]) {
            setProducts(cachedProducts[cacheKey]);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`, {
                params: { page, stock_status }
            });

            if (response.data && response.data.data.length > 0) {
                setProducts(response.data.data);
                setCachedProducts(prevCache => ({
                    ...prevCache,
                    [cacheKey]: response.data.data // ✅ Store in cache
                }));
                if (page === 1) setTotalProducts(response.data.Total); // ✅ Set total count on first load
            }
        } catch (error) {
            toast.error("Failed to fetch products!");
        } finally {
            setLoading(false);
        }
    };

    const fetchStockStatusProducts = () => {
        fetchProducts(currentPage, stockStatus);
    };

    const fetchFilteredProducts = async (field = searchField, term = searchTerm) => {
        const cacheKey = `${field}-${term}`;
        if (filteredCache[cacheKey]) {
            setProducts(filteredCache[cacheKey]);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/filterproducts`, {
                params: { searchby: field, search: term }
            });
            if (response.data?.data) {
                setProducts(response.data.data);
                setFilteredCache(prev => ({ ...prev, [cacheKey]: response.data.data }));
            }
        } catch (error) {
            toast.error("Failed to fetch products!");
        } finally {
            setLoading(false);
        }
    };

    
    // ✅ Handle Next Page (Fetch if Not Cached)
    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalProducts / productsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    // ✅ Handle Previous Page (No API Call, Uses Cache)
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setProducts(cachedProducts[currentPage - 1] || []);
            setCurrentPage(prevPage => prevPage - 1);
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
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 className="mb-0 text-white">Products</h3>
                            <Link href="#" className="btn btn-white">Products</Link>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <Form.Group className="mb-3">
                            <Form.Select
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                            >
                                <option value="search">Name / Keyword</option>
                                <option value="sku">SKU</option>
                                {/* <option value="category">Category ID</option>
                                <option value="tag">Tag ID</option>
                                <option value="min_price">Min Price</option>
                                <option value="max_price">Max Price</option> */}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col lg={8}>
                        <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search for products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        </Form.Group>
                    </Col>
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
                                <Tab.Container id="tab-container-1" activeKey={stockStatus} onSelect={(status) => setStockStatus(status)}>
                                <Card>
                                    <Card.Header className="border-bottom-0 p-0">
                                        <Nav className="nav-lb-tab">
                                            {["all", "instock", "outofstock", "onbackorder"].map(status => (
                                                <Nav.Item key={status}>
                                                    <Nav.Link eventKey={status} className="mb-sm-3 mb-md-0">
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </Nav.Link>
                                                </Nav.Item>
                                            ))}
                                        </Nav>
                                    </Card.Header>
                                    <Card.Body className="p-0">
                                        <Tab.Content>
                                            {["all", "instock", "outofstock", "onbackorder"].map(status => (
                                                <Tab.Pane key={status} eventKey={status} className="pb-4 p-4">
                                                    <AllProducts products={products} fetchStockStatusProducts={fetchStockStatusProducts} stockStatus={status} />
                                                </Tab.Pane>
                                            ))}
                                        </Tab.Content>
                                    </Card.Body>
                                </Card>
                            </Tab.Container>
                        </Col>
                    </Row>

                {/* ✅ Render AllProducts Component */}
                <AllProducts products={products} status={'all'} />
                 

                {/* ✅ Pagination UI */}
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
                                <li className={`page-item ${currentPage >= Math.ceil(totalProducts / productsPerPage) ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={handleNextPage}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default Home;
