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
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 

    const fetchAllProducts = async () => {
        let page = 1;

        try {
            while (true) {
                console.log(`Fetching Page: ${page}`); // Debugging log

                const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`, {
                    params: { page }
                });

                if (response.data && response.data.data.length > 0) {
                    setProducts(prevProducts => [...prevProducts, ...response.data.data]); // ✅ Update state after each page
                    // await delay(500);
                    if (response.data.data.length === 100) {
                        page++; // ✅ Continue fetching next page
                    } else {
                        break; // ✅ Stop if less than 100 products (last page)
                    }
                } else {
                    console.error("Unexpected API Response:", response.data);
                    break;
                }
            }

            setLoading(false); // ✅ Set loading to false when all pages are loaded

        } catch (error) {
            console.error("Error fetching data:", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true; // ✅ Ensuring API runs only once
            fetchAllProducts();
        }
    }, []);

    // const fetchAllProducts = async (pageNumber = 1, accumulatedProducts = []) => {
    //     try {
    //         const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/getallproduct`, {
    //             params: { page: pageNumber }
    //         });

    //         if (response.data && response.data.data) {
    //             const newProducts = [...accumulatedProducts, ...response.data.data];

    //             if (response.data.data.length === 100) {
    //                 await fetchAllProducts(pageNumber + 1, newProducts);
    //             } else {
    //                 setProducts(newProducts);
    //                 setLoading(false);
    //             }
    //         } else {
    //             console.error("Unexpected API Response:", response.data);
    //             setLoading(false);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error.message);
    //         setLoading(false);
    //     }
    // };




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
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-white">Products</h3>
                                </div>
                                <div>
                                    <Link href="#" className="btn btn-white">Products</Link>
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
                                            <Nav.Link eventKey="instock" className="mb-sm-3 mb-md-0">
                                                InStock
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="outofstock" className="mb-sm-3 mb-md-0">
                                                Out OF Stock
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="backorder" className="mb-sm-3 mb-md-0">
                                                Back Order
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Tab.Content>
                                        <Tab.Pane eventKey="all" className="pb-4 p-4">
                                            <AllProducts products={products} status={'all'} />
                                            {/* Active Projects  */}
                                            {/* <ActiveProjects /> */}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="instock" className="pb-4 p-4 react-code">
                                            {/* <InStockProducts products={products} status={'all'}  /> */}
                                            <AllProducts products={products} status={'instock'} />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="outofstock" className="pb-4 p-4 react-code">
                                            {/* <OutOfStockProducts products={products} status={'all'} /> */}
                                            <AllProducts products={products} status={'outofstock'} />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="backorder" className="pb-4 p-4 react-code">
                                            {/* <BackOrrderStockProducts products={products} status={'all'}  /> */}
                                            <AllProducts products={products} status={'onbackorder'} />
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
    )
}
export default Home;
