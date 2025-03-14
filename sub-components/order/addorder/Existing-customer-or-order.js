import { Col, Row, Card, Nav, Tab, Button, Modal, Form } from "react-bootstrap";
import React, { useState, useMemo, useCallback } from "react";

// ✅ Move Modal Outside Parent Component to Prevent Re-renders
const MyVerticallyCenteredAddressModal = ({ 
  show, 
  onHide, 
  customers, 
  orders, 
  setFormData 
}) => {
  const [searchTermCustomer, setSearchTermCustomer] = useState("");
  const [searchTermOrder, setSearchTermOrder] = useState("");

  // ✅ Use useMemo to optimize search filtering
  const displayedCustomers = useMemo(() => {
    return searchTermCustomer.trim()
      ? customers.filter((customer) =>
        `${customer.billing?.first_name} ${customer.billing?.last_name} `?.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
          // customer.billing?.first_name?.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
          // customer.billing?.last_name?.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
          customer.billing?.email?.toLowerCase().includes(searchTermCustomer.toLowerCase())
        )
      : customers;
  }, [searchTermCustomer, customers]);

  const displayedOrders = useMemo(() => {
    return searchTermOrder.trim()
      ? orders.filter((order) =>
          `${order.billing?.first_name} ${order.billing?.last_name} `?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
          // order.billing?.first_name?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
          // order.billing?.last_name?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
          order.billing?.email?.toLowerCase().includes(searchTermOrder.toLowerCase()) ||
          order.number?.toString().includes(searchTermOrder)
        )
      : orders;
  }, [searchTermOrder, orders]);

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
                      {displayedCustomers.length > 0 ? (
                        displayedCustomers.map((customer, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              onHide();
                              setFormData({
                                firstname: customer.billing?.first_name || "",
                                lastname: customer.billing?.last_name || "",
                                email: customer.billing?.email || "",
                                phone: customer.billing?.phone || "",
                                country: customer.billing?.country || "",
                                province: customer.billing?.state || "",
                                city: customer.billing?.city || "",
                                zipcode: customer.billing?.postcode || "",
                                fulladdress: `${customer.billing?.address_1 || ""}, ${customer.billing?.country || ""}, ${customer.billing?.state || ""}, ${customer.billing?.city || ""} ${customer.billing?.postcode || ""}`,
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
                      {displayedOrders.length > 0 ? (
                        displayedOrders.map((order, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              onHide();
                              setFormData({
                                firstname: order.billing?.first_name || "",
                                lastname: order.billing?.last_name || "",
                                email: order.billing?.email || "",
                                phone: order.billing?.phone || "",
                                country: order.billing?.country || "",
                                province: order.billing?.state || "",
                                city: order.billing?.city || "",
                                zipcode: order.billing?.postcode || "",
                                fulladdress: `${order.billing?.address_1 || ""}, ${order.billing?.country || ""}, ${order.billing?.state || ""}, ${order.billing?.city || ""} ${order.billing?.postcode || ""}`,
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
const ExistingCustomerOrOrder = ({ orders, customers, setFormData }) => {
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
      />
    </>
  );
};

export default ExistingCustomerOrOrder;
