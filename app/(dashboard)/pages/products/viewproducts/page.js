'use client'

import React, { useEffect,useState,Fragment,useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import Link from 'next/link';
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Spinner } from 'react-bootstrap';
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
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const productsPerPage = 20; // ✅ Show 10 products per page

    // ✅ Fetch Products (Only If Not in Cache)
    const fetchProducts = async (page) => {
        if (cachedProducts[page]) {
            setProducts(cachedProducts[page]); // ✅ Load from cache
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`, {
                params: { page}
            });

            if (response.data && response.data.data.length > 0) {
                setProducts(response.data.data);
                setCachedProducts(prevCache => ({
                    ...prevCache,
                    [page]: response.data.data // ✅ Store in cache
                }));
                if (page === 1) setTotalProducts(response.data.Total); // ✅ Set total count on first load
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]); // ✅ Fetch only when page changes

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
