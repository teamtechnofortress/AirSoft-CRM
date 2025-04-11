import { Col, Row, Card, Nav, Tab, Button, Modal, Form,Spinner } from "react-bootstrap";
import React, { useState, useMemo, useCallback,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// ✅ Move Modal Outside Parent Component to Prevent Re-renders
const MyVerticallyCenteredAddressModal = ({ 
  show, 
  onHide, 
  setFormData, 
  setShippingData,
  customers: initialCustomers, 
  orders: initialOrders 
}) => {
  const [searchTermCustomer, setSearchTermCustomer] = useState("");
  const [searchTermOrder, setSearchTermOrder] = useState("");
  const [customers, setCustomers] = useState(initialCustomers);
  const [orders, setOrders] = useState(initialOrders);
  const [filteredCache, setFilteredCache] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTermCustomer) {
        fetchFilterCustomer();
      } else {
        setCustomers(initialCustomers);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTermCustomer, initialCustomers]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTermOrder) {
        fetchFilteredOrders();
      } else {
        setOrders(initialOrders);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTermOrder, initialOrders]);

  const fetchFilterCustomer = async () => {
    if (filteredCache[searchTermCustomer]) {
      setCustomers(filteredCache[searchTermCustomer]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/customer/filtercustomer`, { params: { search: searchTermCustomer } });
      if (response.data?.data) {
        setCustomers(response.data.data);
        setFilteredCache(prevCache => ({ ...prevCache, [searchTermCustomer]: response.data.data }));
      }
    } catch (error) {
      toast.error("Failed to fetch users!");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredOrders = async () => {
    if (filteredCache[searchTermOrder]) {
      setOrders(filteredCache[searchTermOrder]);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST}/oldapi/woocommerce/order/filterorders`, { params: { search: searchTermOrder } });
      if (response.data?.data) {
        setOrders(response.data.data);
        setFilteredCache(prevCache => ({ ...prevCache, [searchTermOrder]: response.data.data }));
      }
    } catch (error) {
      toast.error("Failed to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Use useMemo to optimize search filtering
  // const displayedCustomers = useMemo(() => {
  //   return searchTermCustomer.trim()
  //     ? customers.filter((customer) =>
  //       `${customer.billing?.first_name} ${customer.billing?.last_name} `?.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
  //         // customer.billing?.first_name?.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
  //         // customer.billing?.last_name?.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
  //         customer.billing?.email?.toLowerCase().includes(searchTermCustomer.toLowerCase())
  //       )
  //     : customers;
  // }, [searchTermCustomer, customers]);

  // const displayedOrders = useMemo(() => {
  //   return searchTermOrder.trim()
  //     ? orders.filter((order) =>
  //         `${order.billing?.first_name} ${order.billing?.last_name} `?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
  //         // order.billing?.first_name?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
  //         // order.billing?.last_name?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
  //         order.billing?.email?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
  //         order.number?.toString().includes(searchTermOrder)
  //       )
  //     : orders;
  // }, [searchTermOrder, orders]);

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="custom-modal-content">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>Shipping Address</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-0">
        <Row>
          <Col>
            <Tab.Container id="tab-container-1" defaultActiveKey="customer">
              <Card>
                <Card.Header className="border-bottom-0 p-0">
                  <Nav className="nav-lb-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="customer">Customers</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="order">Existing Orders</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body className="p-0">
                  <Tab.Content style={{ height: "350px", overflowY: "scroll" }}>
                    {/* Customers List */}
                    <Tab.Pane eventKey="customer" className="pb-4 p-4">
                      <Form.Control
                        type="text"
                        placeholder="Search Customers by Name or Email"
                        value={searchTermCustomer}
                        onChange={(e) => setSearchTermCustomer(e.target.value)}
                        className="mb-3"
                      />
                      {loading ? (
                        <div className="d-flex justify-content-center my-3">
                          <Spinner animation="border" variant="primary" />
                        </div>
                      ) : customers.length > 0 ? (
                        customers.map((customer, index) => (
                          // console.log(customer, "customer"),
                          <div
                            key={index}
                            onClick={() => {
                              onHide();
                              setFormData({
                                firstname: customer.billing?.first_name || "",
                                lastname: customer.billing?.last_name || "",
                                email: customer.billing?.email || "",
                                phone: customer.billing?.phone || "",
                                company: customer.billing?.company || "",
                                country: customer.billing?.country || "",
                                province: customer.billing?.state || "",
                                city: customer.billing?.city || "",
                                zipcode: customer.billing?.postcode || "",
                                addressline1: customer.billing?.address_1 || "",
                                addressline2: customer.billing?.address_2 || "",
                                // fulladdress: `${customer.billing?.address_1 || ""}, ${customer.billing?.country || ""}, ${customer.billing?.state || ""}, ${customer.billing?.city || ""} ${customer.billing?.postcode || ""}`,
                              });
                              setShippingData({
                                shippingfirstname: customer.shipping?.first_name || "",
                                shippinglastname: customer.shipping?.last_name || "",
                                shippingemail:  customer.shipping?.email || "", 
                                shippingcompany: customer.shipping?.company || "",
                                shippingcountry: customer.shipping?.country || "",
                                shippingprovince: customer.shipping?.state || "",
                                shippingphone: customer.shipping?.phone || "",
                                shippingcity: customer.shipping?.city || "",
                                shippingzipcode: customer.shipping?.postcode || "",
                                shippingaddressline1: customer.shipping?.address_1 || "",
                                shippingaddressline2: customer.shipping?.address_2 || "",
                                // shippingfulladdress:  `${customer.shipping?.address_1 || ""}, ${customer.shipping?.country || ""}, ${customer.shipping?.state || ""}, ${customer.shipping?.city || ""} ${customer.shipping?.postcode || ""}`,
                              });
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center justify-content-start mb-2 gap-2 px-3">
                              <Card.Img
                                variant="top"
                                src={"/images/avatar/avatar-2.jpg"}
                                style={{ height: "85px", width: "85px", objectFit: "cover" }}
                                alt={"Customer Image"}
                              />
                              <div>
                                <Card.Subtitle className="d-flex justify-content-between">
                                  <span style={{ fontSize: 14 }}>
                                    {customer.billing?.first_name || "Unknown"} {customer.billing?.last_name || ""}
                                  </span>
                                  {/* <span className="text-muted" style={{ fontSize: 12 }}># {customer.id || "N/A"}</span> */}
                                </Card.Subtitle>
                                <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                  {customer.billing?.phone || "N/A"}
                                </Card.Subtitle>
                                <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                  {customer.billing?.email || "N/A"}
                                </Card.Subtitle>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No customers found.</p>
                      )}
                    </Tab.Pane>

                    {/* Orders List */}
                    <Tab.Pane eventKey="order" className="pb-4 p-4">
                      <Form.Control
                        type="text"
                        placeholder="Search Orders by Name, Email or Order Number"
                        value={searchTermOrder}
                        onChange={(e) => setSearchTermOrder(e.target.value)}
                        className="mb-3"
                      />
                      {loading ? (
                        <div className="d-flex justify-content-center my-3">
                          <Spinner animation="border" variant="primary" />
                        </div>
                      ) : orders.length > 0 ? (
                        orders.map((order, index) => (
                          // console.log(order, "order"),
                          <div
                            key={index}
                            onClick={() => {
                              onHide();
                              setFormData({
                                firstname: order.billing?.first_name || "",
                                lastname: order.billing?.last_name || "",
                                email: order.billing?.email || "",
                                phone: order.billing?.phone || "",
                                company: order.billing?.company || "",
                                country: order.billing?.country || "",
                                customernote: order?.customer_note || "",
                                tranctionid: order?.transaction_id || "",
                                province: order.billing?.state || "",
                                city: order.billing?.city || "",
                                zipcode: order.billing?.postcode || "",
                                addressline1: order.billing?.address_1 || "",
                                addressline2: order.billing?.address_2 || "",
                                // fulladdress: `${order.billing?.address_1 || ""}, ${order.billing?.country || ""}, ${order.billing?.state || ""}, ${order.billing?.city || ""} ${order.billing?.postcode || ""}`,
                              });
                              setShippingData({
                                shippingfirstname: order.shipping?.first_name || "",
                                shippinglastname: order.shipping?.last_name || "",
                                shippingemail:  order.shipping?.email || "", 
                                shippingcompany: order.shipping?.company || "",
                                shippingcountry: order.shipping?.country || "",
                                shippingprovince: order.shipping?.state || "",
                                shippingphone: order.shipping?.phone || "",
                                shippingcity: order.shipping?.city || "",
                                shippingaddressline1: order.shipping?.address_1 || "",
                                shippingaddressline2: order.shipping?.address_2 || "",
                                // shippingfulladdress:  `${order.shipping?.address_1 || ""}, ${order.shipping?.country || ""}, ${order.shipping?.state || ""}, ${order.shipping?.city || ""} ${order.shipping?.postcode || ""}`,
                              });
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center justify-content-start mb-2 gap-2 px-3">
                              <Card.Img
                                variant="top"
                                src={"/images/avatar/avatar-2.jpg"}
                                style={{ height: "85px", width: "85px", objectFit: "cover" }}
                                alt={"Order Image"}
                              />
                              <div>
                                <Card.Subtitle className="d-flex justify-content-between">
                                  <span style={{ fontSize: 14 }}>
                                    {order.billing?.first_name || "Unknown"} {order.billing?.last_name || ""}
                                  </span>
                                  <span className="text-muted ms-3" style={{ fontSize: 12 }}># {order.number || "N/A"}</span>
                                </Card.Subtitle>
                                <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                  {order.billing?.phone || "N/A"}
                                </Card.Subtitle>
                                <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                  {order.billing?.email || "N/A"}
                                </Card.Subtitle>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No orders found.</p>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0">
          <Button onClick={() => { onHide() }}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
};

// ✅ Parent Component
const ExistingCustomerOrOrder = ({ orders, customers, setFormData,setShippingData }) => {
  const [modalAddressShow, setModalAddressShow] = useState(false);
  return (
    <>
      <Button variant="outline-primary" onClick={() => setModalAddressShow(true)}>
        Existing customer or order
      </Button>
      <MyVerticallyCenteredAddressModal 
        show={modalAddressShow} 
        onHide={() => setModalAddressShow(false)} 
        customers={customers} 
        orders={orders} 
        setFormData={setFormData} 
        setShippingData={setShippingData}
      />
    </>
  );
};

export default ExistingCustomerOrOrder;
