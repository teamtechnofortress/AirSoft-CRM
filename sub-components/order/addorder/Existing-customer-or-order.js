import { Col, Row, Card, Accordion, Nav, Tab, Tabs, Container,Button,Spinner,ListGroup,ListGroupItem,DropdownButton,ButtonGroup,Dropdown,Modal} from 'react-bootstrap';
import React, { useEffect,useState,Fragment } from 'react';
import axios from 'axios';


const ExistingCustomerOrOrder = ({orders,customers,setFormData}) => {
    const [modaladdressShow, setModaladdressShow] = React.useState(false);
    // console.log("customer",customers);    
    
    function MyVerticallyCenteredaddressModal(props) {
        return (
          <Modal
            {...props}            
            aria-labelledby="contained-modal-title-vcenter"
            centered
            contentClassName="custom-modal-content"
          >
            <Modal.Header closeButton className='border-0'> 
              <div className='d-flex justify-content-center align-items-center'>
                <Modal.Title id="contained-modal-title-vcenter">
                    Shipping address
                    {/* <p style={{ color:' #788589',margin: '0px',fontSize: '13px', }}>order #{}</p> */}
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body className='pb-0'>
              <Row>  
                <Col xl={12} lg={12} md={12} sm={12}>
                    {/* <div id="accordion-example" className="mb-4">
                        <h3>Example</h3>
                        <p>
                            Click the accordions below to expand/collapse the accordion
                            content.
                        </p>
                    </div> */}
                       <Tab.Container id="tab-container-1" defaultActiveKey="customer">
                            <Card>
                                <Card.Header className="border-bottom-0 p-0 ">
                                    <Nav className="nav-lb-tab">
                                        <Nav.Item>
                                            <Nav.Link eventKey="customer" className="mb-sm-3 mb-md-0">
                                              Customers
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="order" className="mb-sm-3 mb-md-0">
                                               Existing order
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Tab.Content style={{ height: '350px', overflowY: 'scroll' }}>
                                        <Tab.Pane eventKey="customer" className="pb-4 p-4">
                                            {/* <div>
                                                <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                                    <div>
                                                        // Dynamically set image source 
                                                      <Card.Img
                                                        variant="top"
                                                        src={'/images/avatar/avatar-2.jpg'} // Use item image if available
                                                        style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                                                        alt={"Product Image"}
                                                      />
                                                    </div>
                                                    <div>
                                                      <Card.Subtitle className="mb-3 mt-2" style={{ fontSize: 14 }}>
                                                        {'Unknown Product'}
                                                      </Card.Subtitle>
                                            
                                                      <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
                                                        SKU: {'N/A'}
                                                      </Card.Subtitle>
                                            
                                                      <Card.Subtitle className="mb-3" style={{ fontSize: 12 }}>
                                                        {} USD
                                                      </Card.Subtitle>
                                            
                                                      <Card.Subtitle style={{ fontSize: 12 }}>
                                                        Quantity: {}
                                                      </Card.Subtitle>
                                                    </div>
                                                </div>
                                            </div> */}
                                            { customers.map((customer, index) => (
                                              <div key={index} 
                                                  onClick={() => {
                                                    setModaladdressShow(false),
                                                    setFormData({
                                                      firstname: customer.billing?.first_name || '',
                                                      lastname: customer.billing?.last_name || '',
                                                      email: customer.billing?.email || '', 
                                                      phone: customer.billing?.phone || '',
                                                      country: customer.billing?.country || '',
                                                      province: customer.billing?.state || '',
                                                      city: customer.billing?.city || '',
                                                      zipcode: customer.billing?.postcode || '',
                                                      fulladdress:`${customer.billing?.address_1 || ''}, ${customer.billing?.country || ''}, ${customer.billing?.state || ''}, ${customer.billing?.city || ''} ${customer.billing?.postcode || ''}`
                                                    });
                                                  }}
                                                  style={{ cursor: "pointer" }}
                                              >
                                                  <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                                      <div>
                                                        {/* Dynamically set image source */}
                                                        <Card.Img
                                                          variant="top"
                                                          src={"/images/avatar/avatar-2.jpg"}
                                                          style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                                                          alt={"Product Image"}
                                                        />
                                                      </div>
                                                      <div>
                                                        <Card.Subtitle className="gap-3 d-flex justify-content-between align-items-center">
                                                          <div style={{ fontSize: 14 }}>
                                                            {customer.billing?.first_name || customer.billing?.last_name 
                                                              ? `${customer.billing?.first_name || ''} ${customer.billing?.last_name || ''}`.trim() 
                                                              : 'Unknown'}
                                                          </div>
                                                          <div style={{ fontSize: 12 }}>
                                                            <span className="text-muted"># {customer.id || 'N/A'}</span>
                                                          </div>
                                                        </Card.Subtitle>
                                                        <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                                          {customer.billing?.phone || 'N/A'}
                                                        </Card.Subtitle>
                                                        <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                                          {customer.billing?.address_1 || 'N/A'}, {customer.billing?.country || 'N/A'},{customer.billing?.state || 'N/A'} 
                                                        </Card.Subtitle>
                                                      </div>
                                                  </div>
                                              </div>
                                            ))}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="order" className="pb-4 p-4 react-code">
                                          { orders.map((order, index) => (
                                            <div key={index} 
                                                 onClick={() => {
                                                   setModaladdressShow(false),
                                                   setFormData({
                                                     firstname: order.billing?.first_name || '',
                                                     lastname: order.billing?.last_name || '',
                                                     email: order.billing?.email || '', 
                                                     phone: order.billing?.phone || '',
                                                     country: order.billing?.country || '',
                                                     province: order.billing?.state || '',
                                                     city: order.billing?.city || '',
                                                     zipcode: order.billing?.postcode || '',
                                                     fulladdress:`${order.billing?.address_1 || ''}, ${order.billing?.country || ''}, ${order.billing?.state || ''}, ${order.billing?.city || ''} ${order.billing?.postcode || ''}`
                                                     ,
                                                   });
                                                 }}
                                                 style={{ cursor: "pointer" }}
                                            >
                                                <div className="d-flex align-items-center justify-content-start mb-2 gap-2" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                                    <div>
                                                      {/* Dynamically set image source */}
                                                      <Card.Img
                                                        variant="top"
                                                        src={"/images/avatar/avatar-2.jpg"}
                                                        style={{ height: '85px', width: '85px', objectFit: 'cover' }}
                                                        alt={"Product Image"}
                                                      />
                                                    </div>
                                                    <div>
                                                      <Card.Subtitle className="gap-3 d-flex justify-content-between align-items-center">
                                                        <div style={{ fontSize: 14 }}>
                                                          {order.billing?.first_name || order.billing?.last_name 
                                                            ? `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() 
                                                            : 'Unknown'}
                                                        </div>
                                                        <div style={{ fontSize: 12 }}>
                                                          <span className="text-muted"># {order.number || 'N/A'}</span>
                                                        </div>
                                                      </Card.Subtitle>
                                                      <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                                        {order.billing?.phone || 'N/A'}
                                                      </Card.Subtitle>
                                                      <Card.Subtitle className="mt-2" style={{ fontSize: 12 }}>
                                                        {order.billing?.address_1 || 'N/A'}, {order.billing?.country || 'N/A'},{order.billing?.state || 'N/A'} 
                                                      </Card.Subtitle>
                                                    </div>
                                                </div>
                                            </div>
                                          ))}
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
                            </Card>
                        </Tab.Container>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className='border-0'>
              <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        );
    }
  return (
    <Fragment> 
        <Button variant="outline-primary" onClick={() => setModaladdressShow(true)}>
           Existing customer or order
        </Button>
        <MyVerticallyCenteredaddressModal show={modaladdressShow} onHide={() => setModaladdressShow(false)} />
    </Fragment>
  )
}

export default ExistingCustomerOrOrder