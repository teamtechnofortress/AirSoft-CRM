'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal,Form} from 'react-bootstrap';
import ToastComponent from 'components/toastcomponent';
import { toast } from "react-toastify";
import OrderLineItem from '/sub-components/order/OrderLineItem.js'
import OrderModelAddress from '/sub-components/order/OrderModelAddress.js'
import OrderAllNotes from '/sub-components/order/OrderAllNotes.js'
import CustomerModelAddress from '/sub-components/customer/CustomerModelAddress.js'
import CustomerAddNotes from '/sub-components/customer/CustomerAddNotes.js'
import Link from 'next/link';

const ViewAllUsers = () => {
    const [customers, setCustomers] = useState([]); 
    const [cachedCustomer, setCachedCustomers] = useState({});
    const [filteredCache, setFilteredCache] = useState({});
    const [totalCustomer, setTotalCustomer] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [crmUser, setCrmUser] = useState([]); 
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [permissionList, setPermissionList] = useState([]);
    const [loginuserid,setLoginuserid] = useState();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                fetchFilterCustomer();
            } else {
                fetchAllUsers(currentPage);
            }
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    const tokedecodeapi = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/tokendecodeapi`);
            if (response.data?.data) {
                const id = response.data.data.userid;
                const permissions = response.data.data.permissions.map(p => p._id);
                // console.log("permissionList fetched successfully:", permissionList);
                setPermissionList(permissions);
                setLoginuserid(id);
                // return response.data.data;
            } else {
                console.error("Error fetching notes:", response.data.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
            return [];
        }
    };
    const customerPerPage = 20;
    const fetchAllUsers = async (page) => {
        if (cachedCustomer[page]) {
            setCustomers(cachedCustomer[page]); // ✅ Load from cache
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/customer/getallcustomer`, {
                params: { page}
            });
            if (response.data && response.data.data) {
                // console.log(response.data.data);
                setCustomers(response.data.data);
                setCachedCustomers(prevCache => ({
                    ...prevCache,
                    [page]: response.data.data // ✅ Store in cache
                }));
                if (page === 1) setTotalCustomer(response.data.Total);
            } else {
                console.error("Unexpected API Response:", response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Failed to fetch users!");
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterCustomer = async () => {
        if (filteredCache[searchTerm]) {
            setCustomers(filteredCache[searchTerm]);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/customer/filtercustomer`, { params: { search: searchTerm } });
            if (response.data?.data) {
                setCustomers(response.data.data);
                setFilteredCache(prevCache => ({ ...prevCache, [searchTerm]: response.data.data }));
            }
        } catch (error) {
            toast.error("Failed to fetch users!");
        } finally {
            setLoading(false);
        }
    };
    const fetchAllCRMUsers = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/user/viewalluser`);
            // console.log(response.data.data);

            if (response.data && response.data.data) {
                // console.log(response.data.data);
                setCrmUser(response.data.data);
            } else {
                console.error("Unexpected API Response:", response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Failed to fetch users!");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAllUsers(currentPage);
        }, [currentPage]);

        const handleNextPage = () => {
            if (currentPage < Math.ceil(totalCustomer / customerPerPage)) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        };
    
        // ✅ Handle Previous Page (No API Call, Uses Cache)
        const handlePreviousPage = () => {
            if (currentPage > 1) {
                setCustomers(cachedCustomer[currentPage - 1] || []);
                setCurrentPage(prevPage => prevPage - 1);
            }
        };
    

    useEffect(() => {
        tokedecodeapi();
        // fetchAllUsers(currentPage);  
        fetchAllCRMUsers();  
    }, []);

    const handeldeletecustomer = async (id) =>{
        console.log(id);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/customer/deletecustomer`,{id});
            if (response.data && response.data.data) {
                console.log(response.data.data);
                await fetchAllUsers();  
                toast.success("Customer deleted successfully!");
            } else {
                console.error("Unexpected API Response:", response.data);
                toast.error("Customer not delete!");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Customer not delete!");
        } finally {
            setLoading(false);
        }
    }
    // Filter customers based on search input
    const filteredCustomers = customers.filter(customer => 
        `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <Container fluid className="p-6">
            <ToastComponent />

            {/* Search Input */}
            <Form.Group className="mb-3">
                <Form.Control 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>

            <Row className="mt-4">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <Col key={customer.id} md={3} sm={6} xs={12} className="mb-4">
                            <Card style={{ width: "100%" }}>
                                <Card.Img 
                                    variant="top" 
                                    src={customer.avatar_url || "https://via.placeholder.com/150"} 
                                    style={{ height: "180px", objectFit: "cover" }} 
                                />
                                <Card.Body>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <Card.Title className="text-dark me-2 mb-2">
                                                {customer.first_name} {customer.last_name}
                                            </Card.Title>
                                        </div>
                                        <div>
                                            <DropdownButton
                                                as={ButtonGroup}
                                                id="dropdown-button-drop-up"
                                                drop="up"
                                                variant=""
                                                title={<i className="fa fa-ellipsis-v" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                                className=" mb-lg-0 dropup-orderaction"
                                                style={{padding:0,border:'none',backgroundColor: 'transparent',}}
                                            >
                                                {/* <Dropdown.Item as="a" >Edit order </Dropdown.Item> */}
                                                <Dropdown.Item eventKey="1">
                                                <CustomerModelAddress customer={customer} />
                                                {/* View detail */}
                                                </Dropdown.Item>

                                                <Dropdown.Item eventKey="2">
                                                {/* View detail */}
                                                </Dropdown.Item>

                                                {/* <Dropdown.Item eventKey="4">Custom fields</Dropdown.Item> */}
                                                <Dropdown.Item eventKey="3" >
                                                    <Link variant="" href={`/pages/customer/viewallnotes/${customer.id}`} passHref className="hover-customeraddnote">
                                                        View Notes
                                                    </Link>
                                                </Dropdown.Item>
                                                {/* <Dropdown.Item eventKey="6" onClick={() => duplicateorder(order.id)}>Duplicate order</Dropdown.Item> */}
                                                {permissionList.includes("67b46cce7b14d62c9c5850e9") && (
                                                    <>
                                                        <Dropdown.Item eventKey="4" href={`/pages/order/viewallorder?id=${customer.id}`} passHref className="hover-customeraddnote">View orders</Dropdown.Item>
                                                    </>
                                                )}
                                                {permissionList.includes("67b81fa41821f665a7493728") && (
                                                    <>
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item eventKey="5" className='text-danger' onClick={() => handeldeletecustomer(customer.id)} >Delete</Dropdown.Item>
                                                    </>
                                                )}
                                                {/* <Dropdown.Item eventKey="7" className='text-danger' onClick={() => deleteorder(order.id)} >Delete order</Dropdown.Item> */}
                                            </DropdownButton>
                                        </div>
                                    </div>
                                    <Card.Text>{customer.email || "No email provided"}</Card.Text>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <CustomerAddNotes customer={customer} crmUser={crmUser} loginuserid={loginuserid} />
                                        </div>
                                        <div>
                                            <Card.Text className="mb-0">{customer.is_paying_customer ? "Paid" : "Not Paid"}</Card.Text>
                                            <Card.Text>{customer.role}</Card.Text>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No users found.</p>
                )}
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
                            <li className={`page-item ${currentPage >= Math.ceil(totalCustomer / customerPerPage) ? "disabled" : ""}`}>
                                <button className="page-link" onClick={handleNextPage}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </Col>
            </Row>
        </Container>
    );
};

export default ViewAllUsers;
